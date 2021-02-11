import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

const DialogModal = ({
    children,
    title,
    isVisible,
    onClose,
    footer,
    minWidth = 200,
    width = 200,
}) => {
    const calculatedLeft = Math.round((window.innerWidth - width) / 2);
    const style = {
        minWidth: minWidth + "px",
        width: width + "px",
        left: calculatedLeft + "px",
    };
    return (
        <Modal open={isVisible} onClose={onClose} className="ib-dialogmodal">
            <Grid
                container
                className="ib-dialogmodal-inner-wrapper"
                style={style}
            >
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
