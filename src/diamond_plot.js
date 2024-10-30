import * as d3 from "d3";

import { rin } from "./utils_helpers.js";

const visHeight = 612
const visWidth = 612
const canvas_mult_size = 1.02

export default function DiamondChart(dat, alpha) {

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
  const svg = d3.create("svg")

  // SWAP THOSE LINES
  // const g = passed_svg  //.append('g')
  const g = svg.attr("id", "myGraph") 
    .attr('height', visHeight + margin.top + margin.bottom)
    .attr('width', visWidth)
    .attr("viewBox", [0-50, 0, visWidth + margin.top+50, visHeight]);

  // ADD g ELEMENT, THEN WE MANIPULATE THE SVG
    
  // Rotate the canvas
  g.attr('transform', `translate(${ visWidth / 2.5}, -25) rotate(135) scale(1,-1)`)

  // Xaxis - see below for the functions
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

  // contours  
  g.append("g")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("fill-opacity", 0.1)
  .selectAll("path")
  .data(get_contours(alpha))
  .join("path")
    .attr("d", d3.geoPath());

  g.append("g")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("fill-opacity", 0.1)
  .selectAll("path")
  .data(get_contours())
  .join("path")
    .attr("d", d3.geoPath(alpha));

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

  return g.node()
}

function rank_turbulence(x, y, alpha) {
  if (alpha === Infinity) {
      return x == y ? 0 : Math.max(x)
  } else if (alpha == 0) {
    // cheating a little bit
    return (1+1) / 1 * Math.abs(x**1 - y**1)**(1. / (1+1))
  } else {
      return (alpha+1) / alpha * Math.abs(x**alpha - y**alpha)**(1. / (alpha+1))
    }
}

function get_contours(alpha) {
  // see https://observablehq.com/@d3/contours
  
  const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
  const x0 = -1, x1 = visHeight + q - 2;
  const y0 = -1, y1 = visHeight + q - 2;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);

  // evaluate function across grid
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = rank_turbulence(i, j, alpha);
    }
  }
  
  grid.x = -q;
  grid.y = -q;
  grid.k =  q;
  grid.n =  n;
  grid.m =  m;

  const grid_rev = grid.reverse()
  
  // Converts from grid coordinates (indexes) to screen coordinates (pixels).
  const transform = ({type, value, coordinates}) => {
    return {type, value, coordinates: coordinates.map(rings => {
      return rings.map(points => {
        return points.map(([x, y]) => ([
          grid_rev.x + grid_rev.k * x + 3,
          grid_rev.y + grid_rev.k * y + 3
        ]));
      });
    })};
  }
  
  let contour = d3.contours().size([grid_rev.n, grid_rev.m]).thresholds(10)
  
  return contour(grid_rev).map(d => transform(d)); 
}

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

