import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function TechnicianDetailsModal({
  closeModal,
  isModalOpen,
  modalContent,
  modalTitle,
  modalWidth,
}) {
  return (
    <div>
      <Dialog
        open={isModalOpen}
        maxWidth={modalWidth}
        onClose={() => closeModal}
        sx={{ zoom: "100%" }}
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
      </Dialog>
    </div>
  );
}
