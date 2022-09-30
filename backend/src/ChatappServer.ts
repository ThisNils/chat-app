import ChatManager from './ChatManager';
import HttpServer from './HttpServer';

class ChatappServer {
  public http: HttpServer;
  public chatManager: ChatManager;
  constructor() {
    this.http = new HttpServer(this);
    this.chatManager = new ChatManager();
  }

  public async start() {
    await this.http.start();
  }
}

export default ChatappServer;
