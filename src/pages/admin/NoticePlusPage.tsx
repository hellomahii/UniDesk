import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Edit2,
  Send,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Notice, Department } from '../../types';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export const NoticePlusPage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();

  const {
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    setToastMessage,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'All' | 'Published' | 'Draft' | 'Scheduled'
  >('All');

  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<
    'Academic' | 'Maintenance' | 'Administration' | 'Finance' | 'Examinations'
  >('Academic');

  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const [audience, setAudience] = useState<
    'All Students' | 'Engineering' | 'Final Year' | 'Faculty' | 'Undergraduate'
  >('All Students');

  const [expiryDate, setExpiryDate] = useState('15 Nov 2026');

  const filteredNotices = notices.filter((notice) => {
    const matchesTab =
      activeTab === 'All' || notice.status === activeTab;

    const searchText = search.toLowerCase();

    const matchesSearch =
      notice.title.toLowerCase().includes(searchText) ||
      notice.description.toLowerCase().includes(searchText);

    return matchesTab && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setTitle('');
    setDescription('');
    setContent('');
    setAudience('All Students');
    setExpiryDate('15 Nov 2026');

    setCategory(
      activeRole === 'it_admin'
        ? 'Maintenance'
        : activeRole === 'finance_admin'
        ? 'Finance'
        : 'Academic'
    );

    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setContent(notice.content);
    setCategory(notice.category);
    setAudience(notice.audience);
    setExpiryDate(notice.expiryDate);
    setIsCreateModalOpen(true);
  };

  const handleSaveNotice = (
    status: 'Published' | 'Draft'
  ) => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    const department: Department =
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
        department,
        expiryDate,
        status,
        author: `${currentUser?.name || 'Administrator'} (${
          currentUser?.adminTitle || 'Office'
        })`,
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
          type="button"
          onClick={handleOpenCreate}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          {(['All', 'Published', 'Draft', 'Scheduled'] as const).map(
            (tab) => (
              <button
                type="button"
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
            )
          )}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />

          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
              {filteredNotices.map((notice) => (
                <tr
                  key={notice.id}
                  className="hover:bg-[#F9FAF9] transition-colors"
                >
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {notice.title}
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {notice.description}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    <span className="font-medium text-[11px]">
                      {notice.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    {notice.audience}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">
                    {notice.publishDate}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">
                    {notice.expiryDate}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        notice.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {notice.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(notice)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit notice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setNoticeToDelete(notice)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
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
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No notices match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Notice Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={
            editingNotice
              ? 'Edit University Notice'
              : 'Create New Notice'
          }
          subtitle="Publish an announcement across student dashboards and academic portals."
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Notice Title
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Campus Wi-Fi Maintenance & Core Switch Upgrade"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Category and Audience */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as typeof category)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Academic">Academic</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Administration">
                    Administration
                  </option>
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
                  onChange={(event) =>
                    setAudience(event.target.value as typeof audience)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="All Students">
                    All Students
                  </option>
                  <option value="Engineering">
                    Engineering Faculty & Students
                  </option>
                  <option value="Undergraduate">
                    Undergraduate Only
                  </option>
                  <option value="Final Year">
                    Final Year Students
                  </option>
                  <option value="Faculty">
                    Faculty & Staff
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Summary Description
              </label>

              <input
                type="text"
                required
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Brief one-line overview shown on dashboard cards"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Notice Body / Circular Text
              </label>

              <textarea
                rows={4}
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Detailed instructions, operational schedules, or advisory notes..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>

              <input
                type="text"
                value={expiryDate}
                onChange={(event) =>
                  setExpiryDate(event.target.value)
                }
                placeholder="e.g. 15 Nov 2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Actions */}
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

      {/* Delete Notice Confirmation */}
      {noticeToDelete && (
        <DeleteConfirmModal
          isOpen={!!noticeToDelete}
          onClose={() => setNoticeToDelete(null)}
          onConfirm={() => {
            if (noticeToDelete) {
              deleteNotice(noticeToDelete.id);
              setNoticeToDelete(null);
              setToastMessage('Record deleted successfully.');
            }
          }}
          title="Delete Notice?"
          recordName={`the notice "${noticeToDelete.title}"`}
          recordType="university announcement"
        />
      )}
    </div>
  );
};