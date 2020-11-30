const path = require("path");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const S3Plugin = require("webpack-s3-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");

const packageJson = require("./package.json");
const postCssConfig = require("./postcss.config.js");
const commonConfig = require("./webpack.common.config.js");
const assetConfig = require("./config/assetConfig.json");
const s3Config = require("./config/s3Config.json");
const sentryConfig = require("./config/sentryConfig.json");
const gitRevisionPlugin = new GitRevisionPlugin();

const BASE_PATH = path.resolve(__dirname, "");
const DIST_PATH = `${BASE_PATH}/build`;

module.exports = function (env = {target: "local"}) {
  const releaseConfig = {
    mode: "production",

    output: {
      publicPath: assetConfig[env.target].staticHost + assetConfig[env.target].staticPath,
      filename: "[name]-[chunkhash].bundle.js",
      chunkFilename: "[name]-[chunkhash].bundle.js"
    },

    devtool: "source-map",

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
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
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
      new CompressionPlugin({
        test: /\.(js|css)$/,
        exclude: /.*\.map/,
        filename: "[path]",
        algorithm: "gzip"
      }),
      new SentryWebpackPlugin({
        // sentry-cli configuration
        authToken: sentryConfig.authToken,
        org: sentryConfig.org,
        project: sentryConfig.projectSlug,

        // webpack specific configuration
        release: `${packageJson.version}.${gitRevisionPlugin.commithash()}`,
        include: "./build",
        urlPrefix: `~/${s3Config[env.target].bucket}/`,
        ignore: ["node_modules", "*.config.js"]
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
          Bucket: s3Config[env.target].bucket,
          ContentDisposition(fileName) {
            let disposition;

            if (/\.csv/.test(fileName)) {
              disposition = `attachment;filename=${fileName}`;
            }

            return disposition;
          },
          ContentEncoding(fileName) {
            let encoding;

            if (/\.css/.test(fileName) || /\.js/.test(fileName)) {
              encoding = "gzip";
            }

            return encoding;
          },
          ContentType(fileName) {
            let type;

            if (/\.css/.test(fileName)) {
              type = "text/css";
            } else if (/\.js/.test(fileName)) {
              type = "text/javascript";
            }

            return type;
          }
        },
        noCdnizer: true,
        progress: true
      })
    ]
  };

  return merge(commonConfig(env), releaseConfig);
};
