import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

const DialogModal = (props) => {
    const { children, title, isVisible, onClose, footer } = props;
    return (
        <Modal open={isVisible} onClose={onClose}>
            <Grid container>
                <Grid item xs={12}>
                    <div className="ib-dialogmodal-title">
                        {title}
                        <Button startIcon={<CloseIcon />} onClick={onClose} />
                    </div>
                    {children}
                    <div className="ib-dialogmodal-footer">{footer}</div>
                </Grid>
            </Grid>
        </Modal>
    );
};
export default DialogModal;
