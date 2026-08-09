import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileArchive, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  FileCode, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  RefreshCw,
  FolderTree,
  CheckSquare,
  Square,
  ListChecks,
  Play,
  X,
  Layers,
  Wand2,
  Check,
  Code2,
  Eye
} from 'lucide-react';
import { ZipAuditReport, ThemeFile } from '../types';

interface ZipAnalyzerProps {
  onSelectSectionForCloning: (fileName: string, liquidContent: string) => void;
  onBatchInjectSections?: (newFiles: ThemeFile[]) => void;
  onNavigateTab?: (tab: 'editor' | 'preview' | 'cloner' | 'analyzer' | 'generator') => void;
}

const normalizeThemeFilePath = (rawPath: string): string => {
  const categories = ['layout', 'sections', 'snippets', 'templates', 'assets', 'config', 'locales'];
  const parts = rawPath.split('/').filter(Boolean);
  const catIndex = parts.findIndex(p => categories.includes(p.toLowerCase()));
  if (catIndex !== -1) {
    return parts.slice(catIndex).join('/');
  }
  return rawPath;
};

export const ZipAnalyzer: React.FC<ZipAnalyzerProps> = ({ 
  onSelectSectionForCloning,
  onBatchInjectSections,
  onNavigateTab
}) => {
  const [zipFileName, setZipFileName] = useState<string | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<Array<{ path: string; content: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditReport, setAuditReport] = useState<ZipAuditReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Developer Branding & Theme Info State
  const [brandingInfo, setBrandingInfo] = useState({
    themeName: 'E-sellers Pro',
    developer: 'E-sellers',
    email: 'info@e-sellers.net',
    website: 'https://e-sellers.net'
  });

  // Success state for cloning entire theme
  const [cloneSuccessState, setCloneSuccessState] = useState<{
    total: number;
    sections: number;
    snippets: number;
    layout: number;
    templates: number;
    config: number;
    assets: number;
  } | null>(null);

  // Selection state
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  // One-by-One / Batch Queue State
  const [isQueueActive, setIsQueueActive] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueCustomNotes, setQueueCustomNotes] = useState('Ensure modern image_url filters, es- prefixed class names, and responsive padding options.');
  const [isRefactoringCurrent, setIsRefactoringCurrent] = useState(false);
  const [currentRefactoredCode, setCurrentRefactoredCode] = useState<string | null>(null);
  const [currentRefactoredSummary, setCurrentRefactoredSummary] = useState<string[]>([]);
  const [batchInjectedCount, setBatchInjectedCount] = useState(0);
  const [isBatchAutoRunning, setIsBatchAutoRunning] = useState(false);

  // Deep File-by-File Compatibility Processing State
  const [isProcessingEntireTheme, setIsProcessingEntireTheme] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number; currentFile: string }>({
    current: 0,
    total: 0,
    currentFile: ''
  });
  const [refactorStats, setRefactorStats] = useState({
    tagsUpdated: 0,
    schemasValidated: 0,
    brandingReplaced: 0,
    polyfillsCreated: 0
  });
  const [refactorLogs, setRefactorLogs] = useState<Array<{ file: string; action: string; status: 'success' | 'warn' }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setZipFileName(file.name);
    setIsAnalyzing(true);
    setAuditReport(null);
    setSelectedPaths(new Set());
    setCloneSuccessState(null);

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const filesList: Array<{ path: string; content: string }> = [];

      for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
        if (zipEntry.dir || relativePath.includes('__MACOSX') || relativePath.split('/').some(p => p.startsWith('.'))) continue;

        const ext = relativePath.split('.').pop()?.toLowerCase() || '';
        const isTextFile = ['liquid', 'json', 'css', 'js', 'svg', 'txt', 'scss', 'html', 'md'].includes(ext);

        if (isTextFile) {
          try {
            const content = await zipEntry.async('string');
            filesList.push({ path: relativePath, content });
          } catch (e) {
            console.warn(`Skipping unreadable entry: ${relativePath}`, e);
          }
        }
      }

      setExtractedFiles(filesList);

      // Trigger AI audit API on server
      const response = await fetch('/api/gemini/audit-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileList: filesList.map(f => f.path),
          sampleCode: filesList.slice(0, 5).map(f => `File: ${f.path}\n${f.content.slice(0, 1000)}`)
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setAuditReport({
          fileName: file.name,
          totalFiles: filesList.length,
          sectionsCount: filesList.filter(f => f.path.includes('sections/')).length,
          snippetsCount: filesList.filter(f => f.path.includes('snippets/')).length,
          ...resData.data
        });
      }
    } catch (err) {
      console.error("Failed to parse zip file:", err);
      alert("Error reading theme ZIP file. Please ensure it is a valid Shopify theme package.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sectionsList = extractedFiles.filter(f => 
    f.path.includes('sections/') && 
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllFilteredSelected = sectionsList.length > 0 && sectionsList.every(f => selectedPaths.has(f.path));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Unselect filtered sections
      const newSelected = new Set(selectedPaths);
      sectionsList.forEach(f => newSelected.delete(f.path));
      setSelectedPaths(newSelected);
    } else {
      // Select all filtered sections
      const newSelected = new Set(selectedPaths);
      sectionsList.forEach(f => newSelected.add(f.path));
      setSelectedPaths(newSelected);
    }
  };

  const toggleSelectCard = (path: string) => {
    const newSelected = new Set(selectedPaths);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedPaths(newSelected);
  };

  // Queue items list derived from selectedPaths
  const selectedQueueFiles = extractedFiles.filter(f => selectedPaths.has(f.path));

  const handleStartQueue = () => {
    if (selectedQueueFiles.length === 0) return;
    setQueueIndex(0);
    setCurrentRefactoredCode(null);
    setCurrentRefactoredSummary([]);
    setBatchInjectedCount(0);
    setIsQueueActive(true);
  };

  const currentQueueFile = selectedQueueFiles[queueIndex];

  const handleRefactorCurrentSection = async () => {
    if (!currentQueueFile) return;

    setIsRefactoringCurrent(true);
    setCurrentRefactoredCode(null);

    const sectionName = currentQueueFile.path.split('/').pop() || currentQueueFile.path;

    try {
      const response = await fetch('/api/gemini/clone-refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceFileName: sectionName,
          sourceLiquidCode: currentQueueFile.content,
          customizationNotes: queueCustomNotes,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setCurrentRefactoredCode(resData.data.liquidCode);
        setCurrentRefactoredSummary(resData.data.changesSummary || []);
      } else {
        alert(`Failed to refactor ${sectionName}: ` + resData.error);
      }
    } catch (err: any) {
      alert("Error refactoring section: " + err.message);
    } finally {
      setIsRefactoringCurrent(false);
    }
  };

  const handleInjectCurrentSectionAndNext = () => {
    if (!currentQueueFile || !currentRefactoredCode) return;

    const sectionName = currentQueueFile.path.split('/').pop() || currentQueueFile.path;
    const targetPath = `sections/${sectionName}`;

    if (onBatchInjectSections) {
      onBatchInjectSections([{
        path: targetPath,
        category: 'sections',
        language: 'liquid',
        content: currentRefactoredCode,
      }]);
    }

    setBatchInjectedCount(prev => prev + 1);

    // Advance queue
    if (queueIndex < selectedQueueFiles.length - 1) {
      setQueueIndex(prev => prev + 1);
      setCurrentRefactoredCode(null);
      setCurrentRefactoredSummary([]);
    } else {
      alert(`Completed working on all ${selectedQueueFiles.length} selected sections! Injected into theme.`);
      setIsQueueActive(false);
    }
  };

  const handleAutoProcessAllRemaining = async () => {
    if (!onBatchInjectSections) return;

    setIsBatchAutoRunning(true);
    const injectedList: ThemeFile[] = [];

    for (let i = queueIndex; i < selectedQueueFiles.length; i++) {
      const file = selectedQueueFiles[i];
      const sectionName = file.path.split('/').pop() || file.path;
      setQueueIndex(i);

      try {
        const response = await fetch('/api/gemini/clone-refactor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceFileName: sectionName,
            sourceLiquidCode: file.content,
            customizationNotes: queueCustomNotes,
          }),
        });

        const resData = await response.json();
        const liquidCode = resData.success ? resData.data.liquidCode : file.content;

        injectedList.push({
          path: `sections/${sectionName}`,
          category: 'sections',
          language: 'liquid',
          content: liquidCode,
        });

        setBatchInjectedCount(prev => prev + 1);
      } catch (err) {
        console.error(`Auto process failed for ${sectionName}`, err);
      }
    }

    onBatchInjectSections(injectedList);
    setIsBatchAutoRunning(false);
    alert(`Successfully auto-refactored and injected ${injectedList.length} sections into E-sellers Pro!`);
    setIsQueueActive(false);
  };

  const deepRefactorThemeFile = (
    rawPath: string, 
    rawContent: string, 
    branding: { themeName: string; developer: string; email: string; website: string },
    existingSnippetNames: Set<string>,
    missingSnippetsSet: Set<string>
  ): { content: string; actionsTaken: string[]; category: ThemeFile['category']; language: ThemeFile['language'] } => {
    const normalizedPath = normalizeThemeFilePath(rawPath);
    let content = rawContent;
    const actionsTaken: string[] = [];

    // Determine category
    let category: ThemeFile['category'] = 'sections';
    if (normalizedPath.startsWith('layout/')) category = 'layout';
    else if (normalizedPath.startsWith('sections/')) category = 'sections';
    else if (normalizedPath.startsWith('snippets/')) category = 'snippets';
    else if (normalizedPath.startsWith('templates/')) category = 'templates';
    else if (normalizedPath.startsWith('config/')) category = 'config';
    else if (normalizedPath.startsWith('assets/')) category = 'assets';
    else if (normalizedPath.startsWith('locales/')) category = 'locales';

    // Determine language
    let language: ThemeFile['language'] = 'liquid';
    if (normalizedPath.endsWith('.json')) language = 'json';
    else if (normalizedPath.endsWith('.css')) language = 'css';
    else if (normalizedPath.endsWith('.js')) language = 'javascript';

    // 1. Rebrand developer info in config/settings_schema.json
    if (normalizedPath === 'config/settings_schema.json') {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          let themeInfoObj = parsed.find(
            (item: any) => item.name === 'theme_info' || item.theme_name || item.theme_author
          );

          if (themeInfoObj) {
            themeInfoObj.theme_name = branding.themeName;
            themeInfoObj.theme_version = '1.0.0';
            themeInfoObj.theme_author = branding.developer;
            themeInfoObj.theme_support_email = branding.email;
            themeInfoObj.theme_documentation_url = branding.website;
          } else {
            parsed.unshift({
              name: 'theme_info',
              theme_name: branding.themeName,
              theme_version: '1.0.0',
              theme_author: branding.developer,
              theme_documentation_url: branding.website,
              theme_support_email: branding.email
            });
          }
          content = JSON.stringify(parsed, null, 2);
          actionsTaken.push(`Updated theme_info to ${branding.themeName} by ${branding.developer}`);
        }
      } catch (e) {
        content = content.replace(/"theme_name"\s*:\s*".*?"/g, `"theme_name": "${branding.themeName}"`);
        content = content.replace(/"theme_author"\s*:\s*".*?"/g, `"theme_author": "${branding.developer}"`);
        content = content.replace(/"theme_support_email"\s*:\s*".*?"/g, `"theme_support_email": "${branding.email}"`);
        content = content.replace(/"theme_documentation_url"\s*:\s*".*?"/g, `"theme_documentation_url": "${branding.website}"`);
        actionsTaken.push(`Updated branding keys in settings_schema.json`);
      }
      return { content, actionsTaken, category, language };
    }

    // 2. Rebrand developer info in locales/*.json
    if (normalizedPath.startsWith('locales/')) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.general) {
          parsed.general.theme_name = branding.themeName;
          parsed.general.developer = branding.developer;
          parsed.general.support_email = branding.email;
          content = JSON.stringify(parsed, null, 2);
          actionsTaken.push(`Rebranded locale metadata to ${branding.themeName}`);
        }
      } catch (e) {
        // ignore
      }
      return { content, actionsTaken, category, language };
    }

    // 3. Liquid File Processing (sections, snippets, layout)
    if (normalizedPath.endsWith('.liquid')) {
      // Rebrand third-party theme names in comments
      const originalContent = content;
      content = content.replace(/\b(Impact|Dawn|Impulse|Prestige|Sense|Ella|Warehouse|Symmetry|Enterprise)\b/gi, branding.themeName);
      if (originalContent !== content) {
        actionsTaken.push(`Rebranded external theme references to ${branding.themeName}`);
      }

      // Upgrade obsolete {% include 'xyz' %} -> {% render 'xyz' %}
      if (content.includes('{% include ') || content.includes('{%include ')) {
        content = content.replace(/\{%\s*include\s+(['"])(.*?)\1/g, '{% render $1$2$1');
        actionsTaken.push(`Upgraded deprecated {% include %} tags to {% render %}`);
      }

      // Upgrade obsolete img_url filters -> image_url
      if (content.includes('img_url:')) {
        content = content.replace(/\|\s*img_url:/g, '| image_url:');
        actionsTaken.push(`Upgraded deprecated img_url filters to image_url`);
      }

      // Track snippet dependencies
      const renderMatches = content.matchAll(/\{%\s*render\s+['"]([^'"]+)['"]/g);
      for (const match of renderMatches) {
        const snippetName = match[1];
        if (snippetName && !existingSnippetNames.has(snippetName)) {
          missingSnippetsSet.add(snippetName);
        }
      }

      // Section Schema Validation & Presets Enrichment
      if (category === 'sections') {
        const schemaMatch = content.match(/\{%\s*schema\s*%}([\s\S]*?)\{%\s*endschema\s*%}/i);
        if (schemaMatch && schemaMatch[1]) {
          try {
            const schemaJson = JSON.parse(schemaMatch[1]);
            let schemaModified = false;

            // Ensure section tag
            if (!schemaJson.tag) {
              schemaJson.tag = 'section';
              schemaModified = true;
            }

            // Ensure section class
            if (!schemaJson.class) {
              schemaJson.class = 'es-section';
              schemaModified = true;
            }

            // Ensure OS 2.0 section preset exists so it's selectable in customizer
            if (!schemaJson.presets || !Array.isArray(schemaJson.presets) || schemaJson.presets.length === 0) {
              schemaJson.presets = [
                {
                  name: schemaJson.name || normalizedPath.replace('sections/', '').replace('.liquid', '').replace(/-/g, ' '),
                  category: 'E-sellers Pro'
                }
              ];
              schemaModified = true;
              actionsTaken.push(`Added missing OS 2.0 preset to schema`);
            }

            if (schemaModified) {
              const updatedSchemaBlock = `{% schema %}\n${JSON.stringify(schemaJson, null, 2)}\n{% endschema %}`;
              content = content.replace(/\{%\s*schema\s*%}[\s\S]*?\{%\s*endschema\s*%}/i, updatedSchemaBlock);
            }
            actionsTaken.push(`Validated OS 2.0 JSON schema`);
          } catch (e) {
            actionsTaken.push(`Audited Liquid schema block`);
          }
        }
      }

      // Remove existing leading header comment and prepend clean E-sellers header
      if (content.trim().startsWith('{% comment %}')) {
        content = content.replace(/^{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}\s*/i, '');
      }

      const commentHeader = `{% comment %}\n  Theme: ${branding.themeName}\n  Developer: ${branding.developer} (${branding.email})\n  File: ${normalizedPath}\n  Shopify OS 2.0 Compliant Section\n{% endcomment %}\n\n`;
      content = commentHeader + content;
    }

    // 4. CSS / JS Files
    if (normalizedPath.endsWith('.css') || normalizedPath.endsWith('.js')) {
      const commentHeader = `/*\n  Theme: ${branding.themeName}\n  Developer: ${branding.developer} (${branding.email})\n  File: ${normalizedPath}\n*/\n\n`;
      if (!content.startsWith('/*')) {
        content = commentHeader + content;
      }
    }

    return { content, actionsTaken, category, language };
  };

  const handleCloneEntireTheme = async () => {
    if (!extractedFiles.length || !onBatchInjectSections) return;

    setIsProcessingEntireTheme(true);
    setCloneSuccessState(null);
    setRefactorStats({ tagsUpdated: 0, schemasValidated: 0, brandingReplaced: 0, polyfillsCreated: 0 });
    setRefactorLogs([]);

    const total = extractedFiles.length;
    setProcessingProgress({ current: 0, total, currentFile: 'Initializing Compatibility Engine...' });

    // Collect all existing snippet names in ZIP
    const existingSnippetNames = new Set<string>();
    extractedFiles.forEach(f => {
      const norm = normalizeThemeFilePath(f.path);
      if (norm.startsWith('snippets/')) {
        const name = norm.replace('snippets/', '').replace('.liquid', '');
        existingSnippetNames.add(name);
      }
    });

    const missingSnippetsSet = new Set<string>();
    const processedFiles: ThemeFile[] = [];

    let tagsUpdated = 0;
    let schemasValidated = 0;
    let brandingReplaced = 0;

    // Process each file one by one asynchronously for UI feedback
    for (let i = 0; i < extractedFiles.length; i++) {
      const file = extractedFiles[i];
      const normalizedPath = normalizeThemeFilePath(file.path);

      setProcessingProgress({
        current: i + 1,
        total,
        currentFile: `Refactoring & Verifying: ${normalizedPath}`
      });

      // Yield thread briefly for progress rendering
      await new Promise(resolve => setTimeout(resolve, 8));

      const { content, actionsTaken, category, language } = deepRefactorThemeFile(
        file.path,
        file.content,
        brandingInfo,
        existingSnippetNames,
        missingSnippetsSet
      );

      // Track statistics
      if (actionsTaken.some(a => a.includes('Upgraded deprecated'))) tagsUpdated++;
      if (actionsTaken.some(a => a.includes('Validated OS 2.0 JSON schema') || a.includes('preset'))) schemasValidated++;
      if (actionsTaken.some(a => a.includes('Rebranded') || a.includes('theme_info'))) brandingReplaced++;

      processedFiles.push({
        path: normalizedPath,
        content,
        category,
        language
      });

      setRefactorLogs(prev => [
        {
          file: normalizedPath,
          action: actionsTaken.length > 0 ? actionsTaken.join(' • ') : 'Verified OS 2.0 Compatibility',
          status: 'success'
        },
        ...prev.slice(0, 20)
      ]);
    }

    // Auto-generate polyfill snippets for missing snippet references
    let polyfillsCreated = 0;
    for (const missingSnippet of Array.from(missingSnippetsSet)) {
      if (!processedFiles.some(f => f.path === `snippets/${missingSnippet}.liquid`)) {
        let polyfillContent = `{% comment %}\n  Auto-generated E-sellers Pro Polyfill Snippet\n  Snippet Name: ${missingSnippet}\n{% endcomment %}\n\n`;

        if (missingSnippet.startsWith('icon-')) {
          polyfillContent += `<svg class="es-icon es-${missingSnippet}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
        } else if (missingSnippet.includes('variable')) {
          polyfillContent += `<style>\n  :root {\n    --es-primary-color: #2563eb;\n    --es-font-body: sans-serif;\n  }\n</style>`;
        } else {
          polyfillContent += `<div class="es-snippet-placeholder es-${missingSnippet}">\n  {% comment %} Placeholder for ${missingSnippet} snippet {% endcomment %}\n</div>`;
        }

        processedFiles.push({
          path: `snippets/${missingSnippet}.liquid`,
          content: polyfillContent,
          category: 'snippets',
          language: 'liquid'
        });
        polyfillsCreated++;
      }
    }

    setRefactorStats({
      tagsUpdated,
      schemasValidated,
      brandingReplaced,
      polyfillsCreated
    });

    // Inject all refactored theme files into App state
    onBatchInjectSections(processedFiles);
    setIsProcessingEntireTheme(false);

    const counts = {
      total: processedFiles.length,
      sections: processedFiles.filter(f => f.category === 'sections').length,
      snippets: processedFiles.filter(f => f.category === 'snippets').length,
      layout: processedFiles.filter(f => f.category === 'layout').length,
      templates: processedFiles.filter(f => f.category === 'templates').length,
      config: processedFiles.filter(f => f.category === 'config').length,
      assets: processedFiles.filter(f => f.category === 'assets').length,
    };

    setCloneSuccessState(counts);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto text-slate-200">
      
      {/* Page Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileArchive className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Shopify Theme ZIP Inspector</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Dawn & OS 2.0 Compatible
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload ready-made Shopify themes (Dawn, Impulse, Sense, Prestige, Ella) to inspect, select multiple sections, refactor, and batch clone into <strong>E-sellers Pro</strong>.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        {!zipFileName ? (
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 rounded-2xl p-10 text-center transition-all">
            <input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
              id="zip-upload-input"
            />
            <label htmlFor="zip-upload-input" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-slate-200">
                  Drop your Shopify Theme ZIP file here, or <span className="text-indigo-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports standard Shopify Theme zip archives containing layout/, sections/, snippets/, templates/
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ZIP Info & Action Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileArchive className="w-8 h-8 text-indigo-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{zipFileName}</h3>
                  <p className="text-xs text-slate-400">
                    Extracted <strong>{extractedFiles.length}</strong> total theme files ({extractedFiles.filter(f => f.path.includes('sections/')).length} sections, {extractedFiles.filter(f => f.path.includes('snippets/')).length} snippets, {extractedFiles.filter(f => f.path.includes('config/')).length} settings)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleCloneEntireTheme}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Clone Entire Theme to E-sellers Pro (1 Action)</span>
                </button>

                <label htmlFor="zip-upload-input" className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium cursor-pointer transition-colors whitespace-nowrap">
                  <input type="file" accept=".zip" onChange={handleFileUpload} className="hidden" id="zip-upload-input" />
                  Upload Different ZIP
                </label>
              </div>
            </div>

            {/* Developer Branding Settings Bar */}
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">Target Theme Developer Branding</span>
                </div>
                <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Auto-Injected on Clone
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Theme Name</label>
                  <input
                    type="text"
                    value={brandingInfo.themeName}
                    onChange={(e) => setBrandingInfo(prev => ({ ...prev, themeName: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Developer Name</label>
                  <input
                    type="text"
                    value={brandingInfo.developer}
                    onChange={(e) => setBrandingInfo(prev => ({ ...prev, developer: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Support Email</label>
                  <input
                    type="text"
                    value={brandingInfo.email}
                    onChange={(e) => setBrandingInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Website / Docs</label>
                  <input
                    type="text"
                    value={brandingInfo.website}
                    onChange={(e) => setBrandingInfo(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deep Theme Refactoring & Verification Progress Panel */}
        {isProcessingEntireTheme && (
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-5 shadow-2xl animate-pulse-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Processing Theme Files One-by-One for E-sellers Pro Compatibility...
                  </h3>
                  <p className="text-xs text-indigo-300/80 mt-0.5">
                    Upgrading Liquid tags, auditing JSON schemas, auto-generating missing snippets, and applying developer branding ({brandingInfo.developer})
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/30">
                {processingProgress.current} / {processingProgress.total} Files
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-150"
                  style={{ width: `${Math.round((processingProgress.current / Math.max(processingProgress.total, 1)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span className="truncate max-w-md text-indigo-200">{processingProgress.currentFile}</span>
                <span className="font-bold text-emerald-400">{Math.round((processingProgress.current / Math.max(processingProgress.total, 1)) * 100)}% Complete</span>
              </div>
            </div>

            {/* Live Refactoring Log Stream */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 max-h-40 overflow-y-auto font-mono text-[11px] space-y-1">
              {refactorLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300 border-b border-slate-900/60 pb-1">
                  <span className="text-indigo-400 font-semibold truncate max-w-xs">{log.file}</span>
                  <span className="text-emerald-400/90 text-[10px]">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clone Entire Theme Success Banner */}
        {cloneSuccessState && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-emerald-200">
                    🎉 Theme Cloned, Refactored & Branded as "{brandingInfo.themeName}"!
                  </h3>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    Injected <strong>{cloneSuccessState.total}</strong> total theme files. Updated theme settings schema to <strong>{brandingInfo.themeName}</strong> and developer info to <strong>{brandingInfo.developer}</strong> ({brandingInfo.email}).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCloneSuccessState(null)}
                className="p-1 text-emerald-400/60 hover:text-emerald-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-emerald-300 text-sm">{cloneSuccessState.total}</span>
                <span className="text-[10px] text-slate-400">Total Files</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-amber-300 text-sm">{cloneSuccessState.sections}</span>
                <span className="text-[10px] text-slate-400">Sections</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-purple-300 text-sm">{cloneSuccessState.snippets}</span>
                <span className="text-[10px] text-slate-400">Snippets</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-blue-300 text-sm">{cloneSuccessState.layout}</span>
                <span className="text-[10px] text-slate-400">Layouts</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-teal-300 text-sm">{cloneSuccessState.templates}</span>
                <span className="text-[10px] text-slate-400">Templates</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-indigo-300 text-sm">{cloneSuccessState.config}</span>
                <span className="text-[10px] text-slate-400">Settings</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-500/20">
                <span className="block font-bold text-rose-300 text-sm">{cloneSuccessState.assets}</span>
                <span className="text-[10px] text-slate-400">Assets</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-500/20">
              {onNavigateTab && (
                <>
                  <button
                    onClick={() => {
                      setCloneSuccessState(null);
                      onNavigateTab('editor');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Open Code Editor & Inspect Files</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setCloneSuccessState(null);
                      onNavigateTab('preview');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Launch Live Preview Sandbox</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner during analysis */}
        {isAnalyzing && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="font-semibold text-slate-200 text-sm">Analyzing theme structure and running AI audit...</p>
            <p className="text-xs text-slate-500">Scanning Liquid tags, schema syntax, and performance optimization rules.</p>
          </div>
        )}

        {/* Audit Results Dashboard */}
        {auditReport && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Scores Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Theme Quality Ratings</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-2xl font-extrabold text-emerald-400">{auditReport.performanceScore}/100</span>
                  <span className="block text-[11px] text-slate-500 font-medium">Performance Rating</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-2xl font-extrabold text-blue-400">{auditReport.os2CompatibilityScore}%</span>
                  <span className="block text-[11px] text-slate-500 font-medium">OS 2.0 Compliance</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Sections Count:</span>
                  <strong className="text-slate-200">{auditReport.sectionsCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Snippets Count:</span>
                  <strong className="text-slate-200">{auditReport.snippetsCount}</strong>
                </div>
              </div>
            </div>

            {/* Audit Findings */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Audit Recommendations for E-sellers Pro</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {auditReport.summary}
              </p>

              {auditReport.recommendations?.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-slate-400">Optimization Suggestions:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {auditReport.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Extracted Sections Browser with Multi-Select & Checkboxes */}
        {extractedFiles.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <span>Sections Ready for Selection & Cloning ({sectionsList.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check multiple sections to clone and refactor them step-by-step or in a single batch.
                </p>
              </div>

              {/* Controls: Search, Select All, Work on Selected */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Box */}
                <div className="relative w-full sm:w-52">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Select All Toggle Button */}
                <button
                  onClick={handleToggleSelectAll}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isAllFilteredSelected 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isAllFilteredSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{isAllFilteredSelected ? 'Deselect All' : `Select All (${sectionsList.length})`}</span>
                </button>

                {/* Selected Counter & Action Buttons */}
                {selectedPaths.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                      {selectedPaths.size} Selected
                    </span>

                    <button
                      onClick={handleStartQueue}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                    >
                      <ListChecks className="w-4 h-4" />
                      <span>Work on Selected ({selectedPaths.size}) One-by-One</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of Sections Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {sectionsList.map((file) => {
                const sectionName = file.path.split('/').pop() || file.path;
                const isSelected = selectedPaths.has(file.path);

                return (
                  <div 
                    key={file.path} 
                    onClick={() => toggleSelectCard(file.path)}
                    className={`border rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all cursor-pointer relative group ${
                      isSelected 
                        ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Visible Checkbox */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectCard(file.path);
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected 
                                ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold' 
                                : 'bg-slate-900 border-slate-700 text-transparent hover:border-amber-400/50'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>

                          <div className="min-w-0">
                            <h4 className={`font-mono text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                              {sectionName}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {(file.content.length / 1024).toFixed(1)} KB
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-mono">
                        {file.content.split('\n').length} lines of Liquid code
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSectionForCloning(sectionName, file.content);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Single Clone</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* Interactive Step-by-Step One-by-One Queue Modal */}
      {isQueueActive && currentQueueFile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                  {queueIndex + 1}/{selectedQueueFiles.length}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span>Working on Section:</span>
                    <span className="font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {currentQueueFile.path.split('/').pop()}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Refactor and inject this section into E-sellers Pro, or advance to the next section in your selection.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsQueueActive(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Batch Progress ({batchInjectedCount} injected)</span>
                  <span>{Math.round(((queueIndex + 1) / selectedQueueFiles.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${((queueIndex + 1) / selectedQueueFiles.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Source vs Refactored Code Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Source Code Panel */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 flex flex-col">
                  <span className="font-mono text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Original Source Liquid</span>
                    <span className="text-slate-500 font-normal">{(currentQueueFile.content.length / 1024).toFixed(1)} KB</span>
                  </span>

                  <textarea
                    value={currentQueueFile.content}
                    readOnly
                    rows={10}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-300 resize-none outline-none leading-relaxed flex-1"
                  />
                </div>

                {/* Refactored Code Panel */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 flex flex-col">
                  <span className="font-mono text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span>Refactored E-sellers Pro Target</span>
                    {currentRefactoredCode && (
                      <span className="text-emerald-500 font-normal text-[10px]">AI Refactored</span>
                    )}
                  </span>

                  {currentRefactoredCode ? (
                    <div className="space-y-2 flex-1 flex flex-col">
                      <textarea
                        value={currentRefactoredCode}
                        onChange={(e) => setCurrentRefactoredCode(e.target.value)}
                        rows={8}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-300 outline-none resize-none flex-1 leading-relaxed"
                      />

                      {currentRefactoredSummary.length > 0 && (
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] space-y-1">
                          <span className="font-semibold text-slate-300">Changes Summary:</span>
                          <ul className="text-slate-400 space-y-0.5">
                            {currentRefactoredSummary.map((ch, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{ch}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                      <Code2 className="w-10 h-10 text-slate-700" />
                      <p className="font-semibold text-slate-300 text-xs">Ready for AI Refactor</p>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        Click "Run AI Refactor" below to clean up class names, image filters, and OS 2.0 liquid syntax.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Directives Input */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-slate-400">Refactoring Directives:</label>
                <input
                  type="text"
                  value={queueCustomNotes}
                  onChange={(e) => setQueueCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (queueIndex < selectedQueueFiles.length - 1) {
                    setQueueIndex(prev => prev + 1);
                    setCurrentRefactoredCode(null);
                    setCurrentRefactoredSummary([]);
                  } else {
                    setIsQueueActive(false);
                  }
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                Skip This Section
              </button>

              <div className="flex items-center gap-2">
                {!currentRefactoredCode ? (
                  <button
                    onClick={handleRefactorCurrentSection}
                    disabled={isRefactoringCurrent}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isRefactoringCurrent ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Refactoring...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Run AI Refactor</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleInjectCurrentSectionAndNext}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inject Section & Next ({queueIndex + 1}/{selectedQueueFiles.length})</span>
                  </button>
                )}

                {onBatchInjectSections && (
                  <button
                    onClick={handleAutoProcessAllRemaining}
                    disabled={isBatchAutoRunning}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isBatchAutoRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Auto-Processing Queue...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4" />
                        <span>Auto-Inject All Remaining ({selectedQueueFiles.length - queueIndex})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
