# backend/Dockerfile

# ビルダーフェーズ
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# アプリケーションをビルド
# 静的リンクオプションを追加 (バイナリの実行環境依存をなくすため)
RUN CGO_ENABLED=0 go build -a -installsuffix netgo -ldflags '-w -s' -o /app/refrigerator-app . && \
    chmod +x /app/refrigerator-app

# 実行フェーズ
FROM gcr.io/distroless/static-debian11

WORKDIR /app

## バイナリをイメージの標準実行ディレクトリへ配置して、
## ホストのボリュームマウントで上書きされないようにする
## --chmod フラグを使って実行権限を保持したままコピー
COPY --from=builder --chmod=0755 /app/refrigerator-app /usr/local/bin/refrigerator-app

# 実行コマンド
CMD ["/usr/local/bin/refrigerator-app"]