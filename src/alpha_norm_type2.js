export default function alpha_norm_type2(x1, x2, alpha) {
    if (alpha == 0) {
      return Math.abs(Math.log(x1 / x2));
    } else if (alpha === Infinity) {
      return x1 === x2 ? 0 : Math.max(x1, x2);
    } else {
          const prefactor = (alpha + 1) / alpha;
          const power = 1 / (alpha + 1);
          return prefactor * Math.abs(Math.pow(x1, alpha) - Math.pow(x2, alpha)) ** power;
    }
  }