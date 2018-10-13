import * as uuid from 'uuid';
import * as base32 from 'hi-base32';
import { kvsHandler } from './db';
import { promisify } from 'util';

export async function issueToken(value?: string, ttl = 3600) {
  const setAsync = promisify(kvsHandler.kvs.setex).bind(kvsHandler.kvs)
  const token = base32.encode(uuid.v4());
  return setAsync(token, ttl, value ? value : token).then(res => {
    return token;
  });
}

export async function getToken(key: string) {
  const getAsync = promisify(kvsHandler.kvs.get).bind(kvsHandler.kvs)
  return getAsync(key).then(res => {
    return res;
  });
}

export async function issuePrepareToken(email?: string, ttl = 3600) {
  const setAsync = promisify(kvsHandler.kvs.setex).bind(kvsHandler.kvs)
  const token = base32.encode(uuid.v4());
  return setAsync(email, ttl, token).then(res => {
    return token;
  });
}

export function deleteToken(key: string) {
  const delAsync = promisify(kvsHandler.kvs.del).bind(kvsHandler.kvs)
  return delAsync(key).then(res => {
    return res;
  });
}
