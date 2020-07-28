module.exports = function(api) {
    api.cache(true);
    return {
      presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
      plugins: [
        "react-hot-loader/babel",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-spread",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator"
      ]
    };
  };
  