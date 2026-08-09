import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  ShoppingBag, 
  Search, 
  Menu, 
  Star, 
  Sparkles, 
  RefreshCw, 
  X,
  Sliders,
  Check,
  Eye
} from 'lucide-react';
import { ThemeFile } from '../types';

interface LivePreviewProps {
  files: ThemeFile[];
}

export const LivePreview: React.FC<LivePreviewProps> = ({ files }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [storeName, setStoreName] = useState('E-sellers Pro Store');
  const [currency, setCurrency] = useState('USD');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);

  // Extract sections loaded in files
  const loadedSectionFiles = files.filter(f => f.path.startsWith('sections/'));
  
  // Extract hero banner section title if custom edited in section code or index.json
  const indexJsonFile = files.find(f => f.path === 'templates/index.json');
  const heroSectionFile = files.find(f => f.path === 'sections/hero-banner.liquid');

  let heroHeading = "Build High-Converting Stores with E-sellers Pro";
  let heroSubheading = "Next-Gen Shopify Theme Engine by E-sellers";

  if (heroSectionFile) {
    const headingMatch = heroSectionFile.content.match(/"default":\s*"([^"]+)"/);
    if (headingMatch && headingMatch[1]) {
      heroHeading = headingMatch[1];
    }
  }

  const sampleProducts = [
    {
      id: '1',
      title: 'E-sellers Pro Performance Runner Sneakers',
      vendor: 'E-sellers Footwear',
      price: '$129.00',
      comparePrice: '$169.00',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      title: 'Ultra Minimalist Watch Titanium Edition',
      vendor: 'E-sellers Luxury',
      price: '$249.00',
      comparePrice: '$299.00',
      badge: '20% OFF',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3',
      title: 'Ergonomic Wireless Noise Canceling Headphones',
      vendor: 'E-sellers Tech',
      price: '$199.00',
      comparePrice: '$229.00',
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '4',
      title: 'Smart Fitness Companion & Health Tracker',
      vendor: 'E-sellers Tech',
      price: '$89.00',
      comparePrice: '$119.00',
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
      
      {/* Sandbox Controls Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Simulated OS 2.0 Storefront</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded transition-colors ${viewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded transition-colors ${viewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded transition-colors ${viewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Customizer Config */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Theme Accent:</span>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Shop Name:</span>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200 w-36"
            />
          </div>

          <button
            onClick={() => setCartOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded font-medium hover:bg-blue-600/30 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Test Cart Drawer ({cartCount})</span>
          </button>
        </div>

      </div>

      {/* Simulated Preview Canvas Wrapper */}
      <div className="flex-1 bg-slate-900/40 p-4 overflow-y-auto flex justify-center">
        <div className={`w-full ${getViewportWidthClass()} transition-all duration-300 bg-white text-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-700/50 flex flex-col min-h-[700px] relative`}>
          
          {/* Announcement Bar */}
          <div className="bg-slate-900 text-slate-100 text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
            <span>🎉 Flash Sale: Get 20% OFF E-sellers Pro Launch Items! Use code: <strong>ESELLERS20</strong></span>
          </div>

          {/* Active Injected Cloned Theme Sections Showcase */}
          {loadedSectionFiles.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between text-xs overflow-x-auto gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-200">Active Theme Sections ({loadedSectionFiles.length}):</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {loadedSectionFiles.slice(0, 8).map((secFile, idx) => {
                  const secName = secFile.path.replace('sections/', '').replace('.liquid', '');
                  return (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap"
                    >
                      {secName}
                    </span>
                  );
                })}
                {loadedSectionFiles.length > 8 && (
                  <span className="text-[10px] text-slate-400 font-mono">+{loadedSectionFiles.length - 8} more</span>
                )}
              </div>
            </div>
          )}

          {/* Theme Header */}
          <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
              
              <div className="flex items-center gap-6">
                <a href="#" className="font-extrabold text-xl tracking-tight text-slate-900">
                  {storeName}
                </a>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                  <a href="#" className="hover:text-blue-600 font-semibold" style={{ color: accentColor }}>Home</a>
                  <a href="#" className="hover:text-slate-900">Catalog</a>
                  <a href="#" className="hover:text-slate-900">Best Sellers</a>
                  <a href="#" className="hover:text-slate-900">About E-sellers</a>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-slate-600 hover:text-slate-900 p-1">
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCartOpen(true)} 
                  className="relative text-slate-600 hover:text-slate-900 p-1"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span 
                    className="absolute -top-1 -right-1.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    {cartCount}
                  </span>
                </button>
              </div>

            </div>
          </header>

          {/* Hero Banner Section */}
          <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.25),transparent)]"></div>
            <div className="relative max-w-4xl mx-auto text-center space-y-4">
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                {heroSubheading}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {heroHeading}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
                Next-generation section architecture designed specifically for conversion, ultra-fast core web vitals, and clean Liquid section cloning.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button 
                  className="px-6 py-3 font-semibold text-sm rounded-xl text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: accentColor }}
                >
                  Shop Best Sellers
                </button>
                <button className="px-6 py-3 font-semibold text-sm rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors">
                  Explore Features
                </button>
              </div>
            </div>
          </section>

          {/* Featured Collection Grid */}
          <section className="py-12 px-6 max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Featured Collection</h2>
              <p className="text-sm text-slate-500 mt-1">Rendered with E-sellers Pro OS 2.0 card-product snippet</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleProducts.map(prod => (
                <div key={prod.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {prod.badge}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{prod.vendor}</span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.title}</h3>
                    <div className="flex items-center gap-2 text-sm pt-1">
                      <span className="font-extrabold text-slate-900">{prod.price}</span>
                      <span className="text-slate-400 line-through text-xs">{prod.comparePrice}</span>
                    </div>
                    <button
                      onClick={() => setCartCount(c => c + 1)}
                      className="w-full mt-3 py-2 text-xs font-bold rounded-lg text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Simulated Cart Drawer */}
          {cartOpen && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
              <div className="w-80 sm:w-96 bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <h3 className="font-bold text-lg text-slate-900">Your Shopping Cart</h3>
                    <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="py-4 space-y-4">
                    <div className="flex gap-3 items-center border-b border-slate-100 pb-4">
                      <img src={sampleProducts[0].image} alt="Cart item" className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-slate-900">{sampleProducts[0].title}</h4>
                        <p className="text-slate-400">Qty: {cartCount}</p>
                        <span className="font-bold text-blue-600">{sampleProducts[0].price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>Subtotal</span>
                    <span>$129.00 USD</span>
                  </div>
                  <button 
                    className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md"
                    style={{ backgroundColor: accentColor }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-auto bg-slate-900 text-slate-300 py-8 px-6 text-xs border-t border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-slate-100 text-sm">{storeName}</p>
                <p className="text-slate-400">Theme: <strong>E-sellers Pro</strong> by <strong>E-sellers</strong> (info@e-sellers.net)</p>
              </div>
              <p className="text-slate-500">&copy; {new Date().getFullYear()} E-sellers. All rights reserved.</p>
            </div>
          </footer>

        </div>
      </div>

    </div>
  );
};
