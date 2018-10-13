import { issueToken, getToken, deleteToken } from '../middle/credential';
import { UserService } from './user-service';
import * as Boom from 'boom';
import { User } from '../model/user';

export class RegistService {
  static path = '/regist';
  private userService = new UserService();

  async prepare(email: string) {
    if (!email) {
      return Boom.badRequest('メールアドレスを入力してください');
    }
    const user = await this.userService.getByLoginId(email);
    if (user) {
      return Boom.badRequest('既に登録されているメールアドレスです');
    } else {
      console.log("prepare: issueToken");
      return issueToken(email);
    }
  }

  async regist(email: string, name: string, password: string, token: string) {
    const credential = await getToken(token);
    
    if (!credential || credential !== email) {
      return Boom.unauthorized();
    }
    const user = new User({loginId: email, name: name, password: password})
    return this.userService.post(user).then(result => {
      deleteToken(token);
      return result;
    });
  }

}