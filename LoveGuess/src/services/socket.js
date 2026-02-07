class SocketService {
  ws = null;
  listeners = {};

  connect(roomCode) {
    if (this.ws) return; // evita reconectar

    this.ws = new WebSocket(
      `wss://occupational-augustina-alefk1708-7733c2aa.koyeb.app/ws/${roomCode}`
    );

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const handler = this.listeners[data.event];
      if (handler) handler(data);
    };

    this.ws.onclose = () => {
      console.log("socket closed");
      this.ws = null;
    };
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  send(event, payload = {}) {
    if (!this.ws) return;

    this.ws.send(JSON.stringify({ event, ...payload }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new SocketService();
