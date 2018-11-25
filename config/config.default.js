'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1538713427555_5749';

  // add your config here
  config.middleware = [];

  config.mysql = {
      // 单数据库信息配置
      client: {
          // host
          host: '127.0.0.1',
          // 端口号
          port: '3306',
          // 用户名
          user: 'root',
          // 密码
          password: 'lrz',
          // 数据库名
          database: 'springboot',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  return config;
};
