var http = require('http');
var https = require('https');
var util = require('util');

var needle = require('needle');
var _ = require('underscore');

var Counter = require('./counter');


var LoadTester = function (options) {

  var self = this;
  var options = options;
  // TODO: Maybe find a better, more generic name for this parameter.
  // Also - this could be used as querystring as well thanks to needle with
  // a few tweaks.
  var requestGenerator = options.requestGenerator;

  // Check options and set defaults
  if (!options.url) {
    throw Error("the 'url' filed must be set in the options.");
  }
  if (!options.requestPerSec) {
    throw Error("the 'requestPerSec' filed must be set in the options.");
  }
  if (!options.keepAlive) {
    options.keepAlive = true;
  }
  if (!options.socketPoolSize) {
    options.socketPoolSize = (options.keepAlive?0:1000) + options.requestPerSec * 3; // seems to be a sensible default value
  }
  if (typeof requestGenerator == "function") {
    if (!options.method) {
      options.method = "POST"
    }
  } else {
    if (typeof requestGenerator != "undefined") {
      throw Error("requestGenerator must be a function");
    }
    if (!options.method) {
      options.method = "GET";
    }
  }
  if (options.responseCallback && typeof options.responseCallback != "function") {
    throw Error("'responseCallback' must be a function");
  }
  // if (options.url.match(/^https/)) {
  //   var rootCas = require('ssl-root-cas/latest').create();
  //   https.globalAgent.options.ca = rootCas;
  // }

  this._timer = null;
  this._testStart = null;
  var _counter = new Counter({intervals: ["*", 1000]}); // per sec refresh rate for counters + total (*)
  var Agent = options.url.match(/^https/) ? https.Agent : http.Agent;
  var httpAgent = new Agent({
    keepAlive: options.keepAlive,
    maxSockets: options.socketPoolSize,
    maxFreeSockets: Math.floor(options.socketPoolSize/10),
    // ca: rootCas
    // test this out..
    // ciphers: 'DES-CBC3-SHA'
  });

  var sendRequest = function () {
    var body = null;
    var requestData = null;
    if (requestGenerator) {
      requestData = requestGenerator();
      body = requestData.body;
    }
    var startTime = new Date();
    var needleOptions = {
      open_timeout: 10000,
      read_timeout: 10000,
      agent: httpAgent,
      // This one will disable cert validation. This is something we will
      // not want to do for load testing
      rejectUnauthorized: false

    };
    if (typeof body == "object" && options.method == "POST") {
      needleOptions.json = true;
    }
    if (requestData && requestData.options.headers) {
      needleOptions.headers = requestData.options.headers;
    }
    needle.request(options.method, options.url, body, needleOptions, function (err, resp) {
      var endTime = new Date();
      var durationInMillis = endTime - startTime;
      // update starts
      _counter.add("responseReceived", 1);
      self._testResponseCounter++;
      if (err) {
        if (err.code == "ECONNRESET") {
          // TODO: This is the error in case of request is aborted
          // but maybe the same error would appear if host is not
          // reachable or network is unavailable.
          _counter.add("requestTimeout", 1);
        } else {
          _counter.add("responseError", 1);
          _counter.add("responseErrorTime", durationInMillis);
        }
        return;
      }
      if (resp.statusCode != 200) {
        _counter.add("responseStatusError", 1);
        _counter.add("responseStatusError-" + resp.statusCode, 1);
        _counter.add("responseStatusErrorTime", durationInMillis);
        return;
      }

      var responseWasSuccessfull = true;
      if (options.responseCallback) {
        try {
          function counterAddFn(counterName, increaseValue) {
            if (counterName.indexOf('-') >= 0) {
              throw new Error("The specified counter name '" + counterName + "' should not contain any '-' character.");
            }
            _counter.add("custom-" + counterName, increaseValue);
          }
          // TODO: The fist param should not be null but should be the request object if this is something we can get from needle.
          responseWasSuccessfull = (options.responseCallback(null, resp, counterAddFn) !== false);
        } catch (e) {
          // The user's callback was throwing something so we assume
          // it means the response is not ok.
          responseWasSuccessfull = false;
        }
      }
      if (responseWasSuccessfull) {
        _counter.add("responseOk", 1);
        _counter.add("responseOkTime", durationInMillis);
      }

    });
    _counter.add("requestSent", 1);
    self._testRequestCounter++;

    // Schedule the next run
    var testTimeInMillis = (new Date()) - self._testStart;
    var nextTickTimeDelta = (self._testRequestCounter + 1) / options.requestPerSec * 1000 - testTimeInMillis;
    if (nextTickTimeDelta > 0) {
      self._timer = setTimeout(sendRequest, nextTickTimeDelta);
    } else {
      self._timer = setImmediate(sendRequest);
    }
  }

  this.start = function () {
    this._testStart = new Date();
    this._testRequestCounter = 0;
    this._timer = setImmediate(sendRequest);
    // Configure persisted counters to get detailed stats later
    _counter.persistCounterResults("responseOkTime", ["min", "max", "mean", "topAt:0.01", "topAt:0.05", "reqPerSec"]);
  }

  this.stop = function () {
    if (this._timer._onImmediate) {
      clearImmediate(this._timer);
    } else {
      clearTimeout(this._timer);
    }
  }

  this.stats = function (calcuateDetailedMetrics) {

    var stats =  _counter.getAll();
    if (calcuateDetailedMetrics) {
      _.extend(stats, _counter.calculateMetrics());
    }

    var ret = {};
    var statMapper = {};
    statMapper.total = stats._all;
    var lastSecStats = stats['lastComplete-1000'] || null;
    if (lastSecStats && !calcuateDetailedMetrics) {
      statMapper.currentLastSec = lastSecStats;
    }
    for(statKey in statMapper) {
      var statObj = statMapper[statKey];
      ret[statKey] = {
        requestSent: statObj.requestSent,
        responseReceived: statObj.responseReceived || 0,
        avgResponseTime: statObj.responseOkTime / statObj.responseOk || 0,
        responseSuccessRatio: statObj.responseOk / statObj.responseReceived || 0,
        requestTimeouts: statObj.requestTimeout || 0,
        unknownResponseErrors: statObj.responseError || 0,
        non200HTTPResponses: statObj.responseStatusError || 0,
        non200HTTPResponseBreakdown: (function () {
          var resultObj = {};
          for(key in statObj) {
            if (key.indexOf('responseStatusError-') == 0) {
              resultObj[key.substring('responseStatusError-'.length)] = statObj[key];
            }
          }
          return resultObj;
        })(),
        // Add all 'custom-*' counter values to the result set
        custom: (function () {
          var resultObj = {};
          for(key in statObj) {
            if (key.indexOf('custom-') == 0) {
              resultObj[key.substring('custom-'.length)] = statObj[key];
            }
          }
          return resultObj;
        })()
      };
    }


    if (calcuateDetailedMetrics) {
      ret.totalStats = {
        responseTime: stats.responseOkTime
      }
    }

    ret.httpSocketPool = {
      requestQueueSize: _.chain(httpAgent.requests).values().reduce(function (memo, reqObjects) {
        return memo + reqObjects.length;
      }, 0).value(),
      socketQueueSize: _.chain(httpAgent.sockets).values().reduce(function (memo, reqObjects) {
        return memo + reqObjects.length;
      }, 0).value(),
      socketQueueMaxSize: httpAgent.maxSockets
    };

    // return stats;
    return ret;
  }
}


module.exports = LoadTester;
