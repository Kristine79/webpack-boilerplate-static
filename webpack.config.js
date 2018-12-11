const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      chunks: ['common', `${name}`]
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

const config = {
  entry: {
    common: ['./src/js/common.js'],
    index: ['./src/js/index.js'],
    catalog: ['./src/js/catalog.js']
  },
  output: {
    filename: 'js/[name].js',
    path: path.join(__dirname, '/dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, '/src/html/'),
        use: 'html-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: true,
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 70
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/fonts',
        to: './fonts'
      },
      {
        from: './src/favicon',
        to: './favicon'
      },
      {
        from: './src/img',
        to: './img'
      },
      {
        from: './src/uploads',
        to: './uploads'
      }
    ])
  ].concat(htmlPlugins)
};

module.exports = config;
