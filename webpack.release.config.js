const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const S3Plugin = require("webpack-s3-plugin");

const postCssConfig = require("./postcss.config.js");
const commonConfig = require("./webpack.common.config.js");
const assetConfig = require("./config/assetConfig.json");
const s3Config = require("./config/s3Config.json");

const BASE_PATH = path.resolve(__dirname, "");
const DIST_PATH = `${BASE_PATH}/build`;

module.exports = function(env = {target: "local"}) {
  const releaseConfig = {
    mode: "production",

    output: {
      publicPath: assetConfig[env.target].staticHost + assetConfig[env.target].staticPath,
      filename: "[name]-[chunkhash].bundle.js",
      chunkFilename: "[name]-[chunkhash].bundle.js"
    },

    devtool: "sourcemap",

    module: {
      rules: [
        {
          test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.#]+)?$/,
          use: {
            loader: "url-loader",
            options: {
              name: "[name]-[hash].[ext]",
              limit: "10000"
            }
          }
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
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
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.(jpe?g|png)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath:
                  assetConfig[env.target].staticHost + assetConfig[env.target].staticPath,
                name: "[name]-[hash].[ext]"
              }
            }
          ]
        }
      ]
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          parallel: true,
          cache: true
        })
      ]
    },

    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name]-[hash].css",
        chunkFilename: "[id].[hash].css"
      }),
      new webpack.DefinePlugin({
        BUILD_TYPE: JSON.stringify("release")
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
          context: __dirname
        }
      }),
      new S3Plugin({
        directory: DIST_PATH,
        exclude: /.*\.map/,
        s3Options: {
          accessKeyId: env.awsAccessKeyId,
          secretAccessKey: env.awsSecretAccessKey,
          region: s3Config.common.region
        },
        s3UploadOptions: {
          Bucket: s3Config[env.target].bucket
        },
        noCdnizer: true,
        progress: true
      })
    ]
  };

  return webpackMerge(commonConfig(env), releaseConfig);
};
