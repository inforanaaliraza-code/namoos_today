const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './web/index.js',
  output: {
    path: path.resolve(__dirname, 'web/dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx', '.json'],
    alias: {
      'react-native': 'react-native-web',
      '@react-native-vector-icons/material-design-icons': 'react-native-vector-icons',
      '@expo/vector-icons/MaterialCommunityIcons': 'react-native-vector-icons/MaterialCommunityIcons',
      'react-native-pdf': path.resolve(__dirname, 'web/mocks/react-native-pdf.js'),
      'react-native-pdf/fabric': path.resolve(__dirname, 'web/mocks/react-native-pdf.js'),
    },
    fallback: {
      crypto: false,
      stream: false,
      buffer: false,
      fs: false,
      path: false,
      os: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules\/(?!(react-native-.*|@react-native|@react-navigation)\/).*|node_modules\/react-native-pdf\/.*/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-transform-export-namespace-from',
              'react-native-reanimated/plugin',
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      inject: true,
    }),
    // Replace React Native internal library imports (used by native-only modules)
    new webpack.NormalModuleReplacementPlugin(
      /^react-native\/(Libraries|src\/private).*$/,
      path.resolve(__dirname, 'web/mocks/react-native-internals.js')
    ),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'web/dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  optimization: {
    minimizer: [
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
    ],
  },
};

