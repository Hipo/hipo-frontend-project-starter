const postcssNormalize = require("postcss-normalize");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins() {
    return [postcssNormalize(), autoprefixer];
  }
};
