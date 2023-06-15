const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    filename: path.resolve(__dirname, "src/index.js"),
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
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new htmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
      inject: "body", // Додає <script> в кінець тіла сторінки
      title: "New web application",
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
};
