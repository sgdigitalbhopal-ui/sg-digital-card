
import React, { useState } from 'react';
import { CardData } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconGlobe,
  IconLinkedin,
  IconTwitter,
  IconGithub,
  IconInstagram,
  IconFacebook
} from './Icons';

interface CardPreviewProps {
  data: CardData;
}

const CardPreview: React.FC<CardPreviewProps> = ({ data }) => {
  const [showSkills, setShowSkills] = useState(false);

  // Determine if text should be white or black based on theme brightness (simple heuristic)
  const isDarkTheme = ['#1e293b', '#e11d48', '#0891b2', '#4f46e5'].includes(data.themeColor);

  return (
    <div id="card-preview-container" className="w-full max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-white relative transition-all duration-300">
      
      {/* Header Background */}
      <div 
        className="h-32 w-full absolute top-0 left-0 z-0"
        style={{ backgroundColor: data.themeColor }}
      ></div>

      <div className="relative z-10 px-6 pt-12 pb-8">
        
        {/* Profile Photo */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
            {data.photoUrl ? (
              <img 
                src={data.photoUrl} 
                alt={data.fullName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-bold">
                {data.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-heading mb-1">{data.fullName}</h1>
          <p className="text-sm font-medium" style={{ color: data.themeColor }}>{data.title}</p>
          <p className="text-slate-500 text-sm">{data.company}</p>
        </div>

        {/* Bio */}
        <div className="mb-8 text-center px-4">
            <p className="text-slate-600 text-sm leading-relaxed italic">
                "{data.bio}"
            </p>
        </div>

        {/* Video (Optional) */}
        {data.videoUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-black">
            <video 
              controls 
              className="w-full h-48 object-cover"
              src={data.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Contact Links */}
        <div className="space-y-3 mb-8">
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.themeColor }}>
                <IconMail className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700">{data.email}</span>
            </a>
          )}
          
          {data.phone && (
            <a href={`tel:${data.phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.themeColor }}>
                <IconPhone className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700">{data.phone}</span>
            </a>
          )}

          {data.location && (
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.themeColor }}>
                <IconMapPin className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700">{data.location}</span>
            </div>
          )}

          {data.socials.website && (
            <a href={`https://${data.socials.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.themeColor }}>
                <IconGlobe className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700">{data.socials.website}</span>
            </a>
          )}
        </div>

        {/* Skills Chart Toggle */}
        {data.skills.length > 0 && (
          <div className="mb-8">
             <button 
                onClick={() => setShowSkills(!showSkills)}
                className="w-full py-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-center hover:text-slate-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-100 pt-4"
             >
                {showSkills ? 'Hide Competencies' : 'View Core Competencies'}
                <span className={`transform transition-transform ${showSkills ? 'rotate-180' : ''}`}>▼</span>
             </button>
            
            {showSkills && (
                <div className="h-48 w-full mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.skills}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Skills"
                        dataKey="A"
                        stroke={data.themeColor}
                        fill={data.themeColor}
                        fillOpacity={0.4}
                    />
                    </RadarChart>
                </ResponsiveContainer>
                </div>
            )}
          </div>
        )}

        {/* Social Icons Footer */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
            {data.socials.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors">
                    <IconLinkedin className="w-6 h-6" />
                </a>
            )}
            {data.socials.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1DA1F2] transition-colors">
                    <IconTwitter className="w-6 h-6" />
                </a>
            )}
             {data.socials.instagram && (
                <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E1306C] transition-colors">
                    <IconInstagram className="w-6 h-6" />
                </a>
            )}
            {data.socials.facebook && (
                <a href={data.socials.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-colors">
                    <IconFacebook className="w-6 h-6" />
                </a>
            )}
            {data.socials.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#333] transition-colors">
                    <IconGithub className="w-6 h-6" />
                </a>
            )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
