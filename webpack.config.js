const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {};
  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()];
  }
  return config;
};

module.exports = {
  mode: "development",
  entry: {
    filename: ["@babel/polyfill", path.resolve(__dirname, "src/index.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    assetModuleFilename: "[name][ext]",
    clean: true,
  },
  performance: {
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
  devServer: {
    port: 9000,
    compress: true,
    hot: true,
    static: {
      directory: path.join(__dirname, "dis"),
    },
  },

  module: {
    rules: [
      // html
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        // type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      //svg
      {
        test: /\.svg$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          //   "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
        // use: "file-loader",
        generator: {
          filename: "images/[hash][ext][query]", // Розміщуємо фото в папці "images"
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: optimization(),

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new htmlWebpackPlugin({
      // filename: "index.html",
      template: "src/index.html",
      inject: "body", // Додає <script> в кінець тіла сторінки
      minify: {
        collapseWhitespace: isProd,
      },
      title: "New web application",
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
};
