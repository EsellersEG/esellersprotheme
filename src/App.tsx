import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Navbar } from './components/Navbar';
import { ThemeExplorer } from './components/ThemeExplorer';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { ZipAnalyzer } from './components/ZipAnalyzer';
import { SectionClonerModal } from './components/SectionClonerModal';
import { AiStudioGenerator } from './components/AiStudioGenerator';
import { DocsHub } from './components/DocsHub';

import { INITIAL_THEME_FILES, ESELLERS_THEME_INFO } from './data/defaultTheme';
import { ThemeFile, ClonedSection } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'cloner' | 'analyzer' | 'generator' | 'docs' | 'preview'>('editor');
  const [files, setFiles] = useState<ThemeFile[]>(INITIAL_THEME_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('sections/hero-banner.liquid');
  const [clonedHistory, setClonedHistory] = useState<ClonedSection[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Cloner state prefill when coming from Zip Inspector
  const [clonerPrefillFileName, setClonerPrefillFileName] = useState('');
  const [clonerPrefillCode, setClonerPrefillCode] = useState('');

  const activeFile = files.find(f => f.path === activeFilePath) || files[0] || null;

  const handleSelectFile = (file: ThemeFile) => {
    setActiveFilePath(file.path);
    if (activeTab !== 'editor') {
      setActiveTab('editor');
    }
  };

  const handleUpdateContent = (path: string, newContent: string) => {
    setFiles(prev =>
      prev.map(f => (f.path === path ? { ...f, content: newContent } : f))
    );
  };

  const handleCreateFile = (path: string, category: ThemeFile['category'], language: ThemeFile['language']) => {
    if (files.some(f => f.path === path)) {
      alert(`File "${path}" already exists!`);
      return;
    }

    let defaultContent = '';
    if (language === 'liquid') {
      defaultContent = `{% comment %}\n  Theme: ${ESELLERS_THEME_INFO.name}\n  Developer: ${ESELLERS_THEME_INFO.developer} (${ESELLERS_THEME_INFO.email})\n{% endcomment %}\n\n<div class="es-custom-block">\n  <!-- Enter Liquid Markup Here -->\n</div>\n\n{% schema %}\n{\n  "name": "New Section",\n  "settings": []\n}\n{% endschema %}`;
    } else if (language === 'json') {
      defaultContent = `{\n  "name": "E-sellers Pro Settings",\n  "sections": {}\n}`;
    }

    const newFile: ThemeFile = {
      path,
      category,
      language,
      content: defaultContent,
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFilePath(path);
    setActiveTab('editor');
  };

  const handleDeleteFile = (path: string) => {
    setFiles(prev => prev.filter(f => f.path !== path));
    if (activeFilePath === path) {
      const remaining = files.filter(f => f.path !== path);
      if (remaining.length > 0) {
        setActiveFilePath(remaining[0].path);
      }
    }
  };

  const handleSaveClonedSection = (newFile: ThemeFile, cloneInfo: ClonedSection) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.path !== newFile.path);
      return [...filtered, newFile];
    });

    setClonedHistory(prev => [cloneInfo, ...prev]);
    setActiveFilePath(newFile.path);
    setActiveTab('editor');
  };

  const handleInjectAiSection = (newFile: ThemeFile) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.path !== newFile.path);
      return [...filtered, newFile];
    });

    setActiveFilePath(newFile.path);
    setActiveTab('editor');
  };

  const handleSelectSectionFromZip = (fileName: string, liquidContent: string) => {
    setClonerPrefillFileName(fileName);
    setClonerPrefillCode(liquidContent);
    setActiveTab('cloner');
  };

  const handleBatchInjectSections = (newFiles: ThemeFile[]) => {
    setFiles(prev => {
      const pathsToReplace = new Set(newFiles.map(f => f.path));
      const filtered = prev.filter(f => !pathsToReplace.has(f.path));
      return [...filtered, ...newFiles];
    });
    if (newFiles.length > 0) {
      setActiveFilePath(newFiles[0].path);
    }
  };

  const handleRevertToBaseTheme = () => {
    if (window.confirm("Revert workspace back to the original E-sellers Pro base theme files?")) {
      setFiles(INITIAL_THEME_FILES);
      setActiveFilePath('sections/hero-banner.liquid');
      setClonedHistory([]);
      setActiveTab('editor');
    }
  };

  const handleExportThemeZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add each theme file to ZIP
      files.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add standard Shopify theme manifest / info
      zip.file("config/settings_schema.json", files.find(f => f.path === 'config/settings_schema.json')?.content || JSON.stringify([
        {
          "name": "theme_info",
          "theme_name": ESELLERS_THEME_INFO.name,
          "theme_version": ESELLERS_THEME_INFO.version,
          "theme_author": ESELLERS_THEME_INFO.developer,
          "theme_support_email": ESELLERS_THEME_INFO.email
        }
      ], null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `E-sellers-Pro-Shopify-Theme.zip`);
    } catch (err: any) {
      alert("Failed to export theme zip: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans antialiased overflow-hidden">
      
      {/* App Header & Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportZip={handleExportThemeZip}
        onRevertToBaseTheme={handleRevertToBaseTheme}
        fileCount={files.length}
        clonedCount={clonedHistory.length}
        isExporting={isExporting}
      />

      {/* Main Studio Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor View */}
        {activeTab === 'editor' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            <ThemeExplorer
              files={files}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
            />
            <CodeEditor
              file={activeFile}
              onUpdateContent={handleUpdateContent}
              onTriggerAiRefactor={(f) => {
                setClonerPrefillFileName(f.path);
                setClonerPrefillCode(f.content);
                setActiveTab('cloner');
              }}
            />
          </div>
        )}

        {/* Live Preview View */}
        {activeTab === 'preview' && (
          <LivePreview files={files} />
        )}

        {/* Section Cloner View */}
        {activeTab === 'cloner' && (
          <SectionClonerModal
            initialFileName={clonerPrefillFileName}
            initialCode={clonerPrefillCode}
            onSaveClonedSection={handleSaveClonedSection}
            clonedHistory={clonedHistory}
          />
        )}

        {/* ZIP Theme Inspector View */}
        {activeTab === 'analyzer' && (
          <ZipAnalyzer 
            onSelectSectionForCloning={handleSelectSectionFromZip} 
            onBatchInjectSections={handleBatchInjectSections}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* AI Studio Liquid Generator View */}
        {activeTab === 'generator' && (
          <AiStudioGenerator onInjectSection={handleInjectAiSection} />
        )}

        {/* Shopify Developer Documentation View */}
        {activeTab === 'docs' && (
          <DocsHub />
        )}

      </div>

    </div>
  );
}
