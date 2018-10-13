'use strict';

const Controller = require('egg').Controller;
const ApiClient = require('../utils/tbk/index.js').ApiClient;

class TbkController extends Controller {

  async getBaseData() {
      let body = { show: false, code: 200 };
      const list = await this.ctx.service.tbk.getBaseData();
      body = Object.assign(body, {categories: list});
      this.ctx.body = body;
  }

  async list() {
    const { page, size, platform } = this.ctx.request.query;
    const list = await this.ctx.service.tbk.findList(page, size, platform);
    this.ctx.body = {
      data: {
        list: list
      }
    };
    this.ctx.status = 200;
  }

  async viewDetail() {
    const { itemId, platform } = this.ctx.request.query;
    const itemInfo = await this.ctx.service.tbk.getItemInfo(itemId, platform);
    let body = {};
    if (itemInfo) {
        body = {
            code: 200,
            data: itemInfo
        };
    } else {
        body = {
            code: 400,
            data: '',
            message: '请求失败！'
        };
    }
      this.ctx.body = body;
  }

  // 获取淘口令
  async getPassword() {

      const { text, url, logo } = this.ctx.request.query;

      let body = {};
      try{
          let res = await this.tbkClient(text, url, logo);
          body = {
              code: 200,
              data: res.data.model || ''
          };
      } catch (e) {
          body = {
              code: 400,
              data: '请求失败'
          };
      }
      this.ctx.body = body;
  }

  tbkClient(text, url, logo) {
      return new Promise((resolve, reject)=>{
          const client = new ApiClient({
              'appkey':'24688190',
              'appsecret':'c6d11887d7d35768833ddc55c2a9e8e7',
              'url':'http://gw.api.taobao.com/router/rest'
          });

          client.execute('taobao.tbk.tpwd.create', {
              'user_id':'124102488',
              'text':decodeURIComponent(text),
              'url':decodeURIComponent(url),
              'logo':decodeURIComponent(logo),
              'ext':'{}'
          }, function(error, response) {
              if (!error) {
                  console.log(response)
                  resolve(response)
              } else {
                  console.log(error)
                  reject(error)
              }
          })
      })
  }
}

module.exports = TbkController;