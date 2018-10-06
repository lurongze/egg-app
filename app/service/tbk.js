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
        const ctx = this.ctx;
        const result = await ctx.curl(`https://detail.tmall.com/item.htm?id=${itemId}`,{
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6726.400 QQBrowser/10.2.2265.400',
                'upgrade-insecure-requests':1,
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'max-age=0',
                'cookie': 't=c905e6f8ff3f1ebf0eb42ecd244f1898xx; _tb_token_=xx3a91737e63ea3; cookie2=xx147cd4526b22043d7d6b1af7f1d1f799; cna=xxRJAvFE9e4BkCAZ16OSZaLITT; pnm_cku822=098%23E1hvlQxxvUvbpvUvCkvvvvvjiPPsSwzjnmn2svgjYHPmPygj3Rn2MhtjinR2LwAjYWiQhvCvvv9UUtvpvhvvvvvvGCvvpvvPMMvphvC9vhvvCvpvyCvhQvuZvvC0kDyO2vSdtIjbmYSW94P5CXqU5EDfmlJ1kHsX7veEDT7t5xKO6TrmYCInVQSXoYW6oD6O03HbaihI0HsXZpVjIUDajxALwpKphv8vvvv2Evpvvvvvm2phCv2bUvvUnvphvpgvvv96CvpCCvvvm2phCv2b8EvpvVmvvC9jXHuphvmvvv92n8G5Mc; cq=ccp%3D1; isg=xxBI2N0Xl96sQZXU7onca5XJTHiamre-H2SdppS88S4iSTxq14lrjqDflcNBoFBtn0'
            }
        });

        let html = result.data.toString();
        let res = html.split(`httpsDescUrl":"`);
        if (res && res.length && res[1] && res[1].length) {
            let arr = res[1].split(`","`);
            if (arr && arr.length && arr[0] && arr[0].length) {
                return await this.getImages(itemId, arr[0]);
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    async spiderInfoFromTaobao(itemId) {
        const ctx = this.ctx;
        const result = await ctx.curl(`https://item.taobao.com/item.htm?id=${itemId}`);
        const res = result.data.toString();
        let arr = res.split(`location.protocol==='http:' ? '`);
        if (arr && arr.length > 0 && arr[1] && arr[1].length) {
            let arr1 = arr[1].split(`' : '`);
            if (arr1 && arr1.length > 0 && arr1[0] && arr1[0].length) {
                return await this.getImages(itemId, arr1[0]);
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    async getImages(itemId, url) {
        const ctx = this.ctx;
        let getUrl = url.startsWith('http') ? url : `http:${url}`;
        const resultDetail = await ctx.curl(getUrl);
        let resDetail = resultDetail.data.toString();
        resDetail = resDetail.split(`src="`);
        let srcList = [];
        resDetail.forEach((n)=>{
            if (n.startsWith(`http`)) {
                let item = n.split(`"`);
                if (item && item.length > 0 && item[0].includes('img.alicdn.com/imgextra')) {
                    srcList.push(item[0]);
                }
            }
        });
        this.saveItemInfo(itemId, srcList);
        return srcList;
    }

    saveItemInfo(itemId, images) {
        if (itemId.length > 0 && images.length > 0) {
            this.app.mysql.insert('tbk_item_info', {
                item_id: itemId,
                item_images: JSON.stringify(images)
            });
        }
    }
}
module.exports = TbkService;
