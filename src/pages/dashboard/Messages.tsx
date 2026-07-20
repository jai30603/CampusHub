import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Search, Send, MapPin, User, MessageSquare, Check, CheckCheck } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConvId = searchParams.get('id');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(
    queryConvId ? parseInt(queryConvId, 10) : null
  );
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Conversation List
  const fetchConversations = async (silent = false) => {
    if (!silent) setIsLoadingList(true);
    try {
      const response = await apiRequest('/conversations');
      if (response.success && response.data) {
        setConversations(response.data);
        
        // Auto-select first conversation if no query id
        if (!activeConvId && response.data.length > 0 && !queryConvId) {
          setActiveConvId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Fetch Conversation Messages
  const fetchMessages = async (convId: number, silent = false) => {
    if (!silent) setIsLoadingChat(true);
    try {
      const response = await apiRequest(`/conversations/${convId}/messages`);
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Mark Conversation Messages as Read
  const markAsRead = async (convId: number) => {
    try {
      await apiRequest(`/conversations/${convId}/read`, { method: 'PUT' });
      // Update unread count locally in list
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll conversations & message updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
      if (activeConvId) {
        fetchMessages(activeConvId, true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeConvId]);

  // Load chat window when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      const selected = conversations.find((c) => c.id === activeConvId);
      if (selected) {
        setActiveConv(selected);
      } else if (conversations.length > 0) {
        // Query details if not present in current list
        apiRequest(`/conversations/${activeConvId}`).then((res) => {
          if (res.success && res.data) {
            setActiveConv(res.data);
          }
        });
      }

      fetchMessages(activeConvId);
      markAsRead(activeConvId);
    }
  }, [activeConvId, conversations]);

  // Scroll to bottom of message board
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId || isSending) return;

    setIsSending(true);
    const textToSend = newMessage.trim();
    setNewMessage('');

    try {
      const response = await apiRequest(`/conversations/${activeConvId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message: textToSend }),
      });

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
        // Update last message in sidebar list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId ? { ...c, last_message: textToSend, last_message_at: new Date().toISOString() } : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Search Filter list
  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    const matchesUser = conv.other_user?.full_name?.toLowerCase().includes(query);
    const matchesListing = conv.listing?.title?.toLowerCase().includes(query);
    return matchesUser || matchesListing;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-7rem)] flex flex-col">
      <PageHeader
        title="Student Chat Center"
        description="Discuss item pickup locations, final negotiations, and verify condition with university peers"
      />

      <div className="flex-1 flex overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {/* Left Pane: Conversation Sidebar */}
        <div className="w-full sm:w-80 border-r border-border flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-border">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {isLoadingList && conversations.length === 0 ? (
              <div className="py-12 text-center">
                <LoadingSpinner size="sm" label="Loading chats..." />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const other = conv.other_user || {};
                const listing = conv.listing || {};
                const displayImg = listing.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80';

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setSearchParams({ id: String(conv.id) });
                    }}
                    className={`w-full p-4 flex gap-3 text-left transition-colors items-center hover:bg-accent/40 ${
                      isActive ? 'bg-primary/5 hover:bg-primary/5' : ''
                    }`}
                  >
                    {/* Listing Thumbnail */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-muted border border-border">
                      <img src={displayImg} alt={listing.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-foreground truncate">
                          {other.full_name || 'Student'}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-[11px] text-primary truncate font-medium">
                        {listing.title || 'Marketplace Item'}
                      </div>

                      <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                        {conv.last_message || 'No messages yet.'}
                      </p>
                    </div>

                    {/* Unread Indicator Badge */}
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window Feed */}
        <div className="hidden sm:flex flex-1 flex-col overflow-hidden bg-accent/20">
          {activeConvId && activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-card border-b border-border flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                    {activeConv.other_user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {activeConv.other_user?.full_name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> {activeConv.other_user?.college}
                    </p>
                  </div>
                </div>

                {/* Listing Details Header Widget */}
                {activeConv.listing && (
                  <Link
                    to={`/marketplace/${activeConv.listing.id}`}
                    className="flex items-center gap-2 p-2 rounded-xl bg-accent hover:bg-accent/80 border border-border max-w-[200px]"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={activeConv.listing.images?.[0]?.image_url}
                        alt={activeConv.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-[10px] font-bold text-foreground truncate">
                        {activeConv.listing.title}
                      </div>
                      <div className="text-[10px] text-primary font-bold">
                        ₹{activeConv.listing.price?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Message Board History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoadingChat && messages.length === 0 ? (
                  <div className="py-12 text-center">
                    <LoadingSpinner size="sm" label="Loading chat history..." />
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = String(msg.sender_id) === String(user?.id);
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs space-y-1 shadow-sm leading-relaxed ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card text-foreground rounded-tl-none border border-border/80'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <div
                            className={`text-[9px] flex items-center justify-end gap-1 ${
                              isMe ? 'text-primary-foreground/75' : 'text-muted-foreground'
                            }`}
                          >
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && (
                              <span>{msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-card border-t border-border flex gap-3 shrink-0">
                <input
                  type="text"
                  maxLength={1000}
                  className="flex-1 px-4 py-2 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ask about availability, inspection time, or propose pick up location..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newMessage.trim() || isSending}
                  leftIcon={isSending ? <LoadingSpinner size="sm" /> : <Send className="w-3.5 h-3.5" />}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-sm">Your Student Inbox</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Select a conversation from the sidebar list to view messages, coordinate item pickup, or final negotiations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
