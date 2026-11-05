import { useEffect, useRef } from "react";
import Button from "./Button.jsx";

// The browser's <dialog> handles focus trapping and the backdrop for us.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  // showModal() and close() are DOM methods, so an effect syncs them to `open`.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        // Escape key: let React state close the dialog, so the two stay in sync.
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{message}</p>

      <div className="confirm-dialog-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
