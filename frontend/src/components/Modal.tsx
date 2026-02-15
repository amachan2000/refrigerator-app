import { useEffect } from "react";
import "../styles/Modal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-content">{content}</div>
      </div>
    </div>
  );
};
