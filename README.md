# 星闪管理台

第一版功能：管理员登录、运行概览、当前房间只读查看、App 版本草稿与发布管理。

## 开发

```sh
npm install
npm run dev
```

默认 API 地址为 `https://room.moonc.love/api/v1/admin`。本地地址通过 `.env` 覆盖：

```dotenv
VITE_API_BASE=http://127.0.0.1:8080/api/v1/admin
```

后端必须设置 `ADMIN_USERNAME` 与 `ADMIN_PASSWORD`。管理员令牌仅保存在浏览器 localStorage，默认有效期为 24 小时。

## 构建与部署

```sh
npm run build
```

将生成的 `dist/` 目录内容部署至后台站点的 Nginx 根目录。Nginx 需要将 `/api/` 代理至 `room-api:8080`，并对 SPA 设定回退：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://room-api:8080;
}
```
