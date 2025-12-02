
import React, { useState } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { 
  IconCopy, 
  IconCheck, 
  IconX, 
  IconTwitter, 
  IconLinkedin, 
  IconFacebook, 
  IconWhatsApp,
  IconImage
} from './Icons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

type FileFormat = 'png' | 'jpeg' | 'svg';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileFormat, setFileFormat] = useState<FileFormat>('png');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    const node = document.getElementById('card-preview-container');
    if (node) {
      try {
        let dataUrl;
        const options = { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' };
        
        switch (fileFormat) {
            case 'jpeg':
                dataUrl = await toJpeg(node, options);
                break;
            case 'svg':
                dataUrl = await toSvg(node, options);
                break;
            case 'png':
            default:
                dataUrl = await toPng(node, options);
                break;
        }

        const link = document.createElement('a');
        link.download = `digicard-pro.${fileFormat}`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to generate image', err);
        alert('Could not generate image. If you are using external images (like from Picsum), browser security might block the capture.');
      }
    }
    setIsDownloading(false);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: IconTwitter,
      color: 'bg-[#1DA1F2]',
      url: `https://twitter.com/intent/tweet?text=Check out my professional digital card!&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: IconLinkedin,
      color: 'bg-[#0077b5]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: IconFacebook,
      color: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: IconWhatsApp,
      color: 'bg-[#25D366]',
      url: `https://api.whatsapp.com/send?text=Check out my digital card: ${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Share Your Card</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-600 text-sm mb-4">
          Share this unique link. The card details are encoded directly within the URL.
        </p>

        {/* URL Input */}
        <div className="relative mb-6">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button 
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-md text-slate-500 transition-all shadow-sm border border-transparent hover:border-slate-200"
            title="Copy to clipboard"
          >
            {copied ? <IconCheck className="w-4 h-4 text-green-500" /> : <IconCopy className="w-4 h-4" />}
          </button>
        </div>

        {/* Download Section */}
        <div className="mb-8 border-t border-slate-100 pt-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Download as Image</label>
            <div className="flex gap-2">
                <select 
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as FileFormat)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                    <option value="svg">SVG</option>
                </select>
                <button 
                    onClick={handleDownloadImage}
                    disabled={isDownloading}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <span>Processing...</span>
                    ) : (
                        <>
                            <IconImage className="w-4 h-4" />
                            Download
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Social Share Buttons */}
        <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Share directly on</h3>
            <div className="flex justify-center gap-4">
                {shareLinks.map((link) => (
                    <a 
                        key={link.name}
                        href={link.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform ${link.color}`}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon className="w-6 h-6" />
                    </a>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
