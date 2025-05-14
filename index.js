// websocket-server/index.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  // 当有新客户端连接时，将其加入客户端集合
  clients.add(ws);

  // 监听客户端发送的消息
  ws.on('message', (message) => {
    // 广播消息给所有已连接的客户端
    for (const client of clients) {
      // 只向状态为OPEN(连接中)的客户端发送消息
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // 监听客户端断开连接事件
  ws.on('close', () => {
    // 从客户端集合中移除断开连接的客户端
    clients.delete(ws);
  });
});

// 设置服务器端口(优先使用环境变量PORT，默认3001)
const PORT = process.env.PORT || 3001;
// 启动HTTP/WebSocket服务器
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running at http://localhost:${PORT}`);
});
