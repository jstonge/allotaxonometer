# allotaxonometer

Test to see if publishing npm module works on observable. [It works](https://observablehq.com/d/3211a8bb562f87a8). We can now start building the package.

## TODOs

 - [ ] combine_distribution/combine_distributions()
   - [x] draft 
   - [ ] fix bugs
   - [ ] test
 - [ ] src/combine_distribution/combine_distribution().tidy_count_mixedelem()
 - [ ] src/diamond_counts/diamond_counts()
 - [ ] src/rank_turbulence_divergence/rank_turbulence_divergence()
 - [ ] src/utils_helpers/matlab_sort()
 
Logs: 
 - 07/10/22: I rewrote `combine_distributions()` to be a class. This is still buggy. I think the class representation is nice here because it higlights how much mixedElem is the building block of our visualization.
 - 07/10/22: the `rank_turbulence_divergence()` is the first and only divergence measure I ended up implementing. I think we should start there this time around too.
