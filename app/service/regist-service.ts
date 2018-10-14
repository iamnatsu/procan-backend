import { issueToken, getToken, deleteToken } from '../middle/credential';
import { sendMail } from '../middle/mailer';
import { SendMailOptions } from 'nodemailer';
import { UserService } from './user-service';
import * as Boom from 'boom';
import { User } from '../model/user';

export class RegistService {
  static path = '/regist';
  private userService = new UserService();

  // post
  async prepare(email: string) {
    if (!email) {
      return Boom.badRequest('メールアドレスを入力してください');
    }
    const user = await this.userService.getByLoginId(email);
    if (user) {
      return Boom.badRequest('既に登録されているメールアドレスです');
    } else {
      console.log("prepare: issueToken");
      return issueToken(email).then(token => {
        const mail: SendMailOptions = {};
        mail.sender = 'Natsuho Wada <natsuho.wada@gmail.com>';
        mail.from = 'Natsuho Wada <natsuho.wada@gmail.com>';
        mail.to = email;
        mail.subject = 'welcome!';
        mail.text = 'ようこそ!\n'
         + '以下のURLにアクセスし、登録してください.\n'
         + 'http://localhost:82/#/regist/' + token;
        return sendMail(mail).then((info) => {
          return token;
        }).catch(err => {
          console.dir(err)
          return null;
        });
      });
    }
  }

  // put
  async regist(email: string, name: string, password: string, token: string) {
    console.log(email);
    console.log(name);
    console.log(password);
    console.log(token);
    const value = await getToken(token);
    if (!value || value !== email) {
      throw Boom.badRequest('登録できませんでした。はじめからやり直してください。[token error]');
    }
    const user = new User({loginId: email, name: name, password: password})
    return this.userService.post(user).then(result => {
      deleteToken(token);
      const mail: SendMailOptions = {};
      mail.sender = 'Natsuho Wada <natsuho.wada@gmail.com>';
      mail.from = 'Natsuho Wada <natsuho.wada@gmail.com>';
      mail.to = email;
      mail.subject = 'Thank you for your registration !';
      mail.text = 'Procan にご登録いただきありがとうございます。\n'
      + 'ご登録いただきました情報は、以下のとおりです。\n'
      + '\n'
      + 'LoginId (email): ' + email + '\n'
      + 'Password: ' + password + '\n'
      + '\n'
      + '以下のURLにアクセスし、Procan をご利用ください !\n'
      + 'http://localhost:82/#/login';
      
      return sendMail(mail).then((info) => {
        return result;
      }).catch(err => {
        console.dir(err)
        return result;
      });
    });
  }

}