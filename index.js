var httpService = require('./lib/httpService.js')
var loginService = require('./lib/loginService.js')
var errorHandle = require('./lib/errorHandle.js')

module.exports = function (app) {
    errorHandle(app)
    loginService(app)
    httpService(app)
}