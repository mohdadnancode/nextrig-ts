import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/* ------------------ Props ------------------ */

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

/* ------------------ Component ------------------ */

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  /* ------------------ ESC + ENTER support ------------------ */
  useEffect(() => {
    if (!open) return;

    confirmBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel, onConfirm]);

  /* ------------------ Click outside close ------------------ */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-95 rounded-xl bg-[#0b0b0b] border border-[#76b900]/30 p-6 shadow-2xl
                   animate-scaleIn"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center">{title}</h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-400 text-center">{message}</p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition"
          >
            {cancelText}
          </button>

          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              danger
                ? "bg-red-500/90 hover:bg-red-600 text-white"
                : "bg-[#76b900] hover:bg-[#6aa800] text-black"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
