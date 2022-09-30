import express from 'express';
import expressWs from 'express-ws';
import ws from 'ws';
import ChatappServer from './ChatappServer';

class HttpServer {
  private server: expressWs.Application;
  private wsServer: ws.Server;
  private main: ChatappServer;
  constructor(main: ChatappServer) {
    this.main = main;

    const expressWsApp = expressWs(express());

    this.server = expressWsApp.app;
    this.wsServer = expressWsApp.getWss();
  }

  public async start() {
    this.registerRoutes();
    await this.listen();
  }

  private registerRoutes() {
    this.server.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      
      next();
    });

    this.server.get('/api/chatHistory', async (req, res) => {
      const history = await this.main.chatManager.getHistory();

      res.json({
        messages: history,
      });
    });

    this.server.ws('/ws', (ws, req) => {
      ws.on('message', async (message) => {
        await this.main.chatManager.sendMessage(message.toString());
        this.wsServer.clients.forEach((c) => c.send(message.toString()));
      });
    });

    this.server.use(express.static('../frontend/build'));
  }

  private listen() {
    return new Promise<void>((res) => {
      this.server.listen(3001, () => {
        res();
      });
    });
  }
}

export default HttpServer;
