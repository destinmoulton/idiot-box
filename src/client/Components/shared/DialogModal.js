import React, { Component } from "react";

import { Grid, Modal, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const DialogModal = ({
    children,
    title,
    isVisible,
    onClose,
    footer,
    minWidth = 200,
    width = 400,
    minHeight = 200,
}) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // This is essential for mobile modals
    const maxContentHeight = window.innerHeight - 175;
    const mobileModalStyle = {
        maxHeight: maxContentHeight + "px",
        overflow: "auto",
    };

    let modalWidth = width;
    if (windowWidth < width) {
        modalWidth = windowWidth - 20;
    }

    const calculatedLeft = Math.round((window.innerWidth - modalWidth) / 2);
    const style = {
        minWidth: minWidth + "px",
        width: modalWidth + "px",
        left: calculatedLeft + "px",
        minHeight: minHeight + "px",
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
                    <div style={mobileModalStyle}>{children}</div>
                    <div className="ib-dialogmodal-footer">{footer}</div>
                </Grid>
            </Grid>
        </Modal>
    );
};
export default DialogModal;
