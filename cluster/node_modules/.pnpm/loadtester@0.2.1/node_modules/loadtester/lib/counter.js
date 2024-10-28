var util = require('util');

var _ = require('underscore');
var deepmerge = require('deepmerge');

var statFunctions = require('./stat-functions');

// Each Counter must have a name, and a single number as value.
var Counter = function (options) {

  var self = this;
  var options = options;

  this._counterData = {};
  this._handlers = [];
  var intervals = options.intervals || [1000];

  // for persistent counters
  this._persistent = null;

  var getIntervalKey = function (interval) {
    return (interval == "*")?"_all":interval.toString();
  }

  this.reset = function () {
    // clear counter data
    this._counterData = {};
    // Clear earlier timers, if any
    if (this._timers) {
      this._timers.filter(function (timer) {
        return timer != null;
      }).forEach(function (timer) {
        clearInterval(timer);
      })
    }
    // set up new timers that will maintain buckets
    this._timers = intervals.map(function (interval) {
      self._counterData[getIntervalKey(interval)] = {};
      return (interval != parseInt(interval, 10))?null:setInterval(function () {
        // cleanup buckets
        self._counterData["lastComplete-" + getIntervalKey(interval)] = self._counterData[getIntervalKey(interval)];
        self._counterData[getIntervalKey(interval)] = {};
      }, interval);
    });

    // Reset persistent counters as well
    if (this._persistent && this._persistent.timer) {
      clearInterval(timer);
    }

    this._persistent = {
      data: {},
      timer: null,
      metricsToCalculate: {}
    };

    // setup 'flush' calls for persistent counters.
    this._persistent.timer = setInterval(function () {
      // TODO: flush persistent data to file
    }, 2000);
  }
  this.reset();

  this.getAll = function () {
    return this._counterData; // this is not a deep copy for performance reasons.
  }

  this.calculateMetrics = function () {
    var resultObj = {};
    // this implementation assumes that all data fits into the memory.
    if (this._persistent && this._persistent.data) {
      for(var metricName in this._persistent.data) {
        if (this._persistent.metricsToCalculate[metricName]) { // if there are any aggregators for this field
          resultObj[metricName] = {};
          this._persistent.metricsToCalculate[metricName].forEach(function (calcFn) {
            // sort by value
            var sorted = _.sortBy(self._persistent.data[metricName], function (record) {
              return record.value;
            });
            resultObj[metricName] = deepmerge(resultObj[metricName], calcFn(sorted, self._counterData["_all"]));
          });
        }
      }
    }
    return resultObj;
  }

  this.add = function (arg1, arg2) {
    if (typeof arg1 === "string" && typeof arg2 !== "undefined") {
      return addCounter(this, arg1, arg2);
    } else if (typeof arg1 === "function" && typeof arg2 === "undefined") {
      return addHandler(this, arg1);
    } else {
      throw Error(util.format("No valid parameters for counter.add(): %s, %s", typeof arg1, typeof arg2));
    }
  }

  var addCounter = function (thisRef, name, value) {
    // increase counter value for all buckets
    intervals.forEach(function (interval) {
      var bucket = thisRef._counterData[getIntervalKey(interval)];
      if (!bucket[name]) {
        bucket[name] = 0;
      }
      bucket[name] += value;
    })
    // TODO: call handlers that implement 'virtual' counters

    // Take care of persistent counters
    if (thisRef._persistent.data[name]) {
      thisRef._persistent.data[name].push({
        timestamp: new Date(),
        counter: name,
        value: value
      });
    }
  }

  var addHandler = function (thisRef, fn) {
    if (typeof fn != "function") {
      throw Error("Handler must be a function");
    }
    thisRef._handlers.push(fn);
  }

  // This method can be called to register a counter (by its name)
  // to be persisted into file with all of its values and timestamps.
  // later this can be read again to provide detailed statistics like
  // considence, min, max, min 1%, max 1%, etc.
  this.persistCounterResults = function (counterName, metricsToCalculate, customCallback) {
    if (!this._persistent.data[counterName]) {
      this._persistent.data[counterName] = [];
    }
    this._persistent.metricsToCalculate[counterName] = [];
    if (metricsToCalculate) {
      metricsToCalculate.forEach(function (metricName) {
        // var metricFn = statFunctions[metricName];
        var metricFn = statFunctions.get(metricName);
        if (metricFn) {
          self._persistent.metricsToCalculate[counterName].push(metricFn);
        } else {
          throw Error("stat '" + metricName + "' does not exists.");
        }
      })
    }
    if (customCallback) {
      this._persistent.metricsToCalculate[counterName].push(customCallback);
    }
  }
}


module.exports = Counter;
