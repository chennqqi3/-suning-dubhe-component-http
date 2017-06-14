var httpService = require('./lib/httpService.js')
var loginService = require('./lib/loginService.js')
var errorHandle = require('./lib/errorHandle.js')

var main = function main(app, option) {
    errorHandle(app, option.errorHandle)
    loginService(app, option.loginService)
    httpService(app, option.httpService)
}
main.loginService = loginService.fn

module.exports = main