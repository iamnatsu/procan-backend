import { User } from '../model/user';
import { DaoBase, DaoIFace } from './dao-base';
import { dbHandler as handler } from '../middle/db';
import * as Boom from 'boom';

export class UserDao extends DaoBase<User> implements DaoIFace {
  COLLECTION_NAME = 'USER';

  async put(id: string, user: User) {
    this.validateUpdate(id, user);
    return super.put(id, user);
  }

  async post(user: User) {
    await this.validate(user);
    return super.post(user);
  }

  private async validate(user: User) {
    if (!user.name) {
      throw Boom.badRequest('必須項目エラー: 名前');
    }
    if (!user.loginId) {
      throw Boom.badRequest('必須項目エラー: ログインID');
    }
    await this.getByLoginId(user.loginId).then(result => {
      if (result && result['id']) throw Boom.badRequest('重複エラー: ログインID');
    });
  }

  private async validateUpdate(id: string, user: User) {
    if (!user.name) {
      throw Boom.badRequest('必須項目エラー: 名前');
    }
    if (!user.loginId) {
      throw Boom.badRequest('必須項目エラー: ログインID');
    }
  }

  getByLoginId(loginId: String): Promise<Object> {
    return handler.db.collection(this.COLLECTION_NAME).findOne({loginId: loginId}).then(result => {
        return result
      }).catch(e => {
        return {};
      });
  }
}