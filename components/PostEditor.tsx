
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { generateBlogContent, generateTitle, generateBlogPostImage } from '../services/geminiService';

interface PostEditorProps {
  post?: Post;
  onSave: (post: Partial<Post>) => void;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateBlogContent(prompt);
      setContent(result);
      if (!title) {
        const aiTitle = await generateTitle(result);
        setTitle(aiTitle);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!title && !prompt) return;
    setIsGenerating(true);
    try {
      const imgUrl = await generateBlogPostImage(title || prompt);
      setCoverImage(imgUrl);
    } catch (error) {
      console.error(error);
      alert('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-none focus:ring-0 placeholder-gray-300"
          />
          
          <div className="relative">
            {coverImage && (
              <div className="relative group mb-4">
                <img src={coverImage} className="w-full h-64 object-cover rounded-xl" alt="cover" />
                <button 
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            )}
          </div>

          <textarea
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] text-lg border-none focus:ring-0 resize-none placeholder-gray-300"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* AI Tools */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-orange-600 font-semibold">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <h3>AI Writing Assistant</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topic / Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should this blog post be about?"
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isGenerating || !prompt}
                onClick={handleGenerateContent}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-pen-nib"></i>}
                Write Draft
              </button>
              <button
                disabled={isGenerating || (!title && !prompt)}
                onClick={handleGenerateImage}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-image"></i>}
                AI Image
              </button>
            </div>
          </div>
        </div>

        {/* Publish Options */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-semibold mb-4 text-gray-900">Publishing</h3>
           <div className="space-y-3">
             <button
               onClick={() => onSave({ title, content, coverImage, status: 'published' })}
               className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors"
             >
               Publish Now
             </button>
             <button
               onClick={() => onSave({ title, content, coverImage, status: 'draft' })}
               className="w-full bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
             >
               Save Draft
             </button>
             <button
               onClick={onCancel}
               className="w-full text-red-500 text-sm hover:underline"
             >
               Discard changes
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
