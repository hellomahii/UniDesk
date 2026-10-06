import React, { useState } from 'react';
import { Bell, Search, Filter, Calendar, Tag, ChevronRight, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Notice } from '../../types';
import { Modal } from '../../components/common/Modal';

export const StudentNoticesPage: React.FC = () => {
  const { notices } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const publishedNotices = notices.filter((n) => n.status === 'Published');

  const filteredNotices = publishedNotices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#0D5C46]" />
          <span>University Notices & Circulars</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Official administrative advisories, examination memos, and maintenance bulletins.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars and announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Academic', 'Maintenance', 'Finance', 'Examinations'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0D5C46] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setActiveNotice(notice)}
            className="glass-panel rounded-2xl p-5 border border-[#E2ECE7] bg-white hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                  {notice.category} · {notice.department}
                </span>
                <span className="font-mono text-[11px]">{notice.publishDate}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0D5C46] transition-colors line-clamp-2">
                {notice.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {notice.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate">By {notice.author}</span>
              <span className="font-medium text-[#0D5C46] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Read Full</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {activeNotice && (
        <Modal
          isOpen={!!activeNotice}
          onClose={() => setActiveNotice(null)}
          title={activeNotice.title}
          subtitle={`Published on ${activeNotice.publishDate} by ${activeNotice.author}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                {activeNotice.category}
              </span>
              <span>·</span>
              <span>Audience: {activeNotice.audience}</span>
              <span>·</span>
              <span>Valid through: {activeNotice.expiryDate}</span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-medium">
              <p className="font-semibold text-slate-900">{activeNotice.description}</p>
              <p className="whitespace-pre-line text-slate-600">{activeNotice.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveNotice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
