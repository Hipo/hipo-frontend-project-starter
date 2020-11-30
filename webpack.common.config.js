const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");

const apiConfig = require("./config/apiConfig.json");
const BASE_PATH = path.resolve(__dirname, "");
const APP_PATH = `${BASE_PATH}/src`;
const DIST_PATH = `${BASE_PATH}/build`;
const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = function (env) {
  const commonConfig = {
    entry: ["react-hot-loader/patch", `${APP_PATH}/index.tsx`],

    output: {
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js",
      path: DIST_PATH
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        "react-dom": env.target === "local" ? "@hot-loader/react-dom" : "react-dom"
      }
    },

    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack", "url-loader"]
        }
      ]
    },

    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 5,
        minSize: 90000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    },

    plugins: [
      new CleanWebpackPlugin({
        verbose: true
      }),
      new CopyPlugin({patterns: [{from: "public", to: DIST_PATH}]}),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true
          }
        },
        eslint: {files: "./src/**/*.{ts,tsx,js,jsx}"}
      }),
      new HtmlWebpackPlugin({
        favicon: path.join(APP_PATH, "favicon.ico"),
        inject: true,
        template: path.join(APP_PATH, "index.html"),
        meta: {
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no"
        }
      }),
      new webpack.DefinePlugin({
        TARGET_ENV_TYPE: JSON.stringify(env.target),
        API_BASE_URL: JSON.stringify(apiConfig[env.target].BASE_URL),
        GIT_COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash())
      })
    ]
  };

  return commonConfig;
};
