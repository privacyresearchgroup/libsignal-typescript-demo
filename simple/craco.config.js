const path = require('path')

module.exports = {
  webpack: {
    alias: { '@app': path.resolve(__dirname, './src') },
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: false,
        },
      },
    },
  },
}
