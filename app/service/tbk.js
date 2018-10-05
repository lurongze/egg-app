const Service = require('egg').Service;

class TbkService extends Service {
    async findList(page = 1, size = 5, platform = '淘宝') {
        page = Number.parseInt(page);
        size = Number.parseInt(size);
        return await this.app.mysql.select('tbk_item', {
            where: {item_platform: platform},
            limit: size,
            offset: (page - 1) * size
        });
    }

    async getItemInfo(itemId, platform) {
        const itemInfo = await this.app.mysql.get('tbk_item_info', {
            item_id: itemId
        });
        if (itemInfo) {
            return itemInfo.item_images || '[]';
        } else {
            const res = await this.spiderInfo(itemId, platform);
            console.log('res111', res);
            return JSON.stringify(res) || '[]';
        }
    }

    async spiderInfo(itemId, platform) {
        if (platform === '天猫') {
            return this.spiderInfoFromTmall(itemId);
        } else {
            return this.spiderInfoFromTaobao(itemId);
        }
    }

    async spiderInfoFromTmall(itemId) {

    }

    async spiderInfoFromTaobao(itemId) {
        const ctx = this.ctx;
        const result = await ctx.curl(`https://item.taobao.com/item.htm?id=${itemId}`);
        const res = result.data.toString();
        let arr = res.split(`location.protocol==='http:' ? '`);
        if (arr && arr.length > 0 && arr[1] && arr[1].length) {
            let arr1 = arr[1].split(`' : '`);
            if (arr1 && arr1.length > 0 && arr1[0] && arr1[0].length) {
                let getUrl = arr1[0].startsWith('http') ? arr1[0] : `http:${arr1[0]}`;
                const resultDetail = await ctx.curl(getUrl);
                let resDetail = resultDetail.data.toString();
                resDetail = resDetail.split(`src="`);
                let srcList = [];
                resDetail.forEach((n)=>{
                    if (n.startsWith(`http`)) {
                        let item = n.split(`"`);
                        if (item && item.length > 0) {
                            srcList.push(item[0]);
                        }
                    }
                });
                return srcList;
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    async saveItemInfo(itemId, images) {

    }
}
module.exports = TbkService;
