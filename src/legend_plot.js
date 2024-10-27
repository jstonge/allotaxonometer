import { range, max, descending } from "d3-array";
import { scaleBand, scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { axisBottom } from "d3-axis";
import { interpolateInferno } from "d3-scale-chromatic";
import { rgb } from "d3-color";

export default function LegendChart(data, {
    tickSize = 0,
    width = 370,
    height = 44 + tickSize,
    marginTop = 11,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    } = {}, passed_svg) {

    const N_CATEGO = 20
    const ramp = range(N_CATEGO).map(i => rgb(interpolateInferno(i / (N_CATEGO - 1))).formatHex())
    const my_inferno = scaleOrdinal(range(N_CATEGO), ramp)
    const maxCountLog = Math.ceil(Math.log10(max(data, d => d.value)))+1

    // const svg = select("#legend").append("svg")
    const g = passed_svg  //.append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

    let x;
    x = scaleBand()
       .domain(my_inferno.domain())
       .rangeRound([marginLeft, width - 100]);

    g.append("g")
     .selectAll("rect")
     .data(my_inferno.domain())
     .join("rect")
       .attr("x", x)
       .attr("y", marginTop)
       .attr("width", Math.max(0, x.bandwidth() - 1))
       .attr("height", height - marginTop - marginBottom)
       .attr("fill", my_inferno)
       .attr("transform", "rotate(-90) translate(-70,0)");

    tickAdjust = () => {};

    let x2;
    x2 = scaleBand()
       .domain(range(maxCountLog).map(i => 10**i).sort(descending))
       .rangeRound([marginLeft-40, width-90]);

    g.append("g")
        .call(axisBottom(x2).tickSize(tickSize)).attr("text-anchor", "start")
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft - 25) // magic number moving legend title left and right
          .attr("y", marginTop + marginBottom) // magic number moving legend title up and down
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-size", 14)
          .attr("class", "title")
          .text("Counts per cell"))
        .attr("transform", "rotate(-90) translate(-60,5)") // magic number moving ticks and title up and down and left and right
          .selectAll('text')
          .attr("dx", 30) // magic number moving ticks left and right
          .attr("dy", -5) // magic number
          .attr('transform', 'rotate(90)') // rotating ticks and title

    return g.node();
  }