import * as Hapi from 'hapi';
//import 'zone.js';

export const PORT = process.env.PORT || 3000
export const app = new Hapi.Server({
  port: PORT
});
const SERVICE_MAP = {};

export function tokenOf(request: Hapi.Request): string | null {
  const hv = request.headers['authorization'];
  return hv ? hv.split(' ', 2)[1] : null; // FIXME 雑
}
/*
app.ext({
  type: 'onRequest',
  method: (request, h) => {
    return h.continue;
  }
})
*/

// decorator
export function get(template?: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _binder(target, propertyKey, descriptor, 'GET', template);
  }
}

export function post(template: string, hasPayload = true) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _binder(target, propertyKey, descriptor, 'POST', template, hasPayload);
  }
}

export function put(template: string, hasPayload = true) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _binder(target, propertyKey, descriptor, 'PUT', template, hasPayload);
  }
}

export function del(template?: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _binder(target, propertyKey, descriptor, 'DELETE', template);
  }
}

function _binder(target: any, propertyKey: string, descriptor: PropertyDescriptor, method: Hapi.Util.HTTP_METHODS_PARTIAL, template?: string, hasPayload = false) {
  const service = _service(target);
  const keys = _keys(template);
  app.route({
    method: method,
    path: service.path + (template ? template : ''),
    handler: async (request, h) => {
      const params: any[] = keys ? keys.map(a => request.params[a]) : [];
      if (hasPayload) {
        params.push(request.payload)
      }
      params.push(tokenOf(request))
      const result = await service[propertyKey].apply(service, params);
      return result || '';
    },
    options: {
      response: {
        emptyStatusCode: method === 'DELETE' ? 204 : 200
      }
    }
  });
}

function _keys(template) {
  if (!template) return null

  const keys = template.match(/\{.+?\}/g);
  if (keys && keys.length > 0) {
    return keys.map(k => k.substring(1, k.length - 1));
  } else {
    return null;
  }
}

function _service(target) {
  if (!SERVICE_MAP[target.constructor.name]) {
    SERVICE_MAP[target.constructor.name] = new target.constructor();
  }
  return SERVICE_MAP[target.constructor.name];
}