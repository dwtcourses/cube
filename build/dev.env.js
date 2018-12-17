'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASEURL: '"http://sxiot.sxaop.com/"'//后台地址
  // BASEURL: '"http://134.0.133.203:8889/"'//后台地址
  // BASEURL: '"http://134.0.133.148:8889/"'//后台地址
  // BASEURL: '"http://134.0.133.231:8888/"'//后台地址
  BASEURL: '"http://134.0.133.65:8889/"'//后台地址
})
