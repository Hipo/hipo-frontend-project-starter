import React, {useState} from "react";
import ReportModal from "../../../../components/modal/components/report/ReportModal";

function NotFoundPage() {
  const [isReportModalOpen, toggleReportModal] = useState(false);

  return (
    <>
      <p>{"404 Not Found"}</p>

      <button type={"button"} onClick={handleReportClick}>
        {"Report"}
      </button>

      <ReportModal isOpen={isReportModalOpen} onClose={handleReportModalClose} />
    </>
  );

  function handleReportClick() {
    toggleReportModal(!isReportModalOpen);
  }

  function handleReportModalClose() {
    toggleReportModal(!isReportModalOpen);
  }
}

export default NotFoundPage;
