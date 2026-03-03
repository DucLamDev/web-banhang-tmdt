'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Headphones, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore, useAuthStore } from '@/lib/store';
import { chatApi } from '@/lib/api';
import { connectSocket, joinChat, sendMessage, getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

interface Message {
  _id?: string;
  sender: 'user' | 'bot' | 'admin' | 'system';
  senderName?: string;
  content: string;
  messageType: string;
  createdAt: Date;
}

interface ChatSession {
  sessionId: string;
  status: string;
  currentHandler: string;
  messages: Message[];
}

export default function ChatWidget() {
  const { isChatOpen, toggleChat, closeChat } = useUIStore();
  const { isAuthenticated, token } = useAuthStore();
  
  const [session, setSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen && isAuthenticated) {
      initChat();
    }
  }, [isChatOpen, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  useEffect(() => {
    if (session?.sessionId && isAuthenticated) {
      const socket = connectSocket(token || undefined);
      
      joinChat(session.sessionId);

      socket.on('new_message', (data: { sessionId: string; message: Message }) => {
        if (data.sessionId === session.sessionId) {
          setSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, data.message]
          } : null);
        }
      });

      socket.on('admin_joined', (data: { adminName: string }) => {
        setSession(prev => prev ? {
          ...prev,
          status: 'with_admin',
          currentHandler: 'admin'
        } : null);
        toast.success(`${data.adminName} đã tham gia hỗ trợ`);
      });

      socket.on('admin_left', () => {
        setSession(prev => prev ? {
          ...prev,
          status: 'active',
          currentHandler: 'bot'
        } : null);
      });

      return () => {
        socket.off('new_message');
        socket.off('admin_joined');
        socket.off('admin_left');
      };
    }
  }, [session?.sessionId, isAuthenticated, token]);

  const initChat = async () => {
    setLoading(true);
    try {
      const response = await chatApi.createSession();
      setSession(response.data.data);
    } catch (error) {
      console.error('Failed to init chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !session || sending) return;

    const content = message.trim();
    setMessage('');
    setSending(true);

    // Optimistic update
    const tempMessage: Message = {
      sender: 'user',
      content,
      messageType: 'text',
      createdAt: new Date(),
    };
    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempMessage]
    } : null);

    try {
      sendMessage(session.sessionId, content);
    } catch (error) {
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const requestAdmin = async () => {
    if (!session) return;
    
    try {
      await chatApi.requestAdmin(session.sessionId, 'Người dùng yêu cầu hỗ trợ');
      setSession(prev => prev ? { ...prev, status: 'waiting_admin' } : null);
      toast.success('Đang kết nối với nhân viên hỗ trợ...');
    } catch (error) {
      toast.error('Không thể kết nối');
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'bot':
        return <Bot className="w-4 h-4" />;
      case 'admin':
        return <Headphones className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-blue-500 text-white ml-auto';
      case 'bot':
        return 'bg-gray-100 text-gray-800';
      case 'admin':
        return 'bg-green-100 text-green-800';
      case 'system':
        return 'bg-yellow-50 text-yellow-800 mx-auto text-center text-sm';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isChatOpen ? 'bg-gray-600' : 'bg-primary hover:scale-110'
        }`}
      >
        {isChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl">🌐</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Thế Giới Di Động</h3>
              <p className="text-sm opacity-80">
                {session?.currentHandler === 'admin' 
                  ? '🟢 Đang chat với nhân viên' 
                  : '🤖 Trợ lý AI'}
              </p>
            </div>
            <button 
              onClick={closeChat}
              className="p-2 hover:bg-primary-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Vui lòng đăng nhập để chat</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {session?.messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${getSenderColor(msg.sender)}`}>
                      {msg.sender !== 'user' && msg.sender !== 'system' && (
                        <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                          {getSenderIcon(msg.sender)}
                          <span>{msg.sender === 'bot' ? 'Bot' : msg.senderName || 'Admin'}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Request Admin Button */}
          {isAuthenticated && session && session.currentHandler === 'bot' && session.status !== 'waiting_admin' && (
            <div className="px-4 py-2 border-t">
              <button
                onClick={requestAdmin}
                className="w-full text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                Gặp nhân viên hỗ trợ
              </button>
            </div>
          )}

          {session?.status === 'waiting_admin' && (
            <div className="px-4 py-2 border-t bg-yellow-50 text-center text-sm text-yellow-700">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Đang kết nối với nhân viên...
            </div>
          )}

          {/* Input */}
          {isAuthenticated && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                  disabled={!session}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || !session || sending}
                  className="bg-primary hover:bg-primary-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
