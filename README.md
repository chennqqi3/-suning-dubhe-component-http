cd项目dubhe框架的HttpService

# Usage

```bash
$ npm install @suning/dubhe-component-http --save
```

```js
import httpService from '@suning/dubhe-component-http';

option = {
    errorHandle: {
        resultCode: [{
            code: '03001',
            callback: function () {
                location.href = '/error.html'
            }
        }],
        config: {
            successCode: '0',
            alertMessage: true
        }
    }
}
httpService(app, option);//已注入HttpService服务了
```

# Version

## 0.0.14

add loginService.logout

## 0.0.15

add loginService.config