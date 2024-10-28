var functions = {
  // Each function is called with the dataSet containing all records, ordered
  // by the 'value' of the records.
  min: function (dataSet) {
    if (!dataSet || dataSet.length == 0) {
      return NaN
    }
    return {min: dataSet[0].value};
  },

  max: function (dataSet) {
    if (!dataSet || dataSet.length == 0) {
      return NaN
    }
    return {max: dataSet[dataSet.length-1].value};
  },

  mean: function (dataSet) {
    if (!dataSet || dataSet.length == 0) {
      return NaN;
    }
    return {mean: dataSet[Math.floor(dataSet.length/2)].value};
  },

  topAt: function (atRate, dataSet) {
    if (!dataSet || dataSet.length == 0) {
      return NaN;
    }
    var retObj = {topAt: {}};
    retObj.topAt[atRate] = dataSet[Math.floor(dataSet.length*(1-atRate))].value;
    return retObj;
  },

  reqPerSec: function (dataSet, runStats) {
    var minTime = Infinity;
    var maxTime = -Infinity;
    for (var i = 0; i < dataSet.length; i++) {
      if (dataSet[i].timestamp < minTime) {
        minTime = dataSet[i].timestamp;
      }
      if (dataSet[i].timestamp > maxTime) {
        maxTime = dataSet[i].timestamp;
      }
    }
    var durationInMillis = maxTime - minTime;
    var totalSuccessRate = runStats.responseOk / runStats.responseReceived;
    return {
      completedTransactionsPerSec: dataSet.length/durationInMillis*1000,
      requestsCompleted: dataSet.length,
      testRunDurationInSec: durationInMillis/1000,
      totalSuccessRate: totalSuccessRate
    };
  },

  get: function (funcName) {
    if (funcName.indexOf(':') > 0) {
      var parts = funcName.split(':');
      return function (dataSet, stats) {
        return (functions[parts[0]])(parts[1], dataSet, stats);
      }
    } else {
      return functions[funcName];
    }
  }
};

module.exports = functions;
