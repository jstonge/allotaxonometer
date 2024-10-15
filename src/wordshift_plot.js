import { range, rollup, InternSet } from "d3-array";
import { scaleLinear, scaleBand } from "d3-scale";
import { select } from "d3-selection";
import { axisTop, axisLeft } from "d3-axis";

export default function WordShiftChart(data, {
    // title, // given d in data, returns the title text
    topN = 40,
    width = 300, // outer width of chart, in pixels
    height = 740, // the outer height of the chart, in pixels
    xLabel = "← System 1 · Divergence contribution · System 2 →", // a label for the x-axis
    yPadding = 0.2, // amount of y-range to reserve to separate bars
    colors = ["lightgrey", "lightblue"] 
  } = {}) {
    
    const margin = ({ top: 30, left: 40, right: 40, bottom: 10 })
    const xRange = [margin.left, width - margin.right]
    
    // Compute values.
    const X = data['dat'].slice(0, topN).map(d => d.metric);
    const Y = data['dat'].slice(0, topN).map(d => d.type);

    // Compute default domains, and unique the y-domain.
    const yDomain = new InternSet(Y);

    const I = range(X.length).filter(i => yDomain.has(Y[i]));
    const YX = rollup(I, ([i]) => X[i], i => Y[i]);

    const yRange = [margin.top, height - margin.bottom];

    // Construct scales, axes, and formats.
    const xScale = scaleLinear([-data['max_shift']*1.5, data['max_shift']*1.5], xRange);
    const yScale = scaleBand(yDomain, yRange).padding(yPadding);
    const xAxis = axisTop(xScale).ticks(width / 80, "%");
    const yAxis = axisLeft(yScale).tickSize(0).tickPadding(6);
    // const format = xScale.tickFormat(100, "%");

    // Compute titles.
    // title = i => `${Y[i]}\n${format(X[i])}`;

    const svg = select("#wordshift")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - margin.top - margin.bottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text") // actual title
            .attr("x", xScale(0))
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "center")
            .text(xLabel));

    const bar = svg.append("g")
      .selectAll("rect")
      .data(I)
      .join("rect")
        .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
        .attr("x", i => Math.min(xScale(0), xScale(X[i])))
        .attr("y", i => yScale(Y[i]))
        .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
        .attr("height", yScale.bandwidth());

    // if (title) bar.append("title").text(title);

    // name labels on the opposite side of the bar
    const labs = svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis)
        .call(g => g.selectAll(".tick text")
          .filter(y => YX.get(y) > 0 ? -YX.get(y) : YX.get(y))
            .attr("text-anchor", y => YX.get(y) > 0 ? "end" : "start" )
            .attr("x",  y => YX.get(y) > 0 ? -6 : 6 ));
    
    
    function update(newdat) {
      
      const X = newdat['dat'].slice(0, topN).map(d => d.metric);
      const Y = newdat['dat'].slice(0, topN).map(d => d.type);
      const yDomain = new InternSet(Y);
      const I = range(X.length).filter(i => yDomain.has(Y[i]));
      const YX = rollup(I, ([i]) => X[i], i => Y[i]);
      const xScale = scaleLinear([-newdat['max_shift']*1.5, newdat['max_shift']*1.5], xRange);
      const yScale = scaleBand(yDomain, yRange).padding(yPadding);
      const yAxis = axisLeft(yScale).tickSize(0).tickPadding(6);
      
      bar
        .data(I)
        .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
        .attr("x", i => Math.min(xScale(0), xScale(X[i])))
        .attr("y", i => yScale(Y[i]))
        .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
        .attr("height", yScale.bandwidth());

      labs
        .call(yAxis)
        .call(g => g.selectAll(".tick text")
          .filter(y => YX.get(y) > 0 ? -YX.get(y) : YX.get(y))
            .attr("text-anchor", y => YX.get(y) > 0 ? "end" : "start" )
            .attr("x",  y => YX.get(y) > 0 ? -6 : 6 ));
    }
   
    return Object.assign(svg.node(), { update });
    
  }
