function hex2rgb(h) {
    return [(h & (255 << 16)) >> 16, (h & (255 << 8)) >> 8, h & 255];
}
function distance(a, b) {
    var d = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    return Math.sqrt((d[0]*d[0]) + (d[1]*d[1]) + (d[2]*d[2]));
}
function freshColor(sofar, d) {
    var n, ok;
    while(true) {
        ok = true;
        n = Math.random()*0xFFFFFF<<0;
        for(var c in sofar) {
            if(distance(hex2rgb(sofar[c]), hex2rgb(n)) < d) {
                ok = false;
                break;
            }
        }
        if(ok) { return n; }
    }
}
function getColors(n, d) {
    // var a = [];
    // for(; n > 0; n--) {
    //     var decimalColor = freshColor(a, d);
    //     var hexColor = "#" + decimalColor.toString(16);
    //     a.push(hexColor);
    // }
    // return a;
    
    return [  "#7900D7",  "#6367A9",  "#6B002C",
 "#FF4A46", "#008941", "#006FA6", "#A30059",
"#6609ff", "#63FFAC", "#B79762",  "#997D87",
"#5A0007", "#809693", "#FFB300", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
"#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100","#000000",

"#A05837", "#9B9700","#0CBD66", "#788D66", "#FF8E00", "#1CE6FF", 
 "#7A4900", "#0000A6","#004D43", "#8FB0FF",
 "#FF34FF",
 
"#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
"#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2",
"#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
"#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81","#00489C",
"#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00","#A77500","#772600","#D790FF", 
 "#001E09","#6F0062","#EEC3FF", "#456D75", "#B77B68", "#7A87A1", 

"#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329","#C2FF99",
"#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"]
}