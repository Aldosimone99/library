const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/JS/scripts.js', // Punto di ingresso del tuo codice
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true, // Pulisce la cartella dist prima di ogni build
    },
    mode: 'development', // Modalità development per il debug
    devServer: {
        static: './dist', // Cartella statica da servire
        port: 8080, // Puoi specificare una porta se necessario
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Regola per i file CSS
                use: ['style-loader', 'css-loader'], // Loader per gestire i CSS
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Usa un template dalla directory di origine
            filename: 'index.html', // Nome del file HTML generato nella cartella dist
        }),
    ],
};