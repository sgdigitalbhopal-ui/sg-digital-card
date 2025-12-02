
import React, { useState } from 'react';
import { CardData, THEME_COLORS, Skill } from '../types';
import { IconMagicWand, IconUpload, IconDownload, IconLinkedin, IconTwitter, IconGlobe, IconInstagram, IconFacebook, IconGithub } from './Icons';
import { generateProfessionalBio, suggestSkills } from '../services/geminiService';

interface EditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [bioContext, setBioContext] = useState('');
  const [industryContext, setIndustryContext] = useState('Technology');

  const handleChange = (field: keyof CardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSocialChange = (field: keyof CardData['socials'], value: string) => {
    onChange({ ...data, socials: { ...data.socials, [field]: value } });
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange({ ...data, skills: newSkills });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'videoUrl') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // If it's a video, we might still want to use object URL for preview performance if not sharing,
      // but for sharing consistency we try base64. However, videos are too large for URL params usually.
      // We'll stick to Base64 for images to support sharing.
      if (field === 'photoUrl') {
        const reader = new FileReader();
        reader.onloadend = () => {
          handleChange(field, reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For video, still use Object URL as 5MB+ base64 strings will definitely break the browser URL limits
        const url = URL.createObjectURL(file);
        handleChange(field, url);
      }
    }
  };

  const handleGenerateBio = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not configured.");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const bio = await generateProfessionalBio(data.fullName, data.title, data.company, bioContext || "General Professional");
      handleChange('bio', bio);
    } catch (error) {
      alert("Failed to generate bio. Please check your API key.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSuggestSkills = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not configured.");
      return;
    }
    setIsSuggestingSkills(true);
    try {
      const skills = await suggestSkills(data.title, industryContext);
      handleChange('skills', skills);
    } catch (error) {
      alert("Failed to suggest skills.");
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      
      {/* Theme Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Theme & Appearance</h3>
        <div className="flex gap-3 flex-wrap">
          {THEME_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleChange('themeColor', color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${data.themeColor === color.value ? 'border-slate-800 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Profile Media */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Profile Media</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-slate-400 transition-colors relative cursor-pointer">
             <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'photoUrl')} />
             <IconUpload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
             <p className="text-xs text-slate-500">Upload Photo</p>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-slate-400 transition-colors relative cursor-pointer">
             <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'videoUrl')} />
             <IconUpload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
             <p className="text-xs text-slate-500">Upload Video (Optional)</p>
          </div>
        </div>
        {data.videoUrl && <button onClick={() => handleChange('videoUrl', null)} className="text-xs text-red-500 mt-2 hover:underline">Remove Video</button>}
      </div>

      {/* Personal Details */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Personal Details</h3>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Job Title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Company"
            value={data.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* AI Bio Generator */}
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                <IconMagicWand className="w-4 h-4 text-indigo-600" />
                AI Bio Writer
            </h3>
        </div>
        <div className="space-y-3">
            <input
                type="text"
                placeholder="Keywords (e.g., Innovative, 10yrs exp, Agile)"
                value={bioContext}
                onChange={(e) => setBioContext(e.target.value)}
                className="w-full p-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            />
            <button
                onClick={handleGenerateBio}
                disabled={isGeneratingBio}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                {isGeneratingBio ? 'Generating...' : 'Generate Professional Bio'}
            </button>
            <textarea
                value={data.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Your professional bio..."
                className="w-full p-2.5 rounded-lg border border-slate-200 h-24 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Contact Info</h3>
        <div className="grid gap-4">
          <input type="email" placeholder="Email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
          <input type="tel" placeholder="Phone" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
          <input type="text" placeholder="Location" value={data.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
        </div>
      </div>

      {/* Socials */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Social Links</h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 w-6"><IconLinkedin className="w-5 h-5"/></span>
            <input type="text" placeholder="LinkedIn URL" value={data.socials.linkedin || ''} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-slate-400 w-6"><IconTwitter className="w-5 h-5"/></span>
            <input type="text" placeholder="Twitter URL" value={data.socials.twitter || ''} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-slate-400 w-6"><IconInstagram className="w-5 h-5"/></span>
            <input type="text" placeholder="Instagram URL" value={data.socials.instagram || ''} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-slate-400 w-6"><IconFacebook className="w-5 h-5"/></span>
            <input type="text" placeholder="Facebook URL" value={data.socials.facebook || ''} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
           <div className="flex items-center gap-2">
             <span className="text-slate-400 w-6"><IconGithub className="w-5 h-5"/></span>
            <input type="text" placeholder="GitHub URL" value={data.socials.github || ''} onChange={(e) => handleSocialChange('github', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-slate-400 w-6"><IconGlobe className="w-5 h-5"/></span>
            <input type="text" placeholder="Website URL" value={data.socials.website || ''} onChange={(e) => handleSocialChange('website', e.target.value)} className="flex-1 p-2 rounded-lg border border-slate-200 text-sm" />
          </div>
        </div>
      </div>

      {/* Skills AI */}
      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-semibold text-emerald-900 uppercase tracking-wider mb-4 flex items-center gap-2">
             <IconMagicWand className="w-4 h-4 text-emerald-600" />
             Skills Visualizer
          </h3>
          <div className="flex gap-2 mb-4">
            <input 
                type="text" 
                value={industryContext}
                onChange={(e) => setIndustryContext(e.target.value)}
                placeholder="Industry (e.g. Finance)"
                className="flex-1 p-2 rounded-lg border border-emerald-200 text-sm bg-white"
            />
            <button
                onClick={handleSuggestSkills}
                disabled={isSuggestingSkills}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase"
            >
                {isSuggestingSkills ? '...' : 'Suggest'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
             {data.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <input 
                        value={skill.subject}
                        onChange={(e) => handleSkillChange(index, 'subject', e.target.value)}
                        className="flex-1 p-2 rounded border border-slate-200 text-sm"
                    />
                    <input 
                        type="number"
                        min="0"
                        max="100"
                        value={skill.A}
                        onChange={(e) => handleSkillChange(index, 'A', parseInt(e.target.value))}
                        className="w-20 p-2 rounded border border-slate-200 text-sm"
                    />
                </div>
             ))}
          </div>
      </div>

    </div>
  );
};

export default Editor;
