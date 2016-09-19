function findFighterIndexByProperty(fighters, attr, value) {
    var returnIndex = -1;
    fighters.forEach(function (fighter, fighterIx) {
        var snapshot = fighter[0];
        if (snapshot.name == value)
            returnIndex = fighterIx;
    });
    return returnIndex;
}

function getDataAsWeightClasses(data) {
    var weightClasses = [];

    data.forEach((month) => {
        while (weightClasses.length < month.divisions.length) {
            var fighterArray = [];
            weightClasses.push(fighterArray);
        }
    });
    populateWeightClasses(data, weightClasses);
    return weightClasses;
}

function populateWeightClasses(data, weightClasses) {
    data.forEach(function (month, monthIx) {
        var displayDate = month.displayDate;
        month.divisions.forEach(function (div, divIndex) {
            weightClasses[divIndex].title = div.title;
            div.fighters.forEach(function (f) {
                if (f.name != "") {
                    var fighterSnapshots = [];
                    var snapshot = { name: f.name, x: monthIx, y: 15 - f.rank };
                    fighterSnapshots.push(snapshot);

                    if (findFighterIndexByProperty(weightClasses[divIndex], "name", f.name) < 0) {
                        //console.log(f.name + " first occurance");
                        weightClasses[divIndex].push(fighterSnapshots);
                    }
                    else {
                        //console.log(f.name + " already exists");
                        weightClasses[divIndex][findFighterIndexByProperty(weightClasses[divIndex], "name", f.name)].push(snapshot);
                    }
                }

            });
        });
    });
}
