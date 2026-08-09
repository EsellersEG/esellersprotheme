import React from 'react';
import { 
  Code2, 
  Sparkles, 
  FileArchive, 
  Copy, 
  BookOpen, 
  Download, 
  Play, 
  Layers, 
  Info,
  CheckCircle2,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { ESELLERS_THEME_INFO } from '../data/defaultTheme';

interface NavbarProps {
  activeTab: 'editor' | 'cloner' | 'analyzer' | 'generator' | 'docs' | 'preview';
  setActiveTab: (tab: 'editor' | 'cloner' | 'analyzer' | 'generator' | 'docs' | 'preview') => void;
  onExportZip: () => void;
  onRevertToBaseTheme?: () => void;
  fileCount: number;
  clonedCount: number;
  isExporting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExportZip,
  onRevertToBaseTheme,
  fileCount,
  clonedCount,
  isExporting = false
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Theme Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight leading-none">
                  {ESELLERS_THEME_INFO.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  OS 2.0
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Dev: <strong className="text-slate-200">{ESELLERS_THEME_INFO.developer}</strong></span>
                <span>•</span>
                <a href={`mailto:${ESELLERS_THEME_INFO.email}`} className="hover:text-blue-400 transition-colors">
                  {ESELLERS_THEME_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Theme Files</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-slate-900/60 rounded-full font-mono text-slate-300">
                {fileCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('cloner')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'cloner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Section Cloner</span>
              {clonedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded-full font-mono">
                  {clonedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileArchive className="w-3.5 h-3.5 text-indigo-400" />
              <span>ZIP Theme Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Shopify Docs</span>
            </button>
          </nav>

          {/* Action Buttons: Revert & Download Full Theme ZIP */}
          <div className="flex items-center gap-2">
            {onRevertToBaseTheme && (
              <button
                onClick={onRevertToBaseTheme}
                title="Revert workspace to the original default E-sellers Pro theme"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Reset Base Theme</span>
              </button>
            )}

            <button
              onClick={onExportZip}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all border border-emerald-500/30 active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Packaging ZIP...' : 'Export E-sellers Pro (.zip)'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
