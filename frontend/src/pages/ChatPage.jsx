import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/common/Badge';
import {
  MessagesSquare, Send, ShieldAlert, UserX, CheckCheck,
  Search, AlertCircle, Sparkles
} from 'lucide-react';

export const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/conversations');
      if (res.data?.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activeConv) {
          setActiveConv(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages`);
      if (res.data?.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    setSending(true);
    try {
      const res = await api.post(`/chat/conversations/${activeConv.id}/messages`, {
        message_text: newMessage
      });
      if (res.data?.success) {
        setMessages(prev => [...prev, res.data.message]);
        setNewMessage('');
        // Update conversation preview
        setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, last_message_text: newMessage } : c));
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleBlockUser = async () => {
    if (!activeConv?.partner?.id) return;
    if (window.confirm(`Are you sure you want to block ${activeConv.partner.full_name}?`)) {
      try {
        await api.post('/chat/block', { targetUserId: activeConv.partner.id });
        alert(`${activeConv.partner.full_name} has been blocked.`);
      } catch (e) {
        // Ignore
      }
    }
  };

  const handleReportUser = async (e) => {
    e.preventDefault();
    alert(`Report submitted for review: "${reportReason}". TechBridge administrators will investigate.`);
    setReportModal(false);
    setReportReason('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex overflow-hidden">
      {/* Left Sidebar: Conversations List */}
      <div className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-brand-600" />
            <span>Private Messages</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Encrypted 1-on-1 Senior Discussions</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No conversations yet. Connect with a senior from the Mentorship page!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition ${isActive ? 'bg-brand-50/60 dark:bg-brand-950/40 border-r-2 border-brand-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <img
                    src={conv.partner?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.partner?.full_name || 'Senior Mentor'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {conv.partner?.placed_company && (
                      <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold block">
                        {conv.partner.placed_company}
                      </span>
                    )}
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {conv.last_message_text || 'Start chatting...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Window: Active Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 dark:bg-slate-900/30">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.partner?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activeConv.partner?.full_name || 'Senior Mentor'}</span>
                    <RoleBadge role={activeConv.partner?.role || 'placed_graduate'} showIcon={false} className="text-[9px]" />
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {activeConv.partner?.placed_company ? `Verified Engineer @ ${activeConv.partner.placed_company}` : 'Academic Peer'}
                  </span>
                </div>
              </div>

              {/* Safety Controls: Block & Report */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportModal(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1"
                  title="Report Inappropriate Content"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">Report</span>
                </button>
                <button
                  onClick={handleBlockUser}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1"
                  title="Block User"
                >
                  <UserX className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">Block</span>
                </button>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="text-center my-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500">
                  Messages are private and visible only to participants
                </span>
              </div>

              {messages.map((m) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img src={activeConv.partner?.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover mb-1 border" />
                    )}
                    <div className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${isMe ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'}`}>
                      <p>{m.message_text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your question or reply..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-xs text-slate-400">
            Select a conversation on the left to start private messaging.
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Report User or Message</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please specify the reason (e.g. offensive language, commercial spam, impersonation).
            </p>
            <form onSubmit={handleReportUser} className="space-y-3">
              <textarea
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
                placeholder="Explain the violation..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

