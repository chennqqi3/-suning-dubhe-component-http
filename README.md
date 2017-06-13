cd项目dubhe框架的HttpService

# Usage

```bash
$ npm install @suning/dubhe-component-http --save
```

```js
import httpService from '@suning/dubhe-component-http';

option = {
    errorHandle:{
        resultCode:[{
            code:'03001',
            callback:function () {
                location.href = '/error.html'
            }
        }]
    }
}
httpService(app, option);//已注入HttpService服务了
```