const path = require('path');

module.exports = {
  entry: './src/frontend/src/widget.js', // Hlavní soubor widgetu
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, './src/frontend/dist'), // Výstupní složka
    library: 'ChatBot', // Globální název pro widget
    libraryTarget: 'umd', // Tento typ je kompatibilní s různými prostředími
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
};
