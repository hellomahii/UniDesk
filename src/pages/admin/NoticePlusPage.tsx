import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Send,
  FileText,
  Archive,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Notice, Department } from '../../types';
import { Modal } from '../../components/common/Modal';

export const NoticePlusPage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const { notices, addNotice, updateNotice, deleteNotice } = useData();

  const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft' | 'Scheduled'>('All');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Maintenance' | 'Administration' | 'Finance' | 'Examinations'>('Academic');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'All Students' | 'Engineering' | 'Final Year' | 'Faculty' | 'Undergraduate'>('All Students');
  const [expiryDate, setExpiryDate] = useState('15 Nov 2026');

  const filteredNotices = notices.filter((n) => {
    const matchesTab = activeTab === 'All' || n.status === activeTab;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setTitle('');
    setDescription('');
    setContent('');
    setCategory(
      activeRole === 'it_admin'
        ? 'Maintenance'
        : activeRole === 'finance_admin'
        ? 'Finance'
        : 'Academic'
    );
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (n: Notice) => {
    setEditingNotice(n);
    setTitle(n.title);
    setDescription(n.description);
    setContent(n.content);
    setCategory(n.category);
    setAudience(n.audience);
    setExpiryDate(n.expiryDate);
    setIsCreateModalOpen(true);
  };

  const handleSaveNotice = (status: 'Published' | 'Draft') => {
    if (!title.trim() || !description.trim()) return;

    const dept: Department =
      activeRole === 'it_admin'
        ? 'IT'
        : activeRole === 'finance_admin'
        ? 'Finance'
        : 'Academic';

    if (editingNotice) {
      updateNotice(editingNotice.id, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim() || description.trim(),
        category,
        audience,
        expiryDate,
        status,
      });
    } else {
      addNotice({
        title: title.trim(),
        description: description.trim(),
        content: content.trim() || description.trim(),
        category,
        audience,
        department: dept,
        expiryDate,
        status,
        author: `${currentUser?.name || 'Administrator'} (${currentUser?.adminTitle || 'Office'})`,
      });
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0D5C46]" />
            <span>Notice+</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create and manage university notices.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          {(['All', 'Published', 'Draft', 'Scheduled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-[#0D5C46] shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab} Notices
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>
      </div>

      {/* Notice Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Title & Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Audience</th>
                <th className="px-5 py-3.5">Published Date</th>
                <th className="px-5 py-3.5">Expiry Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.map((n) => (
                <tr key={n.id} className="hover:bg-[#F9FAF9] transition-colors">
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-semibold text-slate-900 line-clamp-1">{n.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.description}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    <span className="font-medium text-[11px]">{n.category}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">{n.audience}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">{n.publishDate}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">{n.expiryDate}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        n.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit notice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNotices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No notices match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 53. CREATE / EDIT NOTICE MODAL */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={editingNotice ? 'Edit University Notice' : 'Create New Notice'}
          subtitle="Publish an announcement across student dashboards and academic portals."
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Notice Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus Wi-Fi Maintenance & Core Switch Upgrade"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Academic">Academic</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Administration">Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Examinations">Examinations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="All Students">All Students</option>
                  <option value="Engineering">Engineering Faculty & Students</option>
                  <option value="Undergraduate">Undergraduate Only</option>
                  <option value="Final Year">Final Year Students</option>
                  <option value="Faculty">Faculty & Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Summary Description
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief one-line overview shown on dashboard cards"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Notice Body / Circular Text
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed instructions, operational schedules, or advisory notes..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="e.g. 15 Nov 2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Actions: Save Draft, Publish Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotice('Draft')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotice('Published')}
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
