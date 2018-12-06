'use strict';

const Controller = require('egg').Controller;

class CosplayGalleryController extends Controller {
    async index() {
        const ctx = this.ctx;
        for (let i=1; i < 30; i++) {
            let result = await ctx.curl(`https://api.tuwan.com/apps/Welfare/getMenuList?from=pc&format=jsonp&page=${i}`);
            let res = eval(result.data.toString());
            let data = res.data;
            if (data && data.length > 0) {
                for (let item of data) {
                    this.app.mysql.insert('cosplay_gallery', {
                        gallery_id: item.id,
                        gallery_title: item.title,
                        gallery_cover: item.pic || ''
                    });
                }
            }
        }
        this.ctx.body = 'success';
    }

    async getList() {
        const { page, size } = this.ctx.request.query;
        const list = await this.ctx.service.cosplayGallery.findList(page, size);
        this.ctx.body = {
            data: {
                list: list
            }
        };
        this.ctx.status = 200;
    }

}

module.exports = CosplayGalleryController;