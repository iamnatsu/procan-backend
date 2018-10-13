import * as mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'procan';

import * as redis from 'redis';

export function initDB(retryCnt = 1) {
  MongoClient.connect(url, async (err, client) => {
    if (err) {
      if (retryCnt <= 5) {
        console.error('cannot connect db. retry in ' + (5 * retryCnt) + ' secs');
        await wait(5 * retryCnt);
        initDB(++retryCnt);
      } else {
        console.error('gave up connect db.');
      }
    } else {
      console.log('Connected successfully to mongo');
      dbHandler.db = client.db(dbName);
      /*
      dbHandler.db.collection('USER').createIndex({id: 1}, {unique: true});
      dbHandler.db.collection('USER').createIndex({loginId: 1}, {unique: true});
      */
      initKvs();
    }
  });
}

export class DBHandler {
  public db: mongodb.Db;
}
export const dbHandler = new DBHandler();

function sleepByPromise(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
async function wait(sec) {
  await sleepByPromise(sec);
}

///// kvs

export class KvsHandler {
  public kvs: redis.RedisClient;
}
export const kvsHandler = new KvsHandler();

export function initKvs() {
  kvsHandler.kvs = redis.createClient(6379, 'redis');
  kvsHandler.kvs.on('connect', () => {
    console.log('Connected successfully to redis');
  });
}