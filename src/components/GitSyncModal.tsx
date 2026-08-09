import React, { useState, useEffect } from 'react';
import { 
  Github, 
  GitBranch, 
  Lock, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Send,
  X,
  FileCode,
  Globe,
  Settings
} from 'lucide-react';
import { ThemeFile } from '../types';

interface GitSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ThemeFile[];
}

export const GitSyncModal: React.FC<GitSyncModalProps> = ({ isOpen, onClose, files }) => {
  const [repo, setRepo] = useState(() => localStorage.getItem('es_github_repo') || '');
  const [token, setToken] = useState(() => localStorage.getItem('es_github_token') || '');
  const [branch, setBranch] = useState(() => localStorage.getItem('es_github_branch') || 'main');
  const [commitMessage, setCommitMessage] = useState('Sync Shopify E-sellers Pro theme files');
  
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (repo) localStorage.setItem('es_github_repo', repo);
  }, [repo]);

  useEffect(() => {
    if (token) localStorage.setItem('es_github_token', token);
  }, [token]);

  useEffect(() => {
    if (branch) localStorage.setItem('es_github_branch', branch);
  }, [branch]);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo.trim() || !token.trim()) {
      alert("Please provide both your GitHub Repository ('owner/repo') and a valid Personal Access Token (PAT).");
      return;
    }

    setIsPushing(true);
    setPushResult(null);

    // Prepare files array to be sent to backend
    const filesToPush = files.map(f => ({
      path: f.path,
      content: f.content
    }));

    try {
      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: repo.trim(),
          token: token.trim(),
          branch: branch.trim(),
          files: filesToPush,
          commitMessage: commitMessage.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setPushResult({
          success: true,
          message: data.message || `Successfully committed and pushed ${files.length} theme files!`
        });
      } else {
        setPushResult({
          success: false,
          message: data.error || "GitHub push failed. Please verify repository permission and Token."
        });
      }
    } catch (err: any) {
      setPushResult({
        success: false,
        message: err.message || "Network error trying to push to GitHub."
      });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Push Theme to GitHub</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Commit active E-sellers Pro files directly to your repo</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Panel Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          
          <form onSubmit={handlePush} className="space-y-4">
            
            {/* Repo & Branch */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub Repository</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. username/my-shopify-theme"
                  value={repo}
                  required
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>Branch</span>
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={branch}
                  required
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Token */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Personal Access Token (PAT)</span>
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                required
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Token needs <strong className="text-slate-400">repo</strong> permissions. Saved securely only in your browser's local storage.
              </p>
            </div>

            {/* Commit Message */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Commit Message</span>
              </label>
              <input
                type="text"
                placeholder="Commit description"
                value={commitMessage}
                required
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Stats list of files */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  Files to Push ({files.length})
                </span>
                <span className="text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded-full text-indigo-300 font-semibold border border-indigo-500/10">
                  Ready
                </span>
              </div>
              <div className="max-h-24 overflow-y-auto pr-1 text-[11px] font-mono text-slate-400 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex justify-between hover:text-slate-200">
                    <span className="truncate">{f.path}</span>
                    <span className="text-slate-600 shrink-0">~{(f.content?.length || 0).toLocaleString()} bytes</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPushing}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPushing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Pushing commits to GitHub repository...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Sync & Push {files.length} Theme Files</span>
                </>
              )}
            </button>
          </form>

          {/* Results Block */}
          {pushResult && (
            <div className={`p-4 rounded-xl border flex items-start gap-2.5 animate-fade-in ${
              pushResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              {pushResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold text-xs">{pushResult.success ? "Success!" : "Push Failed"}</span>
                <p className="text-[11px] opacity-90 leading-relaxed font-mono whitespace-pre-wrap">{pushResult.message}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
