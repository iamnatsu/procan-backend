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
              throw Boom.unauthorized();
          }
      }).catch(() => {
        throw Boom.unauthorized()
      });
    }
  });
  app.route({
    method: 'put',
    path: RegistService.path,
    handler: async (request, h) => {
      return registService.regist(request.payload['email'], request.payload['name'], request.payload['password'], tokenOf(request)).then(result => {
          if (result) {
              return result;
          } else {
              throw Boom.unauthorized();
          }
      }).catch(() => {
        throw Boom.unauthorized()
      });
    }
  });
}
