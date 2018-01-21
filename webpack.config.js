const path = require('path')
const HtmlWebackPlugin = require('html-webpack-plugin')
const resolve = _path => path.resolve(__dirname, _path)

module.exports = {
    entry: resolve('./src/index.js'),
    output: {
        filename: '[name].[id].js',
        path: resolve('./dist'),
        publicPath: '/',
        libraryTarget: 'var',
        library: 'Rue'
    },
    module: {
        loaders:[
            {
                test: /\.js/,
                use: ['babel-loader']
            }
        ]
    },
    devServer: {
        inline: true,
        hot: true,
        open: true
    },
    plugins: [
        new HtmlWebackPlugin({
            title: 'Rue',
            template: resolve('./index.html'),
            filename: 'index.html',
            inject:'head'
        })
    ]
}