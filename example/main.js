import mixedElems from "../src/combine_distributions.js";
import DiamondChart from '../src/diamond_plot.js';
import WordShiftChart from '../src/wordshift_plot.js'
import BalanceChart from '../src/balance_plot.js'
import LegendChart from '../src/legend_plot.js'    

import { test_elem_1, test_elem_2 } from '../test/test_data.js'

import { select } from "d3-selection";

    
// Combining both systems in mixedElems class
const me_class = new mixedElems(test_elem_1, test_elem_2)
const rtd = me_class.RTD(Infinity)
const dat = me_class.Diamond(rtd)
const wordshift = me_class.wordShift(dat)

// Create Data req for charts
const diamond_dat = dat.counts
const balance_dat = me_class.balanceDat() 

// Plotting
DiamondChart(diamond_dat) 
var p2 = WordShiftChart(wordshift, { height: 670 });
BalanceChart(balance_dat)
LegendChart(diamond_dat)

select("#alpha_slider").on("change", function(d) {
    
    const rtd = me_class.RTD(this.value)
    const newDat = me_class.Diamond(rtd)
    const newWordshift = me_class.wordShift(newDat)
    
    p2.update(newWordshift)  
})

    
        


