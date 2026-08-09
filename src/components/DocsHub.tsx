import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Code2, 
  Search,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SHOPIFY_DOC_TOPICS } from '../data/shopifyDocs';

export const DocsHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTopics = SHOPIFY_DOC_TOPICS.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sky-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Shopify Developer Documentation Hub</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                Shopify CLI & OS 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official Shopify theme development specs, CLI commands, Liquid tag references, and OS 2.0 architecture standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://shopify.dev/docs/storefronts/themes/tools/cli/cli-2/commands"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-medium rounded-lg transition-colors"
            >
              <span>CLI 2 Commands</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://shopify.dev/docs/storefronts/themes/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-medium rounded-lg transition-colors"
            >
              <span>Shopify Theme Tools</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search docs, CLI commands, schema inputs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Topics List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {topic.category === 'cli' ? (
                      <Terminal className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Code2 className="w-4 h-4 text-purple-400" />
                    )}
                    <h3 className="font-bold text-slate-100 text-sm">{topic.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-800">
                    {topic.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{topic.summary}</p>

                <div className="relative group bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">{topic.snippet}</pre>
                  
                  <button
                    onClick={() => handleCopy(topic.snippet, topic.id)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Copy snippet"
                  >
                    {copiedId === topic.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {topic.link && (
                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <a
                    href={topic.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read on Shopify Dev</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
