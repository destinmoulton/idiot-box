import PropTypes from "prop-types";
import React from "react";

import Button from "@material-ui/core/Button";
import DialogModal from "../shared/DialogModal";
import SaveIcon from "@material-ui/icons/Save";

import FilesystemBrowser from "../Filesystem/FilesystemBrowser";

const DirectorySelectorModal = (props) => {
    const {
        callAPI,
        initialPath,
        onCancel,
        onChangeDirectory,
        onOk,
        serverInfo,
        title,
        visible,
    } = props;

    const posDim = {
        modalTop: 30,
        modalHeight: window.innerHeight - 180,
        fileBrowserHeight: window.innerHeight - 200,
    };

    return (
        <div>
            <DialogModal
                title={title}
                isVisible={visible}
                onCancel={onCancel}
                footer={[
                    <Button
                        variant="contained"
                        key="cancel"
                        size="small"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>,
                    <Button
                        variant="contained"
                        key="submit"
                        color="primary"
                        size="small"
                        onClick={onOk}
                        startIcon={<SaveIcon />}
                    >
                        Ok
                    </Button>,
                ]}
            >
                <div
                    className="ib-settings-dirsel-fs-cont"
                    style={{ height: posDim.fileBrowserHeight }}
                >
                    <FilesystemBrowser
                        callAPI={callAPI}
                        basePath={initialPath}
                        onChangeDirectory={onChangeDirectory}
                        serverInfo={serverInfo}
                        showDirectories={true}
                        showFiles={false}
                    />
                </div>
            </DialogModal>
        </div>
    );
};

DirectorySelectorModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    initialPath: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onChangeDirectory: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    serverInfo: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
};

DirectorySelectorModal.defaultProps = {
    title: "Select Directory",
    visible: false,
    onChangeDirectory: () => {},
    onCancel: () => {},
};

export default DirectorySelectorModal;
