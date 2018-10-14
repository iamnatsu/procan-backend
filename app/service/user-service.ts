import { get, post, put, del } from '../middle/hapi';
import { User } from '../model/user';
import { UserDao } from '../dao/user-dao';
import { Audit, Operation, Opeartor } from '../model/common';
import * as Bcrypt from 'bcrypt';

export class UserService {
  public path = '/user';
  private dao = new UserDao();

  @get('/{id}')
  async get(id: string) {
    return this.dao.get(id).then((result: User) => {
      if (result) delete result.password;
      return result;
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
    user.audit = new Audit();
    user.audit.create = this.currentOperation(token);
    user.audit.modify = user.audit.create;
    const salt = await Bcrypt.genSalt(10);
    user.password = await Bcrypt.hash(user.password, salt);
    return user;
  }

  private async prepareUpdate(user: User, token?: string) {
    if (!user.audit) {
      user.audit = new Audit();
      user.audit.create = this.currentOperation(token);
      user.audit.modify = user.audit.create;
      if (user.password) {
        user.password = await Bcrypt.hashSync(user.password, user.audit.create.at.getUTCMonth());
      }
      return user;
    } else {
      user.audit.modify = this.currentOperation(token);
      if (user.password) {
        user.password = await Bcrypt.hashSync(user.password, user.audit.create.at.getUTCMonth());
      }
      return user;
    }
  }

  private currentOperation(token?: string) {
    const operation = new Operation();
    operation.at = new Date();
    operation.operator = this.currentOperator(token)
    return operation;
  }

  private currentOperator(token?: string) {
    if (token) {
      // トークンから操作者を構築
      return new Opeartor('$system', '$system');
    } else {
      return new Opeartor('$system', '$system');
    }
  }
}