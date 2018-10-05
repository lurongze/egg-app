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
    console.log('itemInfo', itemInfo);
    this.ctx.body = {
      code: 200,
      data: itemInfo
    }
  }
}

module.exports = TbkController;