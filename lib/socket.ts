import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token,
      },
    });
  }
  
  return socket;
};

export const connectSocket = (token?: string): Socket => {
  const sock = getSocket();
  
  if (token) {
    sock.auth = { token };
  }
  
  if (!sock.connected) {
    sock.connect();
  }
  
  return sock;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinChat = (sessionId: string): void => {
  const sock = getSocket();
  sock.emit('join_chat', { sessionId });
};

export const leaveChat = (sessionId: string): void => {
  const sock = getSocket();
  sock.emit('leave_chat', { sessionId });
};

export const sendMessage = (
  sessionId: string,
  content: string,
  messageType: string = 'text',
  metadata?: Record<string, unknown>
): void => {
  const sock = getSocket();
  sock.emit('send_message', { sessionId, content, messageType, metadata });
};

export const startTyping = (sessionId: string): void => {
  const sock = getSocket();
  sock.emit('typing_start', { sessionId });
};

export const stopTyping = (sessionId: string): void => {
  const sock = getSocket();
  sock.emit('typing_stop', { sessionId });
};

export const markMessagesRead = (sessionId: string, messageIds: string[]): void => {
  const sock = getSocket();
  sock.emit('mark_read', { sessionId, messageIds });
};
