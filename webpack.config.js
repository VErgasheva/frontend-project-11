import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
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
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'eslint.config.js', to: '' },
        { from: 'webpack.config.js', to: '' },
        { from: 'vercel.json', to: '' },
        { from: 'package.json', to: '' },
        { from: 'src/counter.js', to: 'src/' },
        { from: 'src/i18n.js', to: 'src/' },
        { from: 'src/index.js', to: 'src/' },
        { from: 'src/logic.js', to: 'src/' },
        { from: 'src/rssParser.js', to: 'src/' },
        { from: 'src/styles.scss', to: 'src/' },
        { from: 'src/ui.js', to: 'src/' }
      ]
    })
  ]
}
