
import React from 'react';
import { Post } from '../types';

interface PostViewProps {
  post: Post;
  onBack: () => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-orange-600 flex items-center gap-2 font-medium transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Blog
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>

      {post.coverImage && (
        <img src={post.coverImage} className="w-full h-[400px] object-cover" alt={post.title} />
      )}

      <div className="p-8 md:p-16 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {post.tags[0] || 'Article'}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 pt-4">
            <img src="https://picsum.photos/seed/admin/100" className="w-12 h-12 rounded-full border-2 border-orange-100" alt="Author" />
            <div>
              <p className="font-bold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500 uppercase tracking-tighter">Verified Content Creator</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          {post.content.split('\n').map((para, i) => (
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          ))}
        </div>

        <div className="pt-12 border-t border-gray-100 mt-20">
          <div className="bg-gray-50 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-xl">Enjoyed this article?</h4>
              <p className="text-gray-500">Subscribe to get the latest updates directly in your inbox.</p>
            </div>
            <div className="flex-1 w-full flex gap-2">
              <input type="email" placeholder="email@example.com" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none" />
              <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
