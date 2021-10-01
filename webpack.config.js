const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist/'),
  pages: path.resolve(__dirname, 'src/pages'),
  scripts: path.resolve(__dirname, 'src/scripts'),
  assets: path.resolve(__dirname, 'src/assets'),
}
const PAGES = fs.readdirSync(`${PATHS.pages}/`).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
  context: PATHS.src,
  mode: "development",
  entry:  './scripts/index.js', //'./src/scripts/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PATHS.pages}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`,
      minify: {
        collapseWhitespace: false,
        removeComments: true,
      }
    })),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: PATHS.assets, to: `${PATHS.dist}/assets` },
      ],
    }),
  ],
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, 'src'),
      '@blocks' : path.resolve(__dirname, 'src/blocks'),
      '@pages' : path.resolve(__dirname, 'src/pages'),
      '@scripts' : path.resolve(__dirname, 'src/scripts'),
      '@styles' : path.resolve(__dirname, 'src/styles'),
      '@assets' : path.resolve(__dirname, 'src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.styl$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: "css-loader"},
          {
            loader: "stylus-loader",
            options: {
              stylusOptions:{
                resolveURL: true,
              }
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'simple-pug-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext][query]'
        }
      },
    ]
  }
};