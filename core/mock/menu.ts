import { Request, Response } from 'express';

export default {
  'GET /api/menu': (req: Request, res: Response) => {
    res.send({
      "success": true,
      "errorCode": null,
      "errorMessage": null,
      "data": [
        {
          "path": '/welcome',
          "name": 'welcome',
          "icon": 'home',
        },
        {
          "path": '/foo',
          "name":"foo",
          "icon": 'smile',
        },
        {
          "name": "manager",
          "icon": "icon-summary",
          "children": [{
            "name": "config",
            "icon": "icon-ns-commodity",
            "children": [{
              "name": "menu",
              "path": "/manager/menu",
            }]
          }, {
            "name": "user",
            "icon": "icon-ns-commodity",
            "path": "/user/list",
          }]
        },
      ]
    });
  },
};
