import { Request, Response } from "express";

export default {
  'GET /api/cgi/ActiveServer': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        success: true,
        errorCode: null,
        errorMessage: null,
        data:[
          {
            name: 'foo', // hack
            entry: '//localhost:8001',
          },
          {
            name: 'bar', // hack
            entry: '//localhost:8002',
          },
          {
            name: 'baz', // hack
            entry: '//localhost:8003',
          },
          {
            name: 'qux', // hack
            entry: '//localhost:8004',
          },
          {
            name: 'example', // hack
            entry: '//localhost:8005',
          },
          {
            name: 'crm', // hack
            entry: '//localhost:8006',
          },
          {
            name: 'onedata', // hack
            entry: '//localhost:8007',
          }
          // {
          //   name: 'app2',
          //   entry: 'http://localhost:8002/app2',
          //   base: '/app2',
          //   mountElementId: 'root-slave',
          //   props: {
          //     testProp: 'test'
          //   }
          // }
        ]
      });
    },0)
  },
}
