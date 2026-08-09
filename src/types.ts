export interface ThemeFile {
  path: string; // e.g. "sections/hero-banner.liquid"
  content: string;
  category: 'layout' | 'sections' | 'snippets' | 'templates' | 'assets' | 'config' | 'locales';
  language: 'liquid' | 'json' | 'css' | 'javascript';
  readOnly?: boolean;
}

export interface ClonedSection {
  id: string;
  originalFileName: string;
  targetFileName: string;
  sourceThemeName: string;
  liquidCode: string;
  changesSummary: string[];
  originalIssuesFound: string[];
  createdAt: string;
}

export interface ZipAuditReport {
  fileName: string;
  totalFiles: number;
  sectionsCount: number;
  snippetsCount: number;
  performanceScore: number;
  os2CompatibilityScore: number;
  criticalIssues: string[];
  deprecatedTagsFound: string[];
  recommendations: string[];
  clonableSections: string[];
  summary: string;
}

export interface SampleProduct {
  id: string;
  title: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  badge?: string;
  variants: Array<{ id: string; title: string; price: number; available: boolean }>;
}

export interface ShopifyDocTopic {
  id: string;
  title: string;
  category: 'cli' | 'schema' | 'liquid' | 'architecture' | 'os2';
  summary: string;
  snippet: string;
  link?: string;
}
