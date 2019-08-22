import React from "react";
import Modal from "../../Modal";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ReportModal({isOpen, onClose}: ReportModalProps) {
  return (
    <Modal isOpen={isOpen} modalContentLabel={"Report Modal"} onClose={onClose}>
      <h1>{"Report Modal"}</h1>
    </Modal>
  );
}

export default ReportModal;
