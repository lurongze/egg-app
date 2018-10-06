'use strict';

const Controller = require('egg').Controller;

class TbkController extends Controller {
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
}

module.exports = TbkController;