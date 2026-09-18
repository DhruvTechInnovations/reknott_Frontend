"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import type { DemoPersona } from "@/lib/demo-personas";

type ChatMessage = {
  id: number;
  senderId: string;
  body: string;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
};

type Conversation = {
  viewer: DemoPersona;
  other: DemoPersona;
  connection: { id: string; status: string };
  messages: ChatMessage[];
};

export function DemoChat({ embedded = false }: { embedded?: boolean }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const readTimerRef = useRef<number | null>(null);

  const loadConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/demo/conversation", { cache: "no-store" });
      if (response.status === 401) {
        setConversation(null);
        setLoading(false);
        return;
      }
      const payload = await response.json() as Conversation & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load messages.");
      setConversation(payload);
      setError("");

      const hasUnread = payload.messages.some(
        (message) => message.senderId !== payload.viewer.id && !message.readAt,
      );
      if (hasUnread && document.visibilityState === "visible" && readTimerRef.current === null) {
        readTimerRef.current = window.setTimeout(async () => {
          await fetch("/api/demo/messages/read", { method: "POST" });
          readTimerRef.current = null;
        }, 1800);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversation();
    const interval = window.setInterval(() => void loadConversation(), 1500);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadConversation();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      if (readTimerRef.current !== null) window.clearTimeout(readTimerRef.current);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadConversation]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation?.messages.length]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/demo/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to send the message.");
      setDraft("");
      await loadConversation();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send the message.");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  async function signOut() {
    await fetch("/api/demo/logout", { method: "POST" });
    window.location.assign("/login");
  }

  if (loading) {
    return <div className="chat-state"><span className="chat-loader" />Opening your private conversation...</div>;
  }

  if (!conversation) {
    return <div className="chat-state"><h2>Choose a demo member first</h2><p>Sign in as Ananya or Rahul to open their connected conversation.</p><Link className="btn btn-primary" href="/login">Choose a demo member</Link></div>;
  }

  return (
    <section className={`chat-shell${embedded ? " embedded" : ""}`} aria-label={`Conversation with ${conversation.other.displayName}`}>
      <header className="chat-header">
        <div className="chat-person">
          <div className="demo-avatar compact" aria-hidden="true">{conversation.other.initials}</div>
          <div><h1>{conversation.other.displayName}</h1><p><span className="online-dot" />Connected on ReKnott</p></div>
        </div>
        {!embedded && <div className="chat-account">
          <span>You are {conversation.viewer.displayName}</span>
          <button type="button" onClick={signOut}>Switch member</button>
        </div>}
      </header>

      <div className="chat-safety-note"><span aria-hidden="true">♥</span> This connection is part of the verified ReKnott demo. Share personal details only when you feel ready.</div>

      <div className="message-list" aria-live="polite">
        {conversation.messages.length === 0 && (
          <div className="empty-conversation">
            <span aria-hidden="true">🦋</span>
            <h2>A thoughtful conversation can begin simply.</h2>
            <p>Say hello, ask about a shared value or talk about the life you hope to build.</p>
          </div>
        )}
        {conversation.messages.map((message) => {
          const mine = message.senderId === conversation.viewer.id;
          return (
            <article className={`message-row${mine ? " mine" : ""}`} key={message.id}>
              <div className="message-bubble">
                <p>{message.body}</p>
                <div className="message-meta">
                  <time dateTime={message.sentAt}>{formatTime(message.sentAt)}</time>
                  {mine && <MessageReceipt message={message} />}
                </div>
              </div>
            </article>
          );
        })}
        <div ref={endRef} />
      </div>

      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="message-composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="message-draft">Message {conversation.other.displayName}</label>
        <textarea
          id="message-draft"
          value={draft}
          maxLength={1000}
          rows={2}
          placeholder={`Write to ${conversation.other.displayName.split(" ")[0]}...`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" type="submit" disabled={sending || !draft.trim()}>
          {sending ? "Sending..." : "Send"}<span aria-hidden="true">♥</span>
        </button>
      </form>
      <div className="receipt-legend" aria-label="Message status guide">
        <span><i>✓</i> Sent</span><span><i>✓✓</i> Delivered</span><span><i className="read">✓✓</i> Read</span>
      </div>
    </section>
  );
}

function MessageReceipt({ message }: { message: ChatMessage }) {
  if (message.readAt) return <span className="message-receipt read" title="Read" aria-label="Read">✓✓</span>;
  if (message.deliveredAt) return <span className="message-receipt" title="Delivered" aria-label="Delivered">✓✓</span>;
  return <span className="message-receipt" title="Sent" aria-label="Sent">✓</span>;
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
