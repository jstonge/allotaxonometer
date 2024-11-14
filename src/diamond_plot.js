import * as d3 from "d3";

import { rin } from "./utils_helpers.js";


function filter_contours(tmpcontours, Ninset, maxlog10) {

  const chart2val = d3.scaleLinear()
  .domain([0, Ninset]) // unit: km
  .range([0, maxlog10]) // unit: pixels
  
  let out = []  
  // Extract Coordinates:
  tmpcontours.forEach((contour) => {
    contour.coordinates.forEach((pair, i) => {
      const tmpr1 = pair[0].map(d => d[0]); // x-coordinates
      const tmpr2 = pair[0].map(d => d[1]); // y-coordinates

      // Array to store filtered coordinate pairs in zipped format
      const filteredPairs = [];

      // Loop through each coordinate and calculate `tmpxrot`
      for (let index = 0; index < tmpr1.length-1; index++) {
        const x1 = chart2val(tmpr1[index]);
        const x2 = chart2val(tmpr2[index]);
        
        // Calculate tmpxrot 
        const tmpxrot = Math.abs(x2 - x1) / Math.sqrt(2);
        
        // If the condition is met, add the coordinate pair [x1, x2] to `filteredPairs`
        if (Math.abs(tmpxrot) >= 0.1 & x1 != 5 & x2 != 0 & x1 != 0 & x2 != 5) {
          filteredPairs.push([x1, x2]);
        }
      }

      // Only push to `out` if we have filtered pairs
      if (filteredPairs.length > 0) {
        out.push(filteredPairs); // Store each set of filtered pairs in `out`
      }
    })
  })
return out
}

function make_grid(Ninset, tmpr1, tmpr2, alpha) {
  // No matrix in js :(
  // we could try to do like in the original d3.contour, where they do
  // calculation to work with a flat array. 
  // Instead we flatten that List of list later.

  
  function alpha_norm_type2(x1, x2) {
        const prefactor = (alpha + 1) / alpha;
        const power = 1 / (alpha + 1);
        return prefactor * Math.abs(Math.pow(x1, alpha) - Math.pow(x2, alpha)) ** power;
  }
  
  const deltamatrix = Array.from({ length: Ninset }, () => Array(Ninset).fill(0));

  // Populate deltamatrix with alpha_norm_type2 values and set the diagonal and adjacent values
  for (let i = 0; i < Ninset; i++) {
    for (let j = 0; j < Ninset; j++) {
        const divElem = alpha_norm_type2(1 / tmpr1[i], 1 / tmpr2[j]);
        const normalization = 16813.189409617593; // Harcoded from Boys 1968 vs 2018 with alpha=0.08
        deltamatrix[i][j] = divElem / normalization;
    }

    //     %% prevent contours from crossing the center line
    deltamatrix[i][i] = -1;

    // Set adjacent diagonal elements to -1 if within bounds
    if (i < Ninset - 1) {
      deltamatrix[i][i + 1] = -1;
      deltamatrix[i + 1][i] = -1;
    }
  }

  return deltamatrix;
};

function get_contours(alpha, maxlog10) {
  // only for alpha != 0 and alpha != Infinity

  const Ninset = 10 ** 3
  const tmpr1 = d3.range(0, 1000).map(d => Math.pow(10, d / 999 * 5));
  const tmpr2 = d3.range(0, 1000).map(d => Math.pow(10, d / 999 * 5));

  // Create a scale to generate `Ncontours + 2` values linearly spaced between 1 and `tmpr1Length`
  const Ncontours = 10;
  const scale = d3.scaleLinear()
    .domain([0, Ncontours + 1])
    .range([1, tmpr1.length]);

  
  const contour_indices = d3.range(Ncontours + 2).map(i => Math.round(scale(i)));
  const grid = make_grid(Ninset, tmpr1, tmpr2, alpha)
  const indices = contour_indices.slice(1, -1);
  const lastRow = grid[grid.length - 1];
  const heights = indices.map(index => lastRow[index]);

  // equivalent to `contourc`
  // we first create a generator
  // then we pass to Z (flatDeltamatrix)
  const logTmpr = tmpr1.map(Math.log10)
  
  const contourGenerator = d3.contours()
      .size([logTmpr.length, logTmpr.length])  // Set the grid size
      .thresholds(heights); // I guess this is equivalent? These are levels.

  const flatDeltamatrix = grid.flat();
  const tmpcontours = contourGenerator(flatDeltamatrix);  

  return filter_contours(tmpcontours, Ninset, maxlog10)
  
}

