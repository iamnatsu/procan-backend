import { app, tokenOf } from '../middle/hapi'
import * as Boom from 'boom';
import { RegistService } from '../service/regist-service';
export const registService = new RegistService()

export function routeRegist() {
  app.route({
    method: 'post',
    path: RegistService.path,
    handler: async (request, h) => {
      return registService.prepare(request.payload['email']).then(result => {
        if (result) {
          return result;
        } else {
          throw Boom.badRequest('メールを送信できませんでした');
        }
      }).catch(e => {
        if (Boom.isBoom(e)) {
          throw e;
        }
        throw Boom.badRequest('メールを送信できませんでした');
      });
    }
  });
  app.route({
    method: 'put',
    path: RegistService.path,
    handler: async (request, h) => {
      return registService.regist(request.payload['email'], request.payload['name'], request.payload['password'], request.payload['token']).then(result => {
          if (result) {
              return result;
          } else {
              throw Boom.badRequest('登録できませんでした。はじめからやり直してください。');
          }
      }).catch(e => {
        if (Boom.isBoom(e)) {
          throw e;
        }
        throw Boom.badRequest('登録できませんでした。はじめからやり直してください。');
      });
    }
  });
}
