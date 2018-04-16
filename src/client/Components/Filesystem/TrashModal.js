import PropTypes from "prop-types";
import React, { Component } from "react";

import { Button, Modal } from "antd";

class TrashModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTrashing: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isTrashing: false
        });
    }

    _handlePressOk() {
        this._trashFiles();
    }

    _trashFiles() {
        const { currentPath, callAPI, itemsToTrash } = this.props;

        const options = {
            source_path: currentPath,
            filenames: itemsToTrash
        };

        callAPI(
            "filesystem.trash.execute",
            options,
            this._trashComplete.bind(this),
            false
        );

        this.setState({
            isTrashing: true
        });
    }

    _trashComplete(recd) {
        const { onTrashComplete } = this.props;

        this.setState({
            isTrashing: false
        });

        onTrashComplete();
    }

    render() {
        const { currentPath, isVisible, itemsToTrash, onCancel } = this.props;

        const { isTrashing } = this.state;

        let list = [];
        itemsToTrash.forEach(item => {
            list.push(<li key={item}>{item}</li>);
        });

        return (
            <div>
                <Modal
                    title="Trash Confirmation"
                    visible={isVisible}
                    onCancel={onCancel}
                    onOk={this._handlePressOk.bind(this)}
                    footer={[
                        <Button key="cancel" size="large" onClick={onCancel}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            size="large"
                            loading={isTrashing}
                            onClick={this._handlePressOk.bind(this)}
                        >
                            Confirm Delete
                        </Button>
                    ]}
                >
                    <div className="ib-trashmodal-list-box">
                        <h4>{currentPath}</h4>
                        <ul className="ib-trashmodal-list">{list}</ul>
                    </div>
                </Modal>
            </div>
        );
    }
}

TrashModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentPath: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    itemsToTrash: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onTrashComplete: PropTypes.func.isRequired
};

export default TrashModal;
