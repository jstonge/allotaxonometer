import { diamond_counts } from './diamond_count';

export default function tidy_count_mixedelem(mixedelements, alpha) {
    const dc = diamond_counts(mixedelements, alpha)
    const counts_t = dc.counts[0].map((_, colIndex) => dc.counts.map(row => row[colIndex]));
    const counts_long = []
    for (let i = 0; i < counts_t.length; ++i) {
      for (let j = 0; j < counts_t[i].length; j++) {
          counts_long.push({'y1': i, 'x1': j, 'value': counts_t[j][i]})
        }
      }
   return {'counts_long': counts_long, 'divergence_score': dc.div_score, 'deltas': dc.deltas, 'max_delta_loss': dc.max_delta_loss}
}