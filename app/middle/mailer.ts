import * as nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { promisify } from 'util';
import { SentMessageInfo } from 'nodemailer/lib/stream-transport';

const smtpConfig = {
  host: process.env.smtphost,
  port: Number(process.env.smtpport),
  secure: true, // SSL
  auth: {
      user: process.env.smtpaccount,
      pass: process.env.smtppass
  }
};

const smtp = nodemailer.createTransport(smtpConfig)

export function sendMail(message: SendMailOptions): Promise<SentMessageInfo> {
  const sendMailASync = promisify(smtp.sendMail).bind(smtp);
  return sendMailASync(message);
}