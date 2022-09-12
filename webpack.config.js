const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Generate json
// 파일을 여러개 나누지않고 함수 매개변수에 따라 번들옵션을 다르게 하는 방법.
// prev => next
module.exports = (env, options) => {
  const { mode, port } = {
    ...options,
    port: options.port || 8000,
    mode: options.mode || 'development',
  };
  const isDevMode = mode !== 'production'; // 코드 단축을 위해 boolean 미리 저장
  return {
    mode,
    devServer: {
      port, // 개발서버 포트
      hot: true, // 저장하면 바로 띄우기
      devMiddleware: {
        writeToDisk: true, // 개발하면서 빌드 라이브로 진행하기
      },
      client: {
        overlay: true, // 에러나면 브라우저에 띄우기
      },
      open: true, // 브라우저가 안켜져있으면 기본 브라우저 켜기
    },
    entry: {
      'ts/index': path.resolve(__dirname, 'src', 'index.ts'), // 엔트리 이름을 ts/index로 정하고 나중에 이름 쓰기
      'js/index': path.resolve(__dirname, 'src', 'index.js'),
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 브라우저, Node.js 소스는 이 범주 안에 전부 들어온다.
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevMode ? '[name].bundle.js' : '[name].[contenthash].js', // 번들링 될 때 어떻게 저장할지, entry에서 지정한 이름 규칙 그대로
      publicPath: isDevMode ? '/' : './',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevMode ? '[name].bundle.css' : '[name].[contenthash].css',
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: '/node_modules/',
          use: {
            loader: 'swc-loader', // 신형 로더 사용 swc > esbuild >>> babel-loader
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: '/node_modules/',
          use: {
            loader: 'swc-loader',
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
  };
};
