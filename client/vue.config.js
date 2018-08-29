module.exports = {
  devServer: {
    host: 'localhost',
    port: 8443,
    https: true,
  },
  baseUrl: '',
  configureWebpack: {
    optimization: {
      minimize: false,
    },
  },
};