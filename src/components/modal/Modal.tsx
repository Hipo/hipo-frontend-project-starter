import "./_modal.scss";

import React from "react";
import ReactModal from "react-modal";
import classNames from "classnames";

import {MODAL_CLOSE_TIMEOUT} from "./util/modalConstants";

interface ModalOwnProps {
  isOpen: boolean;
  modalContentLabel: string;
  onClose: (...args: any[]) => void;
  onAfterOpen?: (...args: any[]) => void;
  onAfterClose?: (...args: any[]) => void;
  canBeClosed?: boolean;
  closeTimeout?: number;
  shouldCloseOnOverlayClick?: boolean;
  customClassName?: string;
  children?: JSX.Element;
}

ReactModal.defaultStyles = {};
ReactModal.setAppElement("#root");

function Modal(props: ModalOwnProps) {
  const {
    isOpen,
    customClassName,
    children,
    closeTimeout = MODAL_CLOSE_TIMEOUT,
    canBeClosed = true,
    modalContentLabel,
    onAfterClose,
    onAfterOpen
  } = props;
  const containerClassName = classNames("ReactModal__Content", customClassName);

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      contentLabel={modalContentLabel}
      className={containerClassName}
      onRequestClose={handleRequestClose}
      closeTimeoutMS={closeTimeout}>
      {children}
    </ReactModal>
  );

  function handleRequestClose() {
    const {onClose} = props;

    if (canBeClosed && onClose) {
      onClose();
    }
  }
}

export default Modal;
