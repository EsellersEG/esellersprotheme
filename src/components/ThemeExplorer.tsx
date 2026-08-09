import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileJson, 
  Plus, 
  Trash2, 
  Search, 
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ThemeFile } from '../types';

interface ThemeExplorerProps {
  files: ThemeFile[];
  activeFile: ThemeFile | null;
  onSelectFile: (file: ThemeFile) => void;
  onCreateFile: (path: string, category: ThemeFile['category'], language: ThemeFile['language']) => void;
  onDeleteFile: (path: string) => void;
}

export const ThemeExplorer: React.FC<ThemeExplorerProps> = ({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    layout: true,
    sections: true,
    snippets: true,
    templates: true,
    assets: false,
    config: false,
    locales: false,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState<ThemeFile['category']>('sections');

  const categories: Array<{ id: ThemeFile['category']; label: string; iconColor: string }> = [
    { id: 'layout', label: 'layout/', iconColor: 'text-amber-400' },
    { id: 'sections', label: 'sections/', iconColor: 'text-blue-400' },
    { id: 'snippets', label: 'snippets/', iconColor: 'text-emerald-400' },
    { id: 'templates', label: 'templates/', iconColor: 'text-purple-400' },
    { id: 'assets', label: 'assets/', iconColor: 'text-rose-400' },
    { id: 'config', label: 'config/', iconColor: 'text-sky-400' },
    { id: 'locales', label: 'locales/', iconColor: 'text-orange-400' },
  ];

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let cleanName = newFileName.trim().toLowerCase();
    let language: ThemeFile['language'] = 'liquid';

    if (cleanName.endsWith('.json')) language = 'json';
    else if (cleanName.endsWith('.css')) language = 'css';
    else if (cleanName.endsWith('.js')) language = 'javascript';
    else if (!cleanName.includes('.')) {
      if (newCategory === 'templates' || newCategory === 'config' || newCategory === 'locales') {
        cleanName += '.json';
        language = 'json';
      } else {
        cleanName += '.liquid';
        language = 'liquid';
      }
    }

    const fullPath = `${newCategory}/${cleanName}`;
    onCreateFile(fullPath, newCategory, language);
    setNewFileName('');
    setIsCreating(false);
  };

  const filteredFiles = files.filter(f =>
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 select-none">
      
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Explorer
          </span>
          <button
            onClick={() => setIsCreating(prev => !prev)}
            className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
            title="Create new file"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* New File Creation Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-3 bg-slate-950 border-b border-slate-800 text-xs flex flex-col gap-2">
          <span className="font-semibold text-blue-400">Add New File</span>
          
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as ThemeFile['category'])}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="filename (e.g. custom-banner.liquid)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
            autoFocus
          />

          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-sm"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Categories Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {categories.map(cat => {
          const categoryFiles = filteredFiles.filter(f => f.category === cat.id);
          if (categoryFiles.length === 0 && searchTerm) return null;

          const isOpen = openCategories[cat.id];

          return (
            <div key={cat.id} className="mb-1">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  {isOpen ? (
                    <FolderOpen className={`w-4 h-4 ${cat.iconColor}`} />
                  ) : (
                    <Folder className={`w-4 h-4 ${cat.iconColor}`} />
                  )}
                  <span className="font-mono font-medium text-slate-300">{cat.label}</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-400">
                  {categoryFiles.length}
                </span>
              </button>

              {isOpen && (
                <div className="pl-6 border-l border-slate-800/60 ml-4 my-0.5 space-y-0.5">
                  {categoryFiles.map(file => {
                    const isActive = activeFile?.path === file.path;
                    const filename = file.path.replace(`${cat.id}/`, '');
                    const isJson = filename.endsWith('.json');

                    return (
                      <div
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`group flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isJson ? (
                            <FileJson className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          ) : (
                            <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className="truncate">{filename}</span>
                        </div>

                        {!file.readOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete file "${file.path}"?`)) {
                                onDeleteFile(file.path);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 text-slate-500 transition-opacity"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Target Architecture</span>
          <span className="text-emerald-400 font-medium">Shopify OS 2.0</span>
        </div>
      </div>

    </aside>
  );
};
