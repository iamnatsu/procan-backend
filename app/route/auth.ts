import { app, tokenOf } from '../middle/hapi'
import { AuthService } from '../service/auth-service';
import * as Boom from 'boom';
export const authService = new AuthService()

export function routeAuth() {
  app.route({
    method: 'get',
    path: AuthService.path,
    handler: async (request, h) => {
      return authService.get(tokenOf(request)).then(result => {
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
    method: 'post',
    path: AuthService.path,
    handler: async (request, h) => {
      return authService.post(request.payload['loginId'], request.payload['password']).then(result => {
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
    path: AuthService.path,
    handler: async (request, h) => {
      return authService.put(tokenOf(request)).then(result => {
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
    method: 'delete',
    path: AuthService.path,
    handler: async (request, h) => {
      return authService.delete(tokenOf(request)).then(result => {
          if (result || result === 0) {
              return null;
          } else {
              throw Boom.internal();
          }
      }).catch(() => {
        throw Boom.internal()
      });
    },
    options: {
      response: {
          emptyStatusCode: 204
      }
    }
  });
}