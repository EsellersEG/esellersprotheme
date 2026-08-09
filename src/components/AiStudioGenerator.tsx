import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Code2, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  FileCode,
  Wand2
} from 'lucide-react';
import { ThemeFile } from '../types';

interface AiStudioGeneratorProps {
  onInjectSection: (newFile: ThemeFile) => void;
}

export const AiStudioGenerator: React.FC<AiStudioGeneratorProps> = ({ onInjectSection }) => {
  const [prompt, setPrompt] = useState('');
  const [sectionType, setSectionType] = useState('Hero Banner / Hotspot');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    liquidCode: string;
    sectionName: string;
    description: string;
    settingsCount: number;
    blocksCount: number;
  } | null>(null);

  const presetIdeas = [
    { title: "Interactive Hotspot Banner", desc: "Hero image with clickable product pin hotspots and popup details." },
    { title: "Sticky Variant Add-to-Cart", desc: "Fixed bar on product scroll with size/color select and instant checkout." },
    { title: "Tabbed Features & Video Modal", desc: "Multi-tab section with HTML5/YouTube video popups and spec list." },
    { title: "Comparison Table Section", desc: "Interactive grid comparing E-sellers Pro vs competitor products." },
    { title: "Customer Reviews Carousel", desc: "Testimonial slider with star ratings, verified buyer badge, and photo cards." },
    { title: "Newsletter & Discount Ticker", desc: "Full-width announcement ticker with countdown timer and instant coupon claim." }
  ];

  const handleGenerate = async (presetPrompt?: string) => {
    const finalPrompt = presetPrompt || prompt;
    if (!finalPrompt.trim()) {
      alert("Please enter a description for the Liquid section you want to generate.");
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/gemini/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          sectionType,
          mode: 'create'
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setGeneratedResult(resData.data);
      } else {
        alert("Generation error: " + resData.error);
      }
    } catch (err: any) {
      alert("Failed to connect to AI Studio server: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInject = () => {
    if (!generatedResult) return;

    const targetFileName = generatedResult.sectionName.endsWith('.liquid')
      ? generatedResult.sectionName
      : `${generatedResult.sectionName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.liquid`;

    const fullPath = `sections/${targetFileName}`;

    const newFile: ThemeFile = {
      path: fullPath,
      category: 'sections',
      language: 'liquid',
      content: generatedResult.liquidCode
    };

    onInjectSection(newFile);
    alert(`Added section "${fullPath}" to E-sellers Pro theme files!`);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">AI Studio - Liquid Section Builder</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                Powered by Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Describe any storefront feature in plain English. AI Studio will generate clean, performant Liquid, CSS variables, JS interactions, and valid Shopify OS 2.0 JSON Schema.
            </p>
          </div>
        </div>

        {/* Preset Prompt Badges */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Prompt Presets:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetIdeas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(idea.title + " - " + idea.desc);
                  handleGenerate(idea.title + " - " + idea.desc);
                }}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 rounded-xl text-left transition-all hover:bg-slate-900/80 group"
              >
                <h4 className="font-bold text-xs text-purple-300 group-hover:text-purple-200">{idea.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{idea.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Prompt Form & Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Prompt Generator Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-200">Section Goal & Design Prompt</label>
              <select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="Hero Banner">Hero Banner</option>
                <option value="Product Display">Product Display</option>
                <option value="Hotspot Section">Hotspot Section</option>
                <option value="Cart / Drawer">Cart / Drawer</option>
                <option value="Testimonials">Testimonials</option>
                <option value="Custom Modular">Custom Modular</option>
              </select>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create an animated sticky Add to Cart bar with variant selector, stock urgency counter, and express checkout buttons..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500 resize-none flex-1 leading-relaxed"
            />

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Liquid & Schema...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Liquid Section Code</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Output Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Generated Code Output</span>
              </label>
              {generatedResult && (
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {generatedResult.sectionName}
                </span>
              )}
            </div>

            {generatedResult ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {generatedResult.description}
                </p>

                <textarea
                  value={generatedResult.liquidCode}
                  readOnly
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-300 outline-none resize-none flex-1 leading-relaxed"
                />

                <button
                  onClick={handleInject}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Add Section to E-sellers Pro Theme</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <Sparkles className="w-12 h-12 stroke-1 text-slate-700 animate-pulse" />
                <p className="font-semibold text-slate-300 text-xs">AI Studio Ready</p>
                <p className="text-[11px] max-w-xs text-slate-500">
                  Select a preset or enter your custom Liquid section concept above to generate valid Shopify OS 2.0 code.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
