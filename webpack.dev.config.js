const {merge} = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const assetConfig = require("./config/assetConfig.json");
const commonConfig = require("./webpack.common.config.js");
const postCssConfig = require("./postcss.config.js");

const BASE_PATH = path.resolve(__dirname, "");
const DIST_PATH = `${BASE_PATH}/build`;

module.exports = function(env = {target: "local"}) {
  const devConfig = {
    mode: "development",

    devtool: "cheap-module-source-map",

    output: {
      publicPath: assetConfig[env.target].staticHost + assetConfig[env.target].staticPath,
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js"
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 2
              }
            },
            {
              loader: "postcss-loader",
              options: postCssConfig
            },
            "sass-loader"
          ]
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            {
              loader: "postcss-loader",
              options: postCssConfig
            }
          ]
        },
        {
          test: /\.(jpe?g|png|csv|pdf)$/i,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        },
        {
          test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          use: {
            loader: "url-loader",
            options: {
              limit: "10000"
            }
          }
        }
      ]
    },

    optimization: {
      namedModules: true
    },

    devServer: {
      contentBase: DIST_PATH,
      compress: true,
      port: 3000,
      historyApiFallback: true,
      hot: true
    },

    plugins: [
      new webpack.DefinePlugin({
        BUILD_TYPE: JSON.stringify("dev")
      })
    ]
  };

  return merge(commonConfig(env), devConfig);
};
