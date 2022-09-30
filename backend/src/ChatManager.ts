import { promises as fs, createWriteStream, WriteStream } from 'fs';

class ChatManager {
  private chatWriteStream: WriteStream;
  constructor() {
    this.chatWriteStream = createWriteStream('chat.txt', { flags: 'a' });
  }

  public async sendMessage(message: string) {
    return new Promise<void>((res, rej) => {
      this.chatWriteStream.write(`${message}\n`, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  public async getHistory() {
    const chat = await fs.readFile('chat.txt', 'utf8');

    return chat.split(/\n/g).filter((m) => !!m);
  }
}

export default ChatManager;
