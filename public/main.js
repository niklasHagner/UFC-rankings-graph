function main(data) {
  var filteredData = null;
  if (data) {
    window.displayDates = data.map(function(d) { return d.displayDate });
    filteredData = getDataAsWeightClasses(data);

    var tableHTML = buildTable(data);
    document.querySelector("#table").innerHTML = tableHTML;

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

function buildTable(data) {
  var tableHeaders = "";
  var tableRows = "";
  var byRank = [];
  data.forEach((stamp) => {
      if (stamp.divisions.length > 0) {
          tableHeaders += `<th>${stamp.displayDate}</th>`;
          
          var oneDivision = stamp.divisions[3];
          var fighters = oneDivision.fighters;
          fighters.forEach((fighter, ix) => {
              var name = fighter.name.split("(")[0].trim();
              if (typeof byRank[ix] === "undefined")
                byRank.push([]);

              byRank[ix].push(name);
          })
      }
  })

  byRank.forEach((rank) => {
    var rowStr = "";
    rank.forEach((dudeAtRankDuringTime) => {
        rowStr += "<td>" + dudeAtRankDuringTime + "</td>";
    });
    tableRows += "<tr>" + rowStr + "</tr>";
  });

  tableHeaders = "<tr>" + tableHeaders + "</tr>";
  return tableHeaders + tableRows;
}