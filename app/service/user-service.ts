import { get, post, put, del } from '../middle/hapi';
import { User } from '../model/user';
import { UserDao } from '../dao/user-dao';

export class UserService {
  public path = '/user';
  private dao = new UserDao();

  @get('/{id}')
  async get(id: string) {
    return this.dao.get(id);
  }

  @post('', true)
  async post(payload: User) {
    return this.dao.post(payload);
  }

  @put('/{id}', true)
  async put(id: string, payload: User) {
    console.dir(id);
    console.dir(payload);
    return payload;
  }

  @del('/{id}')
  async delete() {
    return ;
  }
}