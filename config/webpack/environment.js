const { environment } = require('@rails/webpacker')
let webpack = require('webpack');

environment.plugins.append(
    'Provide',
    new webpack.ProvidePlugin({
        $: 'jquery'
    })
)

module.exports = environment
