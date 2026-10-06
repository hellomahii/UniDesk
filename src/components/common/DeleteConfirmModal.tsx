import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Modal } from './Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  recordName: string;
  recordType?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Record?',
  recordName,
  recordType = 'record',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="This action cannot be undone."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 text-rose-950 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-rose-950">Confirm Deletion</h4>
            <p className="mt-1 text-xs text-rose-800 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="font-semibold text-rose-950">{recordName}</strong>?
            </p>
            <p className="mt-1 text-[11px] text-rose-700/90">
              This will permanently remove this {recordType} from the database.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
