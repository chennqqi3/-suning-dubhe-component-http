'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app) {
    var loadNum = 0;
    app.factory('Loading', function () {
        return function (status, url) {
            var onloadingDiv = document.getElementById('onloadingDiv');
            if (!onloadingDiv) return;

            if (status) {
                if (url.match('isReposNameRepeat')) return;

                loadNum++;
                onloadingDiv.classList.remove('hidden');
            } else {
                loadNum--;
                if (loadNum <= 0) {
                    loadNum = 0;
                    onloadingDiv.classList.add('hidden');
                }
            }
        };
    });
    app.service("HttpService", ["$http", "$q", "$document", "$location", "AlertService", "LoginService", "EventBus", "baseUrl", 'Loading', "ErrorHandle", function ($http, $q, $document, $location, AlertService, LoginService, EventBus, baseUrl, Loading, ErrorHandle) {
        var loginUrl = LoginService.config.base + 'authStatus?callback=JSON_CALLBACK&_t=' + +new Date();

        function busy(url) {
            document.body.style.cssText = "cursor: progress !important";
            Loading(true, url);
        }

        function idle() {
            document.body.style.cssText = "";
            Loading(false);
        }

        function sendRequest(url, params, method, option) {
            var data, config;
            var defer = $q.defer();
            if (!option || option && !option.notDisplayLoading) {
                busy(url);
            }

            resourceCode(option);

            if (method === 'post' || method === 'put') {
                params.data && (params.data = (0, _stringify2.default)(params.data));
            }

            if (method === 'get' || method === 'delete') {
                data = params;
            } else {
                data = params.data;
                config = {
                    headers: params.headers
                };
            }

            $http.defaults.headers.common['currentUrl'] = location.href;

            $http[method](url, data, config).success(function (result) {
                idle();

                ErrorHandle.handle(result).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                });
            }).error(function (reason, status) {
                idle();

                var errorContent = reason;
                if (reason != undefined && reason.errorresponse != undefined) {
                    errorContent = reason.errorresponse.errortext;
                }

                if (status) {
                    AlertService.alert({
                        title: "服务端异常",
                        content: '系统出了点小问题，请稍后重试！'
                        //content: errorContent
                    });
                }
                defer.reject(reason);
            });

            return defer.promise;
        }

        function resourceCode(option) {
            if (option && option.resourceCode) {
                $http.defaults.headers.common.resourceCode = option.resourceCode;
            } else {
                delete $http.defaults.headers.common.resourceCode;
            }
        }

        function addHeaders(method, param) {
            switch (method) {
                case 'get':
                    return {
                        params: param
                    };
                case 'post':
                    return {
                        data: param || {},
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                case 'delete':
                    return {
                        data: (0, _stringify2.default)(param || {}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                case 'put':
                    return {
                        data: param || {},
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
            }
        }

        function restful(httpType) {
            return function (url, param, option) {
                var defer = $q.defer();

                if (option && option.unrestricted) {
                    sendRequest(baseUrl + url, {
                        params: param
                    }, httpType, option).then(function (result) {
                        defer.resolve(result);
                    }, function (data) {
                        defer.reject(data);
                    });
                } else {
                    sendRequest(baseUrl + url, addHeaders(httpType, param), httpType, option).then(function (result) {
                        defer.resolve(result);
                    }, function (data) {
                        defer.reject(data);
                    });
                }

                return defer.promise;
            };
        }

        return {
            "get": restful('get'),
            "post": restful('post'),
            "put": restful('put'),
            "delete": restful('delete')
        };
    }]);
};
//# sourceMappingURL=httpService.js.map