export default function DiamondChart(dat, alpha, maxlog10, passed_svg) {

  const visHeight = 612
  const visWidth = 612
  const canvas_mult_size = 1.02

  const draw_polygon = (g, tri_coords, bg_color) => g
      .append("polygon")
       .attr("fill",bg_color)
       .attr("fill-opacity", 0.2)
       .attr("stroke", "black")
       .attr("stroke-width", 1)
       .attr("points", tri_coords)
  
  //!TODO: Find a way to combine x and y axis
  const xAxis = (g, scale) => g
      .attr("transform", `translate(0, ${visHeight})`)
      .call(d3.axisBottom(scale))
      .call((g) => g.select(".domain").remove()) // remove baseline
      .selectAll('text')
      .attr('dy', 10)
      .attr('dx', 13)
      .attr('transform', 'scale(-1,1) rotate(45)')
      .attr('font-size', 10);
  
  const yAxis = (g, scale) => g
      .call(d3.axisRight(scale))
      .call((g) => g.select(".domain").remove())
      .attr("transform", `translate(${visHeight+5}, 0) scale(-1, 1)`)
      .selectAll('text')
      .attr('dx', -28)
      .attr('dy', 15)
      .attr('transform', 'rotate(45)')
      .attr('font-size', 10);
  
  const xAxisLab = (g, text, dx, dy, alpha) => g
      .append("text")
      .attr("x", visWidth / 2)
      .attr("fill", "black")
      .attr("font-size", 14)
      .attr("opacity", alpha)
      .attr("text-anchor", 'middle')
      .text(text)
      .attr('transform', `rotate(183) scale(1,-1) translate(-${dx}, ${dy})`);
  
  const yAxisLab = (g, text, dx, dy, alpha) => g
      .append("text")
      .attr("x", visWidth / 2)
      .attr("fill", "black")
      .attr("font-size", 14)
      .attr("opacity", alpha)
      .attr("text-anchor", 'middle')
      .text(text)
      .attr('transform', `rotate(93) translate(${dx},${dy})`);
  
  const xGrid = (g, scale, ncells) => g
      .append('g')
      //                   + => ylines to the right , lower xlines
      //                   - => ylines to the left, higher xlines
      .attr("transform", `translate(-10, -10)`)
      .call(d3.axisBottom(scale).ticks(ncells/2).tickFormat("")) // rm tick values
      .call((g) => g.select(".domain").remove())
      .call((g) => g
          .selectAll(".tick line")
          .attr("stroke", "#d3d3d3")
            .style("stroke-dasharray", ("3, 3"))
          .attr("y1", -visHeight+10) // y1 == - ? longer ylines on the top : shorter ylines on the top
          .attr("y2", 0) // y2 == - ? shorter ylines on the bottom :  longer ylines on the bottom
      );
  
  // When working on the grid, easier to rotate back to original square shape
  const yGrid = (g, scale, ncells) => g
      .append("g")
      //                      + => xlines to the left , lower ylines
      //                      - => xlines to the right, higher ylines
      .attr("transform", `translate(${ visHeight+20 }, -10) scale(-1, 1)`)
      .call(d3.axisRight(scale).ticks(ncells/2).tickFormat(""))
      .call((g) => g.select(".domain").remove())
      .call((g) => g
          .selectAll(".tick line")
          .attr("stroke", "#d3d3d3")
          .style("stroke-dasharray", ("3, 3"))
          .attr("x1", 15)      // x1 == - ? longer xlines on the left :  shorter xlines on the left
          .attr("x2", visWidth) // x2 == - ?  shorter xlines on the right :  longer xlines on the right
      );
  
  const Tooltips = (g, tooltip) => g
    .on("mouseover", (event, d) => {
      d3.select(event.target)
        .style("stroke-width", "2px");
      tooltip.style("visibility", "visible");
      tooltip.html(d.value !== 0 ? `Top types: ${d.types.split(",").length < 50 ?
        d3.shuffle(d.types.split(",")) :
          [d3.shuffle(d.types.split(",").slice(0,50))].concat([" ..."])}` : null);
  
    })
    .on("mousemove", (event, d) => {
      tooltip
        .style("top", event.clientY - 10 + "px")
        .style("left", event.clientX + 10 + "px");
    })
    .on("mouseout", (event, d) => {
      d3.select(event.target)
        .style("stroke-width",  (d) => d.value === 0 ? 0 : 0.3);
      tooltip.style("visibility", "hidden");
    })
  
  function chosen_types(dat, ncells) {
    const cumbin = d3.range(0, ncells, 1.5)
    const relevant_types = []
  
    for (let sys of ["right", "left"]) {
      for (let i=1; i < cumbin.length; i++) {
        const filtered_dat = dat.filter(d => d.value > 0 && d.which_sys == sys)
                                .filter(d => d.coord_on_diag >= cumbin[i-1] &&
                                             d.coord_on_diag < cumbin[i])
        if (filtered_dat.length > 0) {
          const cos_dists = filtered_dat.map(d => d.cos_dist)
          const max_dist = cos_dists.reduce((a, b) => { return Math.max(a, b) })
          const max_dist_idx = cos_dists.indexOf(max_dist)
          const name = d3.shuffle(filtered_dat[max_dist_idx]['types'].split(","))[0]
          relevant_types.push(name)
        }
    }
    }
    return relevant_types
  }
  
  // ------------------------------------

  const margin = ({ top: 200, left: 0, right: 140, bottom: 140 })
  const ncells = d3.max(dat, d => d.x1)

  const max_xy   = d3.max(dat, d => d.x1)           // max_x == max_y
  const max_rank = d3.max(dat, (d) => d.rank_L[1]); // max_rankL == max_rankL
  const max_val  = d3.max(dat, d => d.value)

  const xy         = d3.scaleBand().domain(dat.map(d=>d.y1)).range([0, visWidth])
  const xyDomain   = [1, 10**Math.ceil(Math.max(Math.log10(max_rank)))];
  const xyScale    = d3.scaleLog().domain(xyDomain).range([1, visWidth])
  const xyScaleLin = d3.scaleLinear().domain([1,ncells]).range([1, visWidth])

  const color_scale = d3.scaleSequentialLog().domain([max_val, 1]).interpolator(d3.interpolateInferno)

  
  // ADDED 
  // const svg = d3.create("svg")
  
  // SWAP THOSE LINES
  // const g = svg.attr("id", "myGraph") 
  const g = passed_svg  //.append('g')
  .attr('transform', `translate(${ visWidth / 2.5}, -25) rotate(135) scale(1,-1)`)
  .attr('height', visHeight + margin.top + margin.bottom)
  .attr('width', visWidth)
  .attr("viewBox", [0-50, 0, visWidth + margin.top+50, visHeight]);
  
  
  g.append('g')
  .call(xAxis, xyScale)
  .call(xAxisLab, "Rank r", visWidth, 40) // there must be an easier way to breaklines!?!
  .call(xAxisLab, "for", visWidth, 60)
  .call(xAxisLab, `Girls 1885`, visWidth, 80)
  .call(xAxisLab, "more →", visWidth-200, 40, .4)
  .call(xAxisLab, "frequent", visWidth-200, 60, .4)
  .call(xAxisLab, "← less", visWidth+200, 40, .4)
  .call(xAxisLab, "frequent", visWidth+200, 60, .4)
  .call(xGrid, xyScaleLin, ncells);
  
  // Yaxis - see below for the functions
  g.append('g')
  .call(yAxis, xyScale)
  .call(yAxisLab, "Rank r", 0, 40)
  .call(yAxisLab, "for", 0, 60)
  .call(yAxisLab, `Girls 1890`, 0, 80)
  .call(yAxisLab, "less →", 200, 40, .4)
  .call(yAxisLab, "frequent", 200, 60, .4)
  .call(yAxisLab, "← more", -200, 40, .4)
  .call(yAxisLab, "frequent", -200, 60, .4)
  .call(yGrid, xyScaleLin, ncells);
  
  // Background polygons
  const grey_triangle = [
    {"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":max_xy, "y":0}
  ].map(d => [xy(d.x)*canvas_mult_size, xy(d.y)*canvas_mult_size].join(',')).join(" ")
  
  const blue_triangle = [
    {"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":0, "y":max_xy}
  ].map(d => [xy(d.x)*canvas_mult_size, xy(d.y)*canvas_mult_size].join(',')).join(" ")
  
  
  draw_polygon(g, blue_triangle, "#89CFF0")
  draw_polygon(g, grey_triangle, "grey")
  
  // Generate contours using D3
  const contours = get_contours(alpha, maxlog10)

  passed_svg.append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", visWidth)
      .attr("height", visHeight);

  const x = d3.scaleLinear([0, maxlog10], [0, visHeight])
  const y = d3.scaleLinear([maxlog10, 0], [visHeight, 0])    
  
  const pathData = d3.line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));
    
    g.append("g")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("fill-opacity", 0.1)
    .attr("clip-path", "url(#clip)")
  .selectAll("path")
    .data(mycontours)
    .enter() // Enter selection to create paths
    .append("path")
    .attr("d", pathData)  // use path for more granularity
    .attr("stroke-width", 0.9)
    .attr("stroke-opacity", 0.9);

     // Heatmap
  const cells = g
      .selectAll('rect').data(dat).enter()
      .append('rect')
      .attr('x', (d) => xy(d.x1))
      .attr('y', (d) => xy(d.y1))
      .attr('width', xy.bandwidth())
      .attr('height', xy.bandwidth())
      .attr('fill', (d) => color_scale(d.value))
      .attr('fill-opacity', (d) => d.value === 0 ? 0 : color_scale(d.value))
      .attr('stroke', 'black')
      .attr('stroke-width', (d) => d.value === 0 ? 0 : 0.3)

  const mytypes = chosen_types(dat, ncells)

  g.selectAll('text')
    .data(dat)
    .enter()
    .append('text')
    .filter(d => rin(mytypes, d.types.split(",")).some((x) => x === true))
    .text(d => d.types.split(",")[0])
      .attr("x", (d) => xy(d.x1))
      .attr("y", (d) => Number.isInteger(d.coord_on_diag) ? xy(d.y1) : xy(d.y1)-1) // avoid text occlusion
      .attr("dy", 20)
      .attr("font-size", 14)
      .attr("font-family", "sans-serif")
      .attr("transform", d => `scale(1,-1) rotate(-90) rotate(-45, ${xy(d.x1)}, ${xy(d.y1)}) translate(${d.which_sys === "right" ? xy(Math.sqrt(d.cos_dist))*1.5 : -xy(Math.sqrt(d.cos_dist))*1.5}, 0)`) // little humph
      .attr("text-anchor", d => d.x1 - d.y1 <= 0 ? "start" : "end")

  // Draw the middle line
  g.append('line')
   .style("stroke", "black")
   .style("stroke-width", 1)
   .attr("x1", 0)
   .attr("y1", 0)
   .attr("x2", visWidth-7)
   .attr("y2", visHeight-7)

  
  return g.node();
}

