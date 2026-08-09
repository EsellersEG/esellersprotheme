import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Copy, 
  Check, 
  FileCode, 
  Wand2, 
  Layers, 
  Code, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ThemeFile } from '../types';

interface CodeEditorProps {
  file: ThemeFile | null;
  onUpdateContent: (path: string, newContent: string) => void;
  onTriggerAiRefactor?: (file: ThemeFile) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onUpdateContent,
  onTriggerAiRefactor
}) => {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setSaved(false);
      setJsonError(null);

      if (file.language === 'json') {
        try {
          JSON.parse(file.content);
        } catch (err: any) {
          setJsonError(err.message);
        }
      }
    }
  }, [file]);

  if (!file) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 text-slate-500">
        <FileCode className="w-16 h-16 stroke-1 text-slate-700 mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-300">No Theme File Selected</h3>
        <p className="text-xs max-w-sm text-center mt-1 text-slate-400">
          Select a file from the explorer on the left or create a new section, snippet, or template to begin editing.
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setSaved(false);

    if (file.language === 'json') {
      try {
        JSON.parse(val);
        setJsonError(null);
      } catch (err: any) {
        setJsonError(err.message);
      }
    }

    onUpdateContent(file.path, val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (file.language === 'json') {
      try {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
        onUpdateContent(file.path, formatted);
        setJsonError(null);
      } catch (err: any) {
        setJsonError("Cannot format invalid JSON: " + err.message);
      }
    }
  };

  const insertSnippet = (snippetText: string) => {
    const newContent = content + "\n" + snippetText;
    setContent(newContent);
    onUpdateContent(file.path, newContent);
  };

  const lineCount = content.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full border-r border-slate-800 overflow-hidden">
      
      {/* Editor Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-blue-400">{file.path}</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] uppercase">
            {file.language}
          </span>
          {file.readOnly && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
              Read Only
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {file.language === 'json' && (
            <button
              onClick={handleFormat}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
            >
              Format JSON
            </button>
          )}

          {onTriggerAiRefactor && (
            <button
              onClick={() => onTriggerAiRefactor(file)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 rounded font-medium transition-colors"
              title="Optimize & Refactor Liquid Code with AI"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Refactor</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Quick Snippets Bar for Liquid Files */}
      {file.language === 'liquid' && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold shrink-0">Insert Tags:</span>
          <button
            onClick={() => insertSnippet('{% schema %}\n{\n  "name": "Custom Section",\n  "settings": []\n}\n{% endschema %}')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono shrink-0"
          >
            + {"{% schema %}"}
          </button>
          <button
            onClick={() => insertSnippet('{% style %}\n  .es-custom-class {\n    padding: {{ section.settings.padding }}px;\n  }\n{% endstyle %}')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono shrink-0"
          >
            + {"{% style %}"}
          </button>
          <button
            onClick={() => insertSnippet('{% render "card-product", product: product %}')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono shrink-0"
          >
            + {"{% render %}"}
          </button>
          <button
            onClick={() => insertSnippet('<img src="{{ section.settings.image | image_url: width: 800 }}" alt="{{ section.settings.heading | escape }}" loading="lazy" width="800" height="600">')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono shrink-0"
          >
            + image_url
          </button>
        </div>
      )}

      {/* Code Textarea Area */}
      <div className="flex-1 relative flex font-mono text-xs leading-relaxed overflow-hidden">
        
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-slate-950 text-slate-600 text-right pr-3 select-none border-r border-slate-900 font-mono text-[11px] leading-relaxed overflow-hidden">
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={handleChange}
          readOnly={file.readOnly}
          spellCheck={false}
          className="flex-1 bg-slate-950 text-slate-200 p-3 outline-none resize-none overflow-y-auto font-mono text-xs leading-relaxed tab-4"
          placeholder="Enter Shopify Liquid or JSON code..."
        />
      </div>

      {/* JSON Schema Error Alert */}
      {jsonError && (
        <div className="bg-rose-950/80 border-t border-rose-800 px-4 py-2 flex items-center gap-2 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-mono">JSON Syntax Error: {jsonError}</span>
        </div>
      )}

      {/* Editor Footer Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>Lines: <strong className="text-slate-200">{lineCount}</strong></span>
          <span>Chars: <strong className="text-slate-200">{content.length}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Theme: <strong className="text-slate-300">E-sellers Pro</strong></span>
          <span>•</span>
          <span>Developer: <strong className="text-slate-300">E-sellers</strong></span>
        </div>
      </div>

    </div>
  );
};
