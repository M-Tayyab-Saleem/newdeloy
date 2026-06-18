import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { downloadFile } from "../../utils/downloadFile";

const ViewTimeLogModal = ({ log, onClose }) => {
  const modalRef = useRef(null);

  if (!log) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };


  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] animate-fadeIn overflow-hidden"
      >
        {/* Close Cross */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full text-muted hover:bg-surface hover:text-red-500 transition-all text-2xl font-light z-10"
        >
          &times;
        </button>

        {/* Header */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-50 text-center flex-shrink-0">
          <h2 className="text-base sm:text-lg font-black text-heading tracking-widest uppercase">
            VIEW TIME LOG
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          {/* Job Title */}
          <div>
            <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-widest">
              JOB TITLE
            </label>
            <p className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm text-main font-medium">
              {log.jobTitle || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-widest">
                DATE
              </label>
              <p className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm text-main font-medium">
                {log.date ? new Date(log.date).toLocaleDateString('en-GB') : "-"}
              </p>
            </div>
            {/* Hours */}
            <div>
              <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-widest">
                HOURS
              </label>
              <p className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm text-main font-medium">
                {log.totalHours || "-"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-widest">
              DESCRIPTION
            </label>
            <div className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm text-main font-medium whitespace-pre-line min-h-[100px]">
              {log.description || "-"}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-widest">
              ATTACHMENT
            </label>
            {log.attachments?.[0] ? (
              <button
                onClick={() => downloadFile(log.attachments[0].blobName || log.attachments[0].url || log.attachments[0].path, log.attachments[0].originalname)}
                className="w-full flex items-center justify-between p-3 bg-surface rounded-xl border border-border-subtle hover:bg-amber-50 hover:border-amber-200 transition-all group text-left"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                    {log.attachments[0].originalname?.split('.').pop().toUpperCase() || "FILE"}
                  </div>
                  <span className="text-xs font-bold text-main truncate">
                    {log.attachments[0].originalname || "Attachment"}
                  </span>
                </div>
                <div className="text-muted group-hover:text-amber-600">
                  <Paperclip size={16} />
                </div>
              </button>
            ) : (
              <div className="p-4 bg-surface rounded-xl border border-dashed border-border-subtle text-center">
                <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
                  No attachment found
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-t border-border-subtle flex bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 sm:py-4 bg-[#64748b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:brightness-110 active:scale-95 transition-all"
          >
            CLOSE VIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTimeLogModal;