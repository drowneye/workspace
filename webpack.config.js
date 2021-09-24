const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  src: path.resolve(__dirname, 'src/'),
  pages: path.resolve(__dirname, 'src/pages'),
}
const PAGES = fs.readdirSync(`${PATHS.pages}/`).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
  mode: "development",
  entry:  './src/scripts/index.js',
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
  ],
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, 'src'),
      '@blocks' : path.resolve(__dirname, 'src/blocks'),
      '@pages' : path.resolve(__dirname, 'src/pages'),
      '@scripts' : path.resolve(__dirname, 'src/scripts'),
      '@styles' : path.resolve(__dirname, 'src/styles')
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"], 
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'simple-pug-loader'
          }
        ]
      }
    ]
  }
};