import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileCode, 
  AlertCircle, 
  Wand2, 
  RefreshCw,
  Code2
} from 'lucide-react';
import { ClonedSection, ThemeFile } from '../types';

interface SectionClonerProps {
  initialFileName?: string;
  initialCode?: string;
  onSaveClonedSection: (newFile: ThemeFile, cloneInfo: ClonedSection) => void;
  clonedHistory: ClonedSection[];
}

export const SectionClonerModal: React.FC<SectionClonerProps> = ({
  initialFileName = '',
  initialCode = '',
  onSaveClonedSection,
  clonedHistory,
}) => {
  const [sourceFileName, setSourceFileName] = useState(initialFileName);
  const [sourceCode, setSourceCode] = useState(initialCode);
  const [customizationNotes, setCustomizationNotes] = useState('Ensure modern image_url filters, es- prefixed class names, and responsive padding options.');

  const [isCloning, setIsCloning] = useState(false);
  const [clonedResult, setClonedResult] = useState<{
    targetFileName: string;
    liquidCode: string;
    changesSummary: string[];
    originalIssuesFound: string[];
  } | null>(null);

  useEffect(() => {
    if (initialFileName) setSourceFileName(initialFileName);
    if (initialCode) setSourceCode(initialCode);
  }, [initialFileName, initialCode]);

  const handleRunClone = async () => {
    if (!sourceCode.trim()) {
      alert("Please enter or upload Liquid section source code first.");
      return;
    }

    setIsCloning(true);
    setClonedResult(null);

    try {
      const response = await fetch('/api/gemini/clone-refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceFileName: sourceFileName || 'custom-section.liquid',
          sourceLiquidCode: sourceCode,
          customizationNotes,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setClonedResult(resData.data);
      } else {
        alert("Failed to clone section: " + resData.error);
      }
    } catch (err: any) {
      alert("Error calling section clone engine: " + err.message);
    } finally {
      setIsCloning(false);
    }
  };

  const handleApplyToTheme = () => {
    if (!clonedResult) return;

    const targetPath = `sections/${clonedResult.targetFileName}`;
    const newThemeFile: ThemeFile = {
      path: targetPath,
      category: 'sections',
      language: 'liquid',
      content: clonedResult.liquidCode,
    };

    const cloneRecord: ClonedSection = {
      id: Date.now().toString(),
      originalFileName: sourceFileName || 'External Section',
      targetFileName: clonedResult.targetFileName,
      sourceThemeName: 'Imported Theme',
      liquidCode: clonedResult.liquidCode,
      changesSummary: clonedResult.changesSummary || [],
      originalIssuesFound: clonedResult.originalIssuesFound || [],
      createdAt: new Date().toLocaleTimeString(),
    };

    onSaveClonedSection(newThemeFile, cloneRecord);
    alert(`Successfully created section "${targetPath}" in E-sellers Pro!`);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Copy className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Shopify Section Cloner & Migration Engine</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                AI Refactoring
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Convert any third-party section code (from Dawn, Impulse, Sense, Ella, Prestige) into clean, standalone Liquid & JSON Schema for <strong>E-sellers Pro</strong>.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Source Code Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Source Section Liquid Code</span>
              </label>
              <input
                type="text"
                placeholder="section-name.liquid"
                value={sourceFileName}
                onChange={(e) => setSourceFileName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono w-44"
              />
            </div>

            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste raw Shopify Liquid section code here ({% schema %}, HTML tags, Liquid filters)..."
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none focus:border-amber-500 resize-none flex-1 leading-relaxed"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Customization & Refactoring Directives:</label>
              <input
                type="text"
                value={customizationNotes}
                onChange={(e) => setCustomizationNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              />
            </div>

            <button
              onClick={handleRunClone}
              disabled={isCloning}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCloning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Refactoring Code for E-sellers Pro...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Clone & Refactor Section</span>
                </>
              )}
            </button>
          </div>

          {/* Refactored Result Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>E-sellers Pro Target Code</span>
              </label>
              {clonedResult && (
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {clonedResult.targetFileName}
                </span>
              )}
            </div>

            {clonedResult ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <textarea
                  value={clonedResult.liquidCode}
                  readOnly
                  rows={12}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 outline-none resize-none flex-1 leading-relaxed"
                />

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <span className="font-semibold text-slate-300 block">Improvements & Refactoring Summary:</span>
                  <ul className="space-y-1 text-slate-400">
                    {clonedResult.changesSummary?.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleApplyToTheme}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Inject into E-sellers Pro Theme Files</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <Code2 className="w-12 h-12 stroke-1 text-slate-700" />
                <p className="font-semibold text-slate-300 text-xs">Ready to Refactor</p>
                <p className="text-[11px] max-w-xs text-slate-500">
                  Paste section Liquid code or pick a file from the ZIP inspector, then click "Clone & Refactor Section".
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Cloning History List */}
        {clonedHistory.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-200">Recent Cloned Sections ({clonedHistory.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clonedHistory.map(item => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 truncate">{item.targetFileName}</span>
                    <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">Original: {item.originalFileName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
