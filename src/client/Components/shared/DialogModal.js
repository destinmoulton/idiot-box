import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
const DialogModal = (props) => {
    const { children, title, isVisible, onClose, footer } = props;
    return (
        <Modal open={isVisible} onClose={onClose}>
            <div className="ib-dialogmodal-title">
                {title}
                <Button startIcon={<CloseIcon />} onClick={onClose} />
            </div>
            {children}
            <div className="ib-dialogmodal-footer">{footer}</div>
        </Modal>
    );
};
export default DialogModal;
