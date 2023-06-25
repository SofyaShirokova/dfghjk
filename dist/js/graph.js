let marginX = 50;
let marginY = 100;
let height = 400;
let width = 900;

let DTPData = [];

for (let i = 0; i < city.length; i++){
    let object = {
        City: city[i],
        Injured: injured[i],
        Marka: marka[i],
    }
    DTPData.push(object);
}
console.log(DTPData);
let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);

drawGraph(svg,"City", "Injured", "histogram", true, false);

let hideButton = document.getElementById('hideButton');
hideButton.onclick = function(){
    if (this.value === "Скрыть таблицу"){
        this.value = "Показать таблицу";
        d3.select("div.tableBlock")
            .select("table")
            .selectAll("tr")
            .style("display", "none");
    } else{
        this.value = "Скрыть таблицу";
        d3.select("div.tableBlock")
            .select("table")
            .selectAll("tr")
            .style("display", "");
    }
};

function getArrGraph(arrObject, fieldX, fieldY){
    let groupObj = d3.group(arrObject, d => d[fieldX]);
    let arrGroup = [];
    for(let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d[fieldY]));
        arrGroup.push({
            "labelX": entry[0],
            "valueMin": minMax[0],
            "valueMax": minMax[1]
        });
    }
    return arrGroup;
}

function drawGraph(svg, selectedX = "City", selectedY = "Injured",
                   type = "histogram", flag_max = true, flag_min = false){
    if (!flag_min && !flag_max) {
        alert("Выберите результат");
        return;
    }

    let arrGraph = getArrGraph(DTPData, selectedX, selectedY)

    svg.selectAll("*").remove();//обнуление графика

    let min; let max;
    if (flag_max && !flag_min){
        min = d3.min(arrGraph.map(d => d.valueMax)) * 0.95;
        max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    } else if (flag_min && !flag_max){
        min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
        max = d3.max(arrGraph.map(d => d.valueMin)) * 1.05;
    } else {
        min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
        max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    }

    let xAxisLen = width - 2 * marginX; //длина осей
    let yAxisLen = height - 2 * marginY;

    let scaleY = d3.scaleLinear()
        .domain([0, max])
        .range([yAxisLen, 0]);

    let scaleX;
    if (type === "dotted") {
        scaleX = d3.scaleBand()
            .domain(arrGraph.map(function(d) {
                    return d.labelX;
                })
            )
            .range([0, xAxisLen]);
    }
    if (type === "histogram"){
        scaleX = d3.scaleBand()
            .domain(arrGraph.map(function(d) {
                return d.labelX;
            }))
            .range([0, xAxisLen])
            .padding(0.2);
    }

    let axisX = d3.axisBottom(scaleX); //создание осей
    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .attr("class", "x-axis")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".20em")
        .attr("transform", function (d) {
            return "rotate(-45)";
        });

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .attr("class", "y-axis")
        .call(axisY);

    d3.selectAll("g.x-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", - (yAxisLen));

    d3.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLen)
        .attr("y2", 0);

    if (flag_min && flag_max) {
        if (type === "histogram")
            drawDoubleHistogram(svg, arrGraph, "labelX", scaleX, "valueMax", scaleY, "valueMin", "#ffa332", "gray");
        else
            drawDoubleDottedGraph(svg, arrGraph, "labelX", scaleX, "valueMax", scaleY, "valueMin", "#ffa332", "gray")
    }
    else {
        if (flag_max) {
            if (type === "dotted")
                drawDottedGraph(svg, arrGraph, "labelX", scaleX, "valueMax", scaleY, "#ffa332");
            if (type === "histogram")
                drawHistogram(svg, arrGraph, "labelX", scaleX, "valueMax", scaleY, "#ffa332")
        }

        if (flag_min) {
            if (type === "dotted")
                drawDottedGraph(svg, arrGraph, "labelX", scaleX, "valueMin", scaleY, "gray");
            if (type === "histogram")
                drawHistogram(svg, arrGraph, "labelX", scaleX, "valueMin", scaleY, "gray")
        }
    }


}

let graphButton = document.getElementById("graphButton")
graphButton.onclick = function (){
    let selectedX;
    for (let i in document.getElementsByName("ox")){
         if (document.getElementsByName("ox")[i].checked) {
            selectedX = document.getElementsByName("ox")[i].value;
             break;
         }
    }

    let selectedY = "Injured";

    let type;
    if (document.getElementsByName("type")[0].checked)
        type = "dotted";
    else if (document.getElementsByName("type")[1].checked)
        type = "histogram";

    let flag_min = document.getElementsByName("oy")[1].checked;
    let flag_max = document.getElementsByName("oy")[0].checked;

    let svg = d3.select("svg")
        .attr("height", height)
        .attr("width", width);

    drawGraph(svg, selectedX, selectedY, type, flag_max, flag_min);
}

function drawDottedGraph(svg, arrGraph, x, scaleX, y, scaleY, color){
    svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return scaleX(d[x]);
        })
        .attr("cy", function (d) {
            return scaleY(d[y]);
        })
        .attr("transform", `translate(${marginX + width/(2.2 * arrGraph.length)}, ${marginY})`)
        .style("fill", color)
}

function drawHistogram(svg, arrGraph, x, scaleX, y, scaleY, color){
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .selectAll(".rect")
        .data(arrGraph)
        .enter()
        .append("rect")
        .attr("x", function(d) { return scaleX(d[x]); })
        .attr("width", scaleX.bandwidth())
        .attr("y", function(d) { return scaleY(d[y]); })
        .attr("height", function(d) { return height - 2 * marginY - scaleY(d[y]); })
        .attr("fill", color);


}

function drawDoubleHistogram(svg, arrGraph, x, scaleX, y, scaleY, y2, color, sColor){
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .selectAll(".rect")
        .data(arrGraph)
        .enter()
        .append("rect")
        .attr("x", function(d) { return scaleX(d[x]); })
        .attr("width", scaleX.bandwidth() / 2)
        .attr("y", function(d) { return scaleY(d[y]); })
        .attr("height", function(d) { return height - 2 * marginY - scaleY(d[y]); })
        .attr("fill", color);

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .selectAll(".rect")
        .data(arrGraph)
        .enter()
        .append("rect")
        .attr("x", function(d) { return scaleX(d[x]) + scaleX.bandwidth() / 2; })
        .attr("width", scaleX.bandwidth() / 2)
        .attr("y", function(d) { return scaleY(d[y2]); })
        .attr("height", function(d) { return height - 2 * marginY - scaleY(d[y2]); })
        .attr("fill", sColor);

}

function drawDoubleDottedGraph(svg, arrGraph, x, scaleX, y, scaleY, y2, color, sColor){
    svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return scaleX(d[x]) - 5;
        })
        .attr("cy", function (d) {
            return scaleY(d[y]);
        })
        .attr("transform", `translate(${marginX + width/(2.2 * arrGraph.length)}, ${marginY})`)
        .style("fill", color)

    svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return scaleX(d[x]) + 5;
        })
        .attr("cy", function (d) {
            return scaleY(d[y2]);
        })
        .attr("transform", `translate(${marginX + width/(2.2 * arrGraph.length)}, ${marginY})`)
        .style("fill", sColor)
}
