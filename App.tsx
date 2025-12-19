
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import PostEditor from './components/PostEditor';
import PostView from './components/PostView';
import { Post, ViewType } from './types';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of AI Content Generation',
    content: 'The landscape of content creation is shifting rapidly with the introduction of advanced reasoning models like Gemini 3. Writers are no longer just creators; they are curators and editors of AI-enhanced narratives.\n\nThis shift allows for more creativity and faster iteration cycles. In this post, we explore the nuances of this revolution...',
    excerpt: 'Exploring how next-generation AI models like Gemini 3 are revolutionizing the way writers work.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    author: 'Jane Preston',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['AI', 'Tech']
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('blogger_pro_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  useEffect(() => {
    localStorage.setItem('blogger_pro_posts', JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const handleSavePost = (updatedFields: Partial<Post>) => {
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === editingPost.id 
        ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() } 
        : p
      ));
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        title: updatedFields.title || 'Untitled Post',
        content: updatedFields.content || '',
        excerpt: (updatedFields.content || '').substring(0, 150).replace(/[#*`]/g, '') + '...',
        coverImage: updatedFields.coverImage,
        author: 'Jane Preston',
        status: updatedFields.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['New']
      };
      setPosts(prev => [newPost, ...prev]);
    }
    setEditingPost(undefined);
    setView('dashboard');
  };

  const deletePost = (id: string) => {
    if (window.confirm('Delete this post permanently?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const editPost = (post: Post) => {
    setEditingPost(post);
    setView('editor');
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setView('post-view');
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage your professional publishing workflow</p>
        </div>
        <div className="relative group">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search all posts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-orange-500/10 transition-all w-64" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Posts', value: posts.length, icon: 'fa-file-lines', color: 'blue' },
          { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: 'fa-paper-plane', color: 'emerald' },
          { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, icon: 'fa-pen-nib', color: 'orange' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-2xl font-bold">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={post.coverImage || 'https://picsum.photos/seed/p/100'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{post.title}</p>
                      <p className="text-xs text-gray-400 truncate">{post.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openPost(post)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button onClick={() => editPost(post)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Edit">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => deletePost(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReader = () => (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">THE BLOGGER</h1>
        <p className="text-lg text-gray-500 font-medium">Insights, stories and professional opinions from our editorial team.</p>
        <div className="flex justify-center gap-4 pt-4">
           <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all">Latest</button>
           <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all">Trending</button>
           <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all">Featured</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.filter(p => p.status === 'published').map(post => (
          <article key={post.id} onClick={() => openPost(post)} className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={post.coverImage || `https://picsum.photos/seed/${post.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest">{post.tags[0]}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  return (
    <Layout activeView={view} onNavigate={(v) => {
      setView(v);
      if (v !== 'editor' && v !== 'post-view') {
        setEditingPost(undefined);
        setSelectedPost(null);
      }
    }}>
      {view === 'dashboard' && renderDashboard()}
      {view === 'editor' && (
        <PostEditor post={editingPost} onSave={handleSavePost} onCancel={() => setView('dashboard')} />
      )}
      {view === 'reader' && renderReader()}
      {view === 'post-view' && selectedPost && (
        <PostView post={selectedPost} onBack={() => setView('reader')} />
      )}
      {view === 'settings' && (
        <div className="max-w-2xl bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Configuration</h2>
          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Blog Instance Name</label>
               <input type="text" defaultValue="Blogger Pro" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10" />
             </div>
             <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h4 className="font-bold text-orange-900 mb-2">Public Access</h4>
                <p className="text-sm text-orange-700/70">Your blog is currently available at a temporary simulation URL.</p>
                <div className="mt-4 flex gap-2">
                   <input readOnly value="https://blogger.pro/sim/jane-preston" className="flex-1 text-xs p-2 bg-white border border-orange-200 rounded-lg outline-none" />
                   <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold" onClick={() => alert('Link copied to simulation clipboard!')}>Copy</button>
                </div>
             </div>
             <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:scale-[1.02] transition-transform">Save Global Settings</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
