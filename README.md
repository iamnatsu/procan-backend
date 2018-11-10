# procan
トレロライクのタスク管理ツール

の、バックエンドサービス.

docker 上でどこでも動作.

Node.js + hapi + mongodb + redis

## setting
通知メールを送るため、お持ちのメールカウントを設定する必要があります

docker-compose/docker-compose.yml
```
  environment:
    - smtphost=smtp.gmail.com
    - smtpport=465
    - smtpaccount= # smtp account
    - smtppass= # smtp password
```

install
```
npm install
```

## docker run
```
npm run docker:run
```
---

mongodb, redis を別で用意する場合

(接続先の変更要)

## serve
```
npm run serve
```

## debug
```
npm run debug
```
