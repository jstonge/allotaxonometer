import BalanceChart from './src/balance_plot.js'
import DiamondChart from './src/diamond_plot.js'
import WordShiftChart from './src/wordshift_plot.js'
import LegendChart from './src/legend_plot.js'

import mixedElems from './src/combine_distributions.js'
import rank_turbulence_divergence from './src/rank_turbulence_divergence.js'
import diamond from './src/diamond_count.js'
import { get_entropy_scores, get_jsd_scores } from './src/entropy.js'
import { rin, matlab_sort, tiedrank, which, rank_maxlog10, zeros } from './src/utils_helpers.js'

async function createAllotaxChart(data_1, data_2, alpha, passed_svg) {
  
  // Combining both systems in mixedElems class
  const me_class = new mixedElems(data_1, data_2);
  const rtd = me_class.RTD(alpha);
  // Create Data req for charts
  const dat = me_class.Diamond(rtd);
  const diamond_dat = dat.counts;
  const wordshift = me_class.wordShift(dat);
  const balance_dat = me_class.balanceDat();

  // Am I missing some canvas settings here?
  // ADDED
  // Define dimensions and margins
  
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  // Create the <g> element for the charts
  const g = passed_svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Plot
  DiamondChart(diamond_dat, g);
  WordShiftChart(wordshift, { }, g);
  BalanceChart(balance_dat, { }, g);
  LegendChart(diamond_dat, { }, g);
}


export{
  createAllotaxChart,
  diamond,
  get_entropy_scores, 
  get_jsd_scores,
  rank_turbulence_divergence,
  rank_maxlog10,
  matlab_sort,
  which,
  rin,
  tiedrank,
  mixedElems,
  zeros
}