var Table = require('cli-table3');
var colors = require('colors/safe');
var clui = require('clui');
var singleLineWriter = require('single-line-log').stdout

function formatStatsTable(stats) {

  if (stats.currentLastSec) {
    return formatStatsTable2col(stats, [stats.currentLastSec, stats.total], ["Current", "Total"]);
  } else {
    return formatStatsTable2col(stats, [stats.total], ["Total"]);
  }
}

function format_value(value, max_limit, min_limit, suffix) {

  if (!suffix) {
    suffix = "";
  }
  return ((max_limit != null && value > max_limit) || (min_limit != null && value < min_limit)) ? colors.red(value + suffix) : (value + suffix);
}

function formatSocketPoolGauge(httpSocketPool) {

  return clui.Gauge(httpSocketPool.socketQueueSize, httpSocketPool.socketQueueMaxSize, 30, 0.6 * httpSocketPool.socketQueueMaxSize,
    httpSocketPool.socketQueueSize + " TCP sockets in use");
}

function formatRequestPoolGauge(httpSocketPool) {
  // we ceil the value when displaying
  var used = Math.min(httpSocketPool.requestQueueSize, httpSocketPool.socketQueueMaxSize);
  return clui.Gauge(used, httpSocketPool.socketQueueMaxSize, 29, 5, httpSocketPool.requestQueueSize + " requests queued");
}

function formatFinalStatsTable(totalStats) {

  var table = new Table({
    head: ['Metric', 'Result'],
    colWidths: [45, 15],
    style: {
      head: ['gray', 'bold']
    }
  });

  table.push(['Best response time'].concat(format_value((isNaN(totalStats.responseTime.min)) ? 'n/a' : totalStats.responseTime.min.toFixed(0), 1000, null, " ms")));
  table.push(['Slowest response time'].concat(format_value((isNaN(totalStats.responseTime.max))? 'n/a' : totalStats.responseTime.max.toFixed(0), 4000, null, " ms")));
  table.push(['Mean response time'].concat(format_value((isNaN(totalStats.responseTime.mean))? 'n/a' : totalStats.responseTime.mean.toFixed(0), 1000, null, " ms")));
  table.push(['Slowest response at 95%'].concat(format_value((!totalStats.responseTime.topAt) ? 'n/a' : totalStats.responseTime.topAt['0.05'].toFixed(0), 4000, null, " ms")));
  table.push(['Slowest response at 99%'].concat(format_value((!totalStats.responseTime.topAt) ? 'n/a' : totalStats.responseTime.topAt['0.01'].toFixed(0), 4000, null, " ms")));

  table.push(['Test run duration'].concat(format_value(totalStats.responseTime.testRunDurationInSec, null, null, " s")));
  table.push(['Requests completed'].concat(format_value(totalStats.responseTime.requestsCompleted, null, null)));
  table.push(['Completed transactions per sec'].concat(format_value(totalStats.responseTime.completedTransactionsPerSec.toFixed(0), null, null)));
  table.push(['Successfully completed requests'].concat(format_value(totalStats.responseTime.totalSuccessRate.toFixed(2)*100, null, null, "%")));


  return table.toString();
}

function formatStatsTable2col(stats, dataCols, dataHeaderNames) {

  var table = new Table({
    head: ['Metric'].concat(dataHeaderNames),
    colWidths: [30].concat(dataCols.map(function(){return 15;})),
    style: {
      head: ['gray', 'bold']
    }
  });

  table.push(['Request sent'].concat(dataCols.map(function (dataCol) {
    return dataCol.requestSent;
  })));

  table.push(['Response received'].concat(dataCols.map(function (dataCol) {
    return dataCol.responseReceived;
  })));

  table.push(['Average response time'].concat(dataCols.map(function (dataCol) {
    return format_value(dataCol.avgResponseTime.toFixed(0), 1000, null, " ms");
  })));

  table.push(['Successfully completed'].concat(dataCols.map(function (dataCol) {
    return format_value(dataCol.responseSuccessRatio.toFixed(2)*100, null, 0.8, "%");
  })));

  if (stats.total.requestTimeouts && stats.total.requestTimeouts > 0) {
    table.push(['Request timeouts'].concat(dataCols.map(function (dataCol) {
      return format_value(dataCol.requestTimeouts, 0, null);
    })));
  }
  if (stats.total.unknownResponseErrors && stats.total.unknownResponseErrors > 0) {
    table.push(['Other response errors'].concat(dataCols.map(function (dataCol) {
      return format_value(dataCol.unknownResponseErrors, 0, null);
    })));
  }
  if (stats.total.non200HTTPResponses && stats.total.non200HTTPResponses > 0) {
    table.push(['HTTP status code is not 200'].concat(dataCols.map(function (dataCol) {
      return format_value(dataCol.non200HTTPResponses, 0, null);
    })));
  }

  if (stats.total.non200HTTPResponseBreakdown) {
    for(var key in stats.total.non200HTTPResponseBreakdown) {
      table.push(['HTTP status code ' + key].concat(dataCols.map(function (dataCol) {
        var val = (dataCol.non200HTTPResponseBreakdown) ? dataCol.non200HTTPResponseBreakdown[key] || 0 : 0;
        return format_value(val, 0, null);
      })));
    }
  }

  if (stats.total.custom) {
    for(var key in stats.total.custom) {
      table.push(['[custom] ' + key].concat(dataCols.map(function (dataCol) {
        return format_value((dataCol.custom[key] || 0), null, null);
      })));
    }
  }

  return table.toString();
}


module.exports = {
  formatStatsTable: formatStatsTable,
  formatFinalStatsTable: formatFinalStatsTable,

  printStatsPage: function (stats) {
    var buffer = [];
    buffer.push('\nTotal results:');
    buffer.push(formatStatsTable(stats));
    if (stats.httpSocketPool && !stats.totalStats) {
      buffer.push(formatSocketPoolGauge(stats.httpSocketPool));
      buffer.push(formatRequestPoolGauge(stats.httpSocketPool));
    }
    if (stats.totalStats) {
      buffer.push('\nCalculated statistics:');
      buffer.push(formatFinalStatsTable(stats.totalStats));
      buffer.push('\n');
    }

    var strOut = buffer.join('\n');
    singleLineWriter(strOut);
  }
}
