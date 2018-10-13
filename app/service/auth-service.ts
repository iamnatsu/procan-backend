import { UserService } from './user-service';
import * as Bcrypt from 'bcrypt';
import { User } from '../model/user';
import { issueToken, deleteToken } from '../middle/credential';

export class AuthService {
  static path = '/auth';
  private userService = new UserService();

  async post(loginId: string, password: string) {
    return this.issueToken(loginId, password);
  }

  async delete(key: string) {
    return deleteToken(key);
  }

  private async issueToken(loginId: string, password: string) {
    const user = await this.userService.getByLoginId(loginId) as User;
    return Bcrypt.compare(password, user.password).then(result => {
      if (result) {
        return issueToken();
      } else {
        return null;
      }
    }).catch(e => {
      throw e;
    });
  }
}