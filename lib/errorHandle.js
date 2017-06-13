module.exports = function (app, option) {
    app.constant('errors', {
        500: '系统出了点小问题，请稍后重试！',
        401: {
            //需到controller中单独处理的错误
            resolve: true,
            msg: '（未授权） 请求要求身份验证'
        },
        404: '（未找到） 服务器找不到请求的网页'
    }).service('ErrorHandle', ['$q', 'errors', 'AlertService', 'LoginService',
        function ($q, errors, AlertService, LoginService) {
            'use strict';
            return {
                handle: function (data) {
                    var defer = $q.defer(),
                        defaultMessage = '系统出了点小问题，请稍后重试！',
                        message = data.message || defaultMessage;

                    if (data.idsIntercepted) {
                        LoginService.jumpLogin(data);
                        return
                    }

                    if (option.resultCode && option.resultCode.length) {
                        option.resultCode.forEach(e => {
                            if (data.resultCode === e.code) {
                                e.callback && e.callback()
                            }
                        })
                    }

                    if (data.resultCode === '0') {
                        defer.resolve(data.data);
                    } else {
                        AlertService.alert({
                            title: '提示信息',
                            content: message
                        });
                        defer.reject(data);
                    }
                    return defer.promise;
                }
            };
        }
    ]);
}