import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/user/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      errorCode: null,
      errorMessage: null,
      data: {
        "createdAt": "2020-08-04T02:26:34.369Z",
        "updatedAt": "2020-08-04T02:26:34.369Z",
        "deletedAt": null,
        "userId": "78433465669914624",
        "nick": "admin",
        "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
        "sex": "男",
        "status": 1,
        "oauth": [
          {
            "createdAt": "2020-08-04T02:26:34.484Z",
            "updatedAt": "2020-08-04T02:26:34.484Z",
            "deletedAt": null,
            "id": 3,
            "userId": "78433465669914624",
            "appId": "wx0fec19654407c503",
            "oauthType": "mp",
            "openId": "o_7jkw_9lT-SXhybUMarTK2DxZWk",
            "unionId": null,
            "credential": null,
            "status": 1,
            "expiresIn": 7200
          }
        ],
        "detail": {
          "createdAt": "2020-08-04T02:26:34.198Z",
          "updatedAt": "2020-08-04T02:26:34.198Z",
          "deletedAt": null,
          "userId": "78433465669914624",
          "oauthType": "name",
          "userName": "admin",
          "email": null,
          "phone": "15980770620",
          "role": 0,
          "status": 1,
          "salt": "a805273e999ac8cc"
        },
        access: getAccess(),
      }
    });
  },
  // GET POST 可省略
  'GET /api/user': {"success":true,"errorCode":null,"data":{"data":[{"createdAt":"2020-08-22T00:50:17.171Z","updatedAt":"2020-12-03T08:18:05.000Z","deletedAt":null,"userId":"84932210955784192","nick":"Nascent","avatar":"","sex":null,"status":1,"detail":{"createdAt":"2020-08-22T00:50:16.982Z","updatedAt":"2020-12-03T08:18:04.000Z","deletedAt":null,"userId":"84932210955784192","oauthType":"name","userName":"nascent","email":"a@c.com","phone":"12345678901","role":3,"status":1},"oauth":[{"createdAt":"2020-08-26T13:25:56.388Z","updatedAt":"2020-08-26T13:25:56.388Z","deletedAt":null,"id":20,"userId":"84932210955784192","appId":"test4","oauthType":"mp","openId":"tes4","unionId":null,"credential":null,"status":1,"expiresIn":7200},{"createdAt":"2020-08-26T13:41:36.319Z","updatedAt":"2020-08-26T13:41:36.319Z","deletedAt":null,"id":23,"userId":"84932210955784192","appId":"test1","oauthType":"mp2","openId":"tes1","unionId":null,"credential":null,"status":1,"expiresIn":7200}],"address":[{"createdAt":"2020-08-27T15:14:28.514Z","updatedAt":"2020-12-01T09:35:07.000Z","deletedAt":null,"id":26,"userId":"84932210955784192","addressId":"86961639995346944","receiverName":"erer12","receiverPhone":"15988888888","provinceCode":"330000","provinceName":"天津市","cityCode":"330200","cityName":"河东区","areaCode":"330203","areaName":"振兴区","address":"erer","zipCode":null,"defaultAddress":1},{"createdAt":"2020-08-27T15:14:28.645Z","updatedAt":"2020-12-01T09:31:56.000Z","deletedAt":null,"id":27,"userId":"84932210955784192","addressId":"86961639999541248","receiverName":"werw","receiverPhone":"15988888888","provinceCode":"330000","provinceName":"北京市","cityCode":"330200","cityName":"西城区","areaCode":"330204","areaName":"宣化区","address":"werwer","zipCode":null,"defaultAddress":1}]},{"createdAt":"2020-08-28T08:46:39.424Z","updatedAt":"2020-08-28T08:46:39.424Z","deletedAt":null,"userId":"87226420971048960","nick":"string","avatar":"string","sex":null,"status":1,"detail":{"createdAt":"2020-08-28T08:46:39.268Z","updatedAt":"2020-08-31T02:50:16.000Z","deletedAt":null,"userId":"87226420971048960","oauthType":"name","userName":"admin2","email":null,"phone":null,"role":3,"status":1},"oauth":[{"createdAt":"2020-08-31T02:50:16.548Z","updatedAt":"2020-08-31T02:50:16.548Z","deletedAt":null,"id":24,"userId":"87226420971048960","appId":"123","oauthType":"weApp","openId":"123","unionId":null,"credential":null,"status":1,"expiresIn":7200}],"address":[{"createdAt":"2020-08-31T02:40:18.498Z","updatedAt":"2020-08-31T02:50:16.000Z","deletedAt":null,"id":28,"userId":"87226420971048960","addressId":"88221403651903488","receiverName":"123","receiverPhone":"2323","provinceCode":"","provinceName":"天津市","cityCode":"","cityName":"河东区","areaCode":null,"areaName":null,"address":"123232","zipCode":null,"defaultAddress":1}]},{"createdAt":"2020-08-04T02:26:34.369Z","updatedAt":"2020-08-04T02:26:34.369Z","deletedAt":null,"userId":"78433465669914624","nick":"admin","avatar":"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png","sex":"男","status":1,"detail":{"createdAt":"2020-08-04T02:26:34.198Z","updatedAt":"2020-08-04T02:26:34.198Z","deletedAt":null,"userId":"78433465669914624","oauthType":"name","userName":"admin","email":null,"phone":"15980770620","role":0,"status":1},"oauth":[{"createdAt":"2020-08-04T02:26:34.484Z","updatedAt":"2020-08-04T02:26:34.484Z","deletedAt":null,"id":3,"userId":"78433465669914624","appId":"wx0fec19654407c503","oauthType":"mp","openId":"o_7jkw_9lT-SXhybUMarTK2DxZWk","unionId":null,"credential":null,"status":1,"expiresIn":7200}],"address":[]},{"createdAt":"2020-08-28T08:46:49.649Z","updatedAt":"2020-08-28T08:46:49.649Z","deletedAt":null,"userId":"87226463782309888","nick":"string","avatar":"string","sex":null,"status":1,"detail":{"createdAt":"2020-08-28T08:46:49.467Z","updatedAt":"2020-08-28T08:46:49.467Z","deletedAt":null,"userId":"87226463782309888","oauthType":"name","userName":"admin3","email":null,"phone":null,"role":3,"status":1},"oauth":[],"address":[]},{"createdAt":"2020-10-09T06:35:42.988Z","updatedAt":"2020-10-09T06:35:42.988Z","deletedAt":null,"userId":"102413762048430080","nick":"test","avatar":"","sex":null,"status":1,"detail":{"createdAt":"2020-10-09T06:35:42.818Z","updatedAt":"2020-12-03T08:16:52.000Z","deletedAt":null,"userId":"102413762048430080","oauthType":"name","userName":"admin13","email":null,"phone":null,"role":null,"status":1},"oauth":[],"address":[]},{"createdAt":"2020-10-09T08:04:11.032Z","updatedAt":"2020-10-09T08:04:11.032Z","deletedAt":null,"userId":"102436025695080448","nick":"test","avatar":"","sex":null,"status":1,"detail":{"createdAt":"2020-10-09T08:04:10.867Z","updatedAt":"2020-10-09T08:04:10.867Z","deletedAt":null,"userId":"102436025695080448","oauthType":"name","userName":"admin134","email":null,"phone":null,"role":null,"status":1},"oauth":[],"address":[]},{"createdAt":"2020-10-09T08:20:41.862Z","updatedAt":"2020-10-09T08:21:17.000Z","deletedAt":null,"userId":"102440182040629248","nick":"123456","avatar":null,"sex":null,"status":1,"detail":{"createdAt":"2020-10-09T08:20:41.715Z","updatedAt":"2020-10-09T08:21:17.000Z","deletedAt":null,"userId":"102440182040629248","oauthType":"name","userName":"12345","email":null,"phone":null,"role":null,"status":1},"oauth":[],"address":[]}],"current":1,"pageSize":15,"total":7},"errorMessage":null,"traceId":1609165714417},
  'POST /api/auth/login': async (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        success: true,
        errorCode: null,
        errorMessage: null,
        data:{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI3ODQzMzQ2NTY2OTkxNDYyNCIsInV1aWQiOiIxYjJiYzhmNC0zN2MxLTRhYzItYjkxZC0yNjhmZjFjZDFkN2IiLCJyb2xlIjowLCJpYXQiOjE2MDEzNjYyNTEsImV4cCI6MTYwMTM3MzQ1MX0.cD-VLbh9beyFU5eCIUtUHPkgm3LU8YBgs-UPjR9wMGo","expiresIn":7200}
      });
      access = 'admin';
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'GET /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
