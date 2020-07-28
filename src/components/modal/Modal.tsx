import "./_modal.scss";

import React from "react";
import ReactModal from "react-modal";
import classNames from "classnames";

import {MODAL_CLOSE_TIMEOUT} from "./util/modalConstants";

interface ModalProps {
  isOpen: boolean;
  modalContentLabel: string;
  onClose: (...args: any[]) => void;
  onAfterOpen?: (...args: any[]) => void;
  onAfterClose?: (...args: any[]) => void;
  canBeClosed?: boolean;
  closeTimeout?: number;
  shouldCloseOnOverlayClick?: boolean;
  customClassName?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  shouldCloseOnEsc?: boolean;
  bodyOpenClassName?: string;
  portalClassName?: string;
}

ReactModal.defaultStyles = {};
ReactModal.setAppElement("#root");

function getParent() {
  return document.querySelector("#modal-root") as HTMLElement;
}

function Modal({
  isOpen,
  customClassName,
  children,
  closeTimeout = MODAL_CLOSE_TIMEOUT,
  canBeClosed = true,
  modalContentLabel,
  onAfterClose,
  onAfterOpen,
  overlayClassName,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
  bodyOpenClassName,
  onClose,
  portalClassName
}: ModalProps) {
  const containerClassName = classNames("ReactModal__Content", customClassName);
  const bodyClassName = classNames("ReactModal__Body--open", bodyOpenClassName);

  return (
    <ReactModal
      parentSelector={getParent}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      contentLabel={modalContentLabel}
      className={containerClassName}
      portalClassName={portalClassName}
      onRequestClose={handleRequestClose}
      overlayClassName={overlayClassName}
      closeTimeoutMS={closeTimeout}
      bodyOpenClassName={bodyClassName}
      shouldCloseOnOverlayClick={canBeClosed && shouldCloseOnOverlayClick}
      shouldCloseOnEsc={canBeClosed && shouldCloseOnEsc}>
      {children}
    </ReactModal>
  );

  function handleRequestClose() {
    if (canBeClosed && onClose) {
      onClose();
    }
  }
}

export default Modal;
