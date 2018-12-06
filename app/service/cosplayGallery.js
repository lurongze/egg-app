const Service = require('egg').Service;

class cosplayGallery extends Service {

    async findList(page = 1, size = 10 ) {
        page = Number.parseInt(page);
        size = Number.parseInt(size);
        return await this.app.mysql.select('cosplay_gallery', {
            // where: {item_platform: platform},
            limit: size,
            offset: (page - 1) * size
        });
    }
}
module.exports = cosplayGallery;