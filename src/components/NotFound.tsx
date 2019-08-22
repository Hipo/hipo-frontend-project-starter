import React, {FunctionComponent, useState} from "react";
import {RouteComponentProps} from "@reach/router";
import ReportModal from "./modal/components/report/ReportModal";

const NotFound: FunctionComponent<RouteComponentProps> = () => {
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
};

export default NotFound;
