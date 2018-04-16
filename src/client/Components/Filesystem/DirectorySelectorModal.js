import PropTypes from "prop-types";
import React from "react";

import { Modal } from "antd";

import FilesystemBrowser from "./FilesystemBrowser";

const DirectorySelectorModal = props => {
    const {
        initialPath,
        onCancel,
        onChangeDirectory,
        onOk,
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
                        basePath={initialPath}
                        onChangeDirectory={onChangeDirectory}
                        showDirectories={true}
                        showFiles={false}
                    />
                </div>
            </Modal>
        </div>
    );
};

DirectorySelectorModal.propTypes = {
    initialPath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onChangeDirectory: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

DirectorySelectorModal.defaultProps = {
    title: "Select Directory",
    visible: false,
    onChangeDirectory: () => {},
    onCancel: () => {}
};

export default DirectorySelectorModal;
