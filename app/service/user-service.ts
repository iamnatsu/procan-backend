import { get, post, put, del } from '../middle/hapi';
import { User } from '../model/user';
import { Credential } from '../model/credential';
import { UserDao } from '../dao/user-dao';
import { BaseService } from './base-service';
import { FilterQuery } from 'mongodb';
import { getToken } from '../middle/credential';
import * as Bcrypt from 'bcryptjs';
import * as Boom from 'boom';

export class UserService extends BaseService {
  public path = '/user';
  private dao = new UserDao();

  @get('/{id}')
  async get(id: string) {
    return this.dao.get(id).then((result: User) => {
      if (result) delete result.password;
      return result;
    });
  }

  _get(id: string) {
    return this.dao.get(id).then((result: User) => {
      return result;
    });
  }

  @post('/_find')
  async find(payload: FilterQuery<User>, token?: string) {
    return this.dao.find(payload).then((result: User[]) => {
      return result.map(user => {delete user.password; return user});
    });
  }

  @post('/_suggest')
  async suggest(payload: {key: keyof User, value: string}, token?: string) {
    const q: FilterQuery<User> = {};
    q[payload.key] = new RegExp('^' + payload.value);
    return this.dao.find(q).then((result: User[]) => {
      return result.map(user => {delete user.password; return user});
    });
  }

  async getByLoginId(loginId: string) {
    return this.dao.getByLoginId(loginId).then((result: User) => {
      if (result) delete result.password;
      return result;
    });
  }

  async getByLoginIdInner(loginId: string) {
    return this.dao.getByLoginId(loginId);
  }

  @post('', true)
  async post(payload: User, token?: string) {
    return this.dao.post(await this.prepareCreate(payload, token)).then((result: User) => {
      if (result) delete result.password;
      return result;
    });
  }

  @put('/{id}', true)
  async put(id: string, payload: User, token: string) {
    this.validate(id, token);
    return this.dao.put(id, await this.prepareUpdate(payload, token)).then((result: User) => {
      if (result) delete result.password;
      return result;
    });
  }

  @del('/{id}')
  async delete() {
    return ;
  }

  private async validate(userId: string, token: string) {
    const t = await getToken(token);
    const c: Credential = JSON.parse(t);
    if (c.userId !== userId) Boom.forbidden('forbidden')
  }

  private async prepareCreate(user: User, token?: string) {
    user.audit = await this.createAudit(token);
    const salt = await Bcrypt.genSalt(10);
    user.password = await Bcrypt.hash(user.password, salt);
    return user;
  }

  private async prepareUpdate(user: User, token?: string) {
    if (!user.audit) {
      user.audit = await this.createAudit(token);
      if (user.password) {
        user.password = await Bcrypt.hashSync(user.password, user.audit.create.at.getUTCMonth());
      }
      return user;
    } else {
      user.audit = await this.updateAudit(user.audit, token);
      if (user.password) {
        user.password = await Bcrypt.hashSync(user.password, new Date(user.audit.create.at).getUTCMonth());
      } else {
        const u = await this._get(user.id);
        user.password = u.password;
      }
      return user;
    }
  }

}