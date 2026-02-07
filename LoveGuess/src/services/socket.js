class SocketService {
  ws = null;
  listeners = {};

  connect(roomCode) {
    this.ws = new WebSocket(
      `ws://occupational-augustina-alefk1708-7733c2aa.koyeb.app/ws/${roomCode}`
    );

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      const handler = this.listeners[data.event];
      if (handler) handler(data);
    };
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  send(event, payload = {}) {
    this.ws.send(
      JSON.stringify({ event, ...payload })
    );
  }

  disconnect() {
    if (this.ws) this.ws.close();
  }
}

export default new SocketService();
