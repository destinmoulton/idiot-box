import PropTypes from "prop-types";
import React from "react";

import { Modal } from "antd";

import FilesystemBrowser from "../Filesystem/FilesystemBrowser";

const DirectorySelectorModal = props => {
    const {
        callAPI,
        initialPath,
        onCancel,
        onChangeDirectory,
        onOk,
        serverInfo,
        title,
        visible
    } = props;

    const posDim = {
        modalTop: 30,
        modalHeight: window.innerHeight - 180,
        fileBrowserHeight: window.innerHeight - 200
    };

    return (
        <div>
            <Modal
                title={title}
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
                okText="Choose This Directory"
                cancelText="Cancel"
                style={{ top: posDim.modalTop, height: posDim.modalHeight }}
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
            </Modal>
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
    visible: PropTypes.bool
};

DirectorySelectorModal.defaultProps = {
    title: "Select Directory",
    visible: false,
    onChangeDirectory: () => {},
    onCancel: () => {}
};

export default DirectorySelectorModal;
