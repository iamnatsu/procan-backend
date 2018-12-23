import { get, post, put, del } from '../middle/hapi';
import { User } from '../model/user';
import { UserDao } from '../dao/user-dao';
import { BaseService } from './base-service';
import { FilterQuery } from 'mongodb';
import * as Bcrypt from 'bcryptjs';

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

  @post('/_find')
  async find(payload: FilterQuery<User>, token?: string) {
    return this.dao.find(payload).then((result: User[]) => {
      return result;
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
    return this.dao.put(id, await this.prepareUpdate(payload, token)).then((result: User) => {
      if (result) delete result.password;
      return result;
    });
  }

  @del('/{id}')
  async delete() {
    return ;
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
        user.password = await Bcrypt.hashSync(user.password, user.audit.create.at.getUTCMonth());
      }
      return user;
    }
  }

}