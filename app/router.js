'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/tbk/item/list', controller.tbk.list);
  router.get('/tbk/item/viewDetail', controller.tbk.viewDetail);
};