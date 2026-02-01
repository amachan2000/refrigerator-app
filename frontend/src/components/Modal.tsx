type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
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
      </div>
      <div className="modal-content">{content}</div>
    </div>
  );
};
