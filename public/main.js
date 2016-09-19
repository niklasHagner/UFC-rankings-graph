function main(data) {
  var filteredData = null;
  if (data) {
    window.displayDates = data.map(function(d) { return d.displayDate });
    filteredData = getDataAsWeightClasses(data);
    filteredData.forEach((weightClass, ix) => {
      drawLegend(weightClass, "division"+ix);
    });
    filteredData.forEach((weightClass, ix) => {
      drawGraph(weightClass, "division"+ix);
    });
  }
}

function getHistoricalRankingsArray() {
  if (typeof window.historicalRankings === "undefined" || typeof window.historicalRankings.data === "undefined") {
    console.error("no historical rankings data found");
    return [];
  }
  return window.historicalRankings.data;
}

var data = [];
$(document).ready(function () {
  data = getHistoricalRankingsArray();
  if (!data || data.length === 0) {
    console.error("Error, no data!");
    return;
  }
 main(data);
});