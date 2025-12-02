
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import CardPreview from './components/CardPreview';
import ExportModal from './components/ExportModal';
import { CardData, INITIAL_DATA } from './types';
import { IconDownload } from './components/Icons';
import { generateShareUrl, decodeCardData } from './utils/sharing';

function App() {
  const [data, setData] = useState<CardData>(INITIAL_DATA);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Check for card data in URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('card');
    if (encodedData) {
      const decodedData = decodeCardData(encodedData);
      if (decodedData) {
        setData(decodedData);
      }
    }
  }, []);

  const handleDownload = () => {
    const url = generateShareUrl(data);
    setShareUrl(url);
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-heading text-xl">D</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">DigiCard<span className="text-indigo-600">Pro</span></span>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition-colors"
          >
            <IconDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export & Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Editor (Scrollable) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 lg:hidden mb-4">
                <p className="text-sm text-slate-500 text-center">👇 Edit details below. Preview is at the bottom.</p>
            </div>
            <Editor data={data} onChange={setData} />
          </div>

          {/* Right: Preview (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="bg-slate-200/50 rounded-[2.5rem] p-8 border border-slate-200/60 shadow-inner max-w-lg mx-auto lg:mx-0 lg:ml-auto">
               <div className="flex justify-center mb-6">
                 <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">Live Preview</span>
               </div>
               <CardPreview data={data} />
               <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">Designed for mobile viewing</p>
               </div>
            </div>
          </div>

        </div>
      </main>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        shareUrl={shareUrl} 
      />
    </div>
  );
}

export default App;
