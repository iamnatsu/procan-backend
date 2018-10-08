import { User } from '../model/user';

export class UserDao {
  public entityName = 'User';

  get(id: string) {
    return new User({
      id: 'nwada',
      loginId: 'nwada',
      name: 'nwada'
    });
  }

  post(user: User) {
    return user;
  }

  put(id: string, user: User) {
    return user;
  }
  delete() {
    
    return ;
  }
}