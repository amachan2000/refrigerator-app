# Node.js開発環境
FROM node:20-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーし、依存関係をインストール
COPY package*.json ./
RUN npm ci --verbose || npm install --verbose

# アプリケーションコードをコピー
COPY . .

# Vite開発サーバーを起動（ホストバインド必須）
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
