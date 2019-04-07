import { UserService } from './user-service';
import * as Bcrypt from 'bcryptjs';
import { User } from '../model/user';
import { issueToken, deleteToken, getToken } from '../middle/credential';
import { Credential } from '../model/credential';
import * as Boom from 'boom';
import { LANGUAGE } from '../model/common';

export class AuthService {
  static path = '/auth';
  private userService = new UserService();

  async get(token: string) {
    return getToken(token).then(result => {
      const c: Credential = JSON.parse(result);
      c.id = token;
      return c;
    }).catch(() => {
      Boom.unauthorized();
    });
  }

  async post(loginId: string, password: string) {
    return this.issueToken(loginId, password);
  }

  async put(token: string) {
    return getToken(token).then(result => {
      const _c: Credential = JSON.parse(result);
      const now = new Date();
      const c = new Credential();
      c.userId = _c.userId;
      c.lastAccessedAt = (now).toISOString();
      c.expireAt = new Date((new Date().setDate(now.getDate() + 1))).toISOString();
      return issueToken(JSON.stringify(c)).then(token => {
        c.id = token;
        return c;
      });
    }).catch(() => {
      Boom.unauthorized();
    });
  }

  async delete(key: string) {
    return deleteToken(key);
  }

  private async issueToken(loginId: string, password: string) {
    const user = await this.userService.getByLoginIdInner(loginId) as User;
    return Bcrypt.compare(password, user.password).then(result => {
      if (result) {
        const now = new Date();
        const c = new Credential();
        c.userId = user.id;
        c.lastAccessedAt = (now).toISOString();
        c.expireAt = new Date((new Date().setDate(now.getDate() + 1))).toISOString();
        c.lang = user.lang || LANGUAGE.ja_JP;
        return issueToken(JSON.stringify(c)).then(token => {
          c.id = token;
          return c;
        });
      } else {
        return null;
      }
    }).catch(e => {
      throw e;
    });
  }
}