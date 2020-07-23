const postcssNormalize = require("postcss-normalize");
const autoprefixer = require("autoprefixer");
const postcssInlineSvg = require("postcss-inline-svg");

module.exports = {
  plugins() {
    return [postcssNormalize(), postcssInlineSvg(), autoprefixer];
  }
};
