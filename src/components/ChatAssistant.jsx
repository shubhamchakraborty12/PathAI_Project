import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLearning, buildWelcomeMessage } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Sparkles, 
  Lightbulb, 
  Zap,
  Check,
  Copy
} from 'lucide-react';

const PROMPT_SUGGESTIONS = [
  "Explain my skill gaps for my target role",
  "What is my current role readiness score and course?",
  "Recommend a portfolio capstone project idea",
  "How can I finish this roadmap in 4 weeks?"
];

/**
 * Helper to parse bold (**text**), italic (*text*), and code (`code`) tokens into React nodes.
 */
function parseFormattedTokens(str) {
  if (!str || typeof str !== 'string') return [];
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono text-xs">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="chat-bold-text font-semibold text-white">
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      parts.push(
        <span key={match.index} className="chat-highlight-text text-purple-300 italic">
          {italicText}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}

/**
 * Parses and formats table cell content, handling <br> tags, bullets, and status icons.
 */
function parseTableCellContent(cellText) {
  if (!cellText) return null;

  let cleaned = cellText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();

  // Render green checkmark badge for status symbols
  if (cleaned === '✅' || cleaned === '✔' || cleaned.toLowerCase() === '[x]' || cleaned.toLowerCase() === 'done' || cleaned.toLowerCase() === 'completed') {
    return (
      <div className="inline-flex items-center justify-center rounded bg-emerald-500/20 p-1 text-emerald-400">
        <Check size={14} className="stroke-[3]" />
      </div>
    );
  }

  const items = cleaned.split('\n').map(item => item.trim()).filter(Boolean);

  if (items.length <= 1) {
    return parseFormattedTokens(items[0] || '');
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, idx) => {
        const isBullet = item.startsWith('•') || item.startsWith('-');
        const itemText = isBullet ? item.replace(/^[•\-]\s*/, '') : item;
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-300 leading-relaxed">
            {isBullet && <span className="mt-0.5 font-bold text-amber-400">•</span>}
            <div className="flex-1">{parseFormattedTokens(itemText)}</div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Modern Dark Styled Interactive Table Component with Clipboard Copying
 */
function TableComponent({ headers, rows }) {
  const [copied, setCopied] = useState(false);

  const handleCopyTable = () => {
    const text = [
      headers.join('\t'),
      ...rows.map(r => r.join('\t'))
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl">
      {/* Table Top Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-purple-400">
          <span>Table View</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{rows.length} rows</span>
        </div>
        <button
          type="button"
          onClick={handleCopyTable}
          className="flex items-center gap-1.5 rounded-md bg-zinc-800/70 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
          title="Copy table contents"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="font-semibold text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 font-semibold text-zinc-100">
              {headers.map((hText, idx) => (
                <th key={idx} className="border-r border-zinc-800/60 px-4 py-3 font-bold text-zinc-200 last:border-r-0 uppercase tracking-wide text-[11px]">
                  {parseFormattedTokens(hText.replace(/<[^>]+>/g, ''))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {rows.map((rowCells, rIdx) => (
              <tr key={rIdx} className="transition-colors hover:bg-zinc-900/40">
                {rowCells.map((cellText, cIdx) => (
                  <td key={cIdx} className="border-r border-zinc-800/40 px-4 py-3 align-top leading-relaxed last:border-r-0">
                    {parseTableCellContent(cellText)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function parseTableData(tableLines) {
  if (!tableLines || tableLines.length === 0) return null;

  const rawRows = [];

  for (const line of tableLines) {
    if (/^\|?[\s:\-|\+]+\|?$/.test(line)) continue;

    let cells = [];
    if (line.includes('|')) {
      cells = line.split('|').map(c => c.trim());
      if (cells.length > 0 && cells[0] === '') cells.shift();
      if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
    } else if (line.includes('\t')) {
      cells = line.split('\t').map(c => c.trim()).filter(Boolean);
    }

    if (cells.length >= 2) {
      rawRows.push(cells);
    }
  }

  if (rawRows.length === 0) return null;

  const headers = rawRows[0];
  const rows = rawRows.slice(1);

  return { headers, rows };
}

/**
 * Rich message parser: detects tab/pipe Markdown tables, lists, formatting tokens, and strips raw HTML tags.
 */
function renderFormattedMessageContent(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.replace(/<br\s*\/?>/gi, '\n');
  const lines = text.split('\n');

  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    const isPipeLine = line.includes('|') && line.split('|').filter(c => c.trim()).length >= 2;
    const isTabLine = line.includes('\t') && line.split('\t').filter(c => c.trim()).length >= 2;

    if (isPipeLine || isTabLine) {
      const tableLines = [];

      while (i < lines.length) {
        const l = lines[i].trim();
        const pCount = (l.split('|').filter(c => c.trim())).length;
        const tCount = (l.split('\t').filter(c => c.trim())).length;

        if (!l) break;
        if (pCount < 2 && tCount < 2 && !/^\|?[\s:\-|\+]+\|?$/.test(l)) {
          break;
        }

        tableLines.push(l);
        i++;
      }

      const tableData = parseTableData(tableLines);
      if (tableData && tableData.headers.length > 0 && tableData.rows.length > 0) {
        blocks.push({ type: 'table', data: tableData });
      } else {
        tableLines.forEach(tl => blocks.push({ type: 'text', content: tl }));
      }
    } else {
      blocks.push({ type: 'text', content: lines[i] });
      i++;
    }
  }

  return blocks.map((block, blockIdx) => {
    if (block.type === 'table') {
      return (
        <TableComponent
          key={blockIdx}
          headers={block.data.headers}
          rows={block.data.rows}
        />
      );
    }

    const line = block.content;
    if (!line) {
      return <div key={blockIdx} className="h-2" />;
    }

    let cleanLine = line;
    if (cleanLine.startsWith('#')) {
      cleanLine = cleanLine.replace(/^#{1,6}\s*/, '');
    }

    cleanLine = cleanLine.replace(/<[^>]+>/g, '');

    const isBullet = cleanLine.startsWith('•') || cleanLine.startsWith('-') || /^\d+\./.test(cleanLine);
    if (isBullet) {
      cleanLine = cleanLine.replace(/^[•\-\d+\.]\s*/, '');
    }

    if (isBullet) {
      return (
        <div key={blockIdx} className="chat-bullet-row">
          <div className="chat-bullet-dot" />
          <div className="chat-bullet-content">
            {parseFormattedTokens(cleanLine)}
          </div>
        </div>
      );
    }

    return (
      <p key={blockIdx} className="chat-paragraph">
        {parseFormattedTokens(cleanLine)}
      </p>
    );
  });
}

export const ChatAssistant = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    resetChat,
    handleSuggestedAction, 
    profile, 
    gapResult
  } = useLearning();
  const { currentUser } = useAuth();

  const userName = currentUser?.name || profile?.name || 'Learner';

  const defaultWelcomeMsg = useMemo(() => {
    return buildWelcomeMessage(userName, gapResult.targetRole.title);
  }, [userName, gapResult.targetRole.title]);

  const displayMessages = useMemo(() => {
    if (chatMessages && chatMessages.length > 0) {
      return chatMessages;
    }
    return [defaultWelcomeMsg];
  }, [chatMessages, defaultWelcomeMsg]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const hasGroqKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    setIsTyping(true);

    await sendChatMessage(userText);
    setIsTyping(false);
  };

  const handleChipClick = async (promptText) => {
    setInputText('');
    setIsTyping(true);
    await sendChatMessage(promptText);
    setIsTyping(false);
  };

  return (
    <div className="chat-view-container">
      {/* Header Banner */}
      <div className="chat-header-bar">
        <div className="chat-ai-info">
          <div className="ai-avatar-circle">
            <Zap size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="chat-title">PathAI Executive Assistant</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PathAI Engine
              </span>
            </div>
            <span className="chat-status">
              <span className="online-dot" /> {hasGroqKey ? 'PathAI Cloud Active' : 'PathAI Local Mode'} • Context Aware ({gapResult.targetRole.title})
            </span>
          </div>
        </div>

        <div className="chat-context-pill">
          Learner: <strong>{userName}</strong> • Target Goal: <strong>{gapResult.targetRole.title}</strong>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages-area">
        {displayMessages.map(msg => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'is-user' : 'is-ai'}`}>
            <div className="avatar-bubble">
              {msg.sender === 'user' ? (
                <img src={currentUser?.avatar || profile.avatar} alt="User" className="user-chat-avatar" />
              ) : (
                <Zap size={18} className="text-amber-400" />
              )}
            </div>

            <div className="message-content">
              <div className="sender-meta flex items-center gap-2">
                <span className="sender-name">{msg.sender === 'user' ? userName : 'PathAI Executive Assistant'}</span>
                {msg.isGroq && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    PathAI Engine
                  </span>
                )}
                <span className="timestamp">{msg.timestamp}</span>
              </div>

              <div className="message-body">
                {renderFormattedMessageContent(msg.text)}
              </div>

              {/* Action Buttons attached to AI message */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="ai-actions-row">
                  {msg.suggestedActions.map((act, i) => (
                    <button 
                      key={i} 
                      className="btn-chat-action"
                      onClick={() => handleSuggestedAction(act.action)}
                    >
                      <Sparkles size={12} className="text-cyan-400" />
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-wrapper is-ai">
            <div className="avatar-bubble">
              <Zap size={18} className="text-amber-400" />
            </div>
            <div className="typing-indicator font-mono">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="ml-2 text-xs text-gray-400">
                PathAI is analyzing dashboard context...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="prompt-chips-bar">
        <span className="chips-label"><Lightbulb size={14} className="text-amber-400" /> Suggested Prompts:</span>
        <div className="chips-scroll">
          {PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <button key={idx} className="prompt-chip" onClick={() => handleChipClick(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder={`Ask PathAI about your ${gapResult.targetRole.title} dashboard...`}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="chat-input-field"
        />
        <button type="submit" className="btn-chat-send" disabled={!inputText.trim()}>
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

