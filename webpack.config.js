export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: new URL('./dist', import.meta.url).pathname,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
};