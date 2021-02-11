import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import DialogModal from "../shared/DialogModal";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import FilesystemBrowser from "./FilesystemBrowser";

class MoveRenameModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            destinationPath: "",
            isRenaming: false,
            itemsRenaming: {},
        };
    }

    componentDidUpdate(prevProps) {
        const { isVisible } = this.props;
        if (isVisible && isVisible !== prevProps.isVisible) {
            const { itemsToRename } = this.props;

            let itemsRenaming = {};
            itemsToRename.forEach((item) => {
                itemsRenaming[item] = item;
            });

            this.setState({
                itemsRenaming,
            });
        }
    }

    _handleClickRename() {
        this._performRename();
    }

    _performRename() {
        const { callAPI, initialPath } = this.props;
        const { destinationPath, itemsRenaming: itemsRenaming } = this.state;

        this.setState({
            isRenaming: true,
        });

        const params = {
            source_path: initialPath,
            dest_path: destinationPath,
            items_to_rename: itemsRenaming,
        };

        callAPI(
            "filesystem.rename.multiple",
            params,
            this._renameComplete.bind(this),
            false
        );
    }

    _renameComplete() {
        const { onRenameComplete } = this.props;

        this.setState({
            isRenaming: false,
        });

        onRenameComplete();
    }

    _handleChangeDirectory(newPath) {
        this.setState({
            destinationPath: newPath,
        });
    }

    _handleChangeFilename(originalFilename, evt) {
        const { itemsRenaming: itemsRenaming } = this.state;

        itemsRenaming[originalFilename] = evt.target.value;

        this.setState({
            itemsRenaming,
        });
    }

    _buildRenameInputs() {
        const { itemsToRename } = this.props;
        const { itemsRenaming: itemsRenaming } = this.state;

        let inputList = [];
        itemsToRename.forEach((item) => {
            const el = (
                <div key={item} className="ib-moverename-input-box">
                    <h5>
                        <u>Original:</u> {item}
                    </h5>
                    <TextField
                        onChange={this._handleChangeFilename.bind(this, item)}
                        value={itemsRenaming[item]}
                    />
                </div>
            );
            inputList.push(el);
        });

        return inputList;
    }

    render() {
        const {
            callAPI,
            initialPath,
            isVisible,
            onCancel,
            serverInfo,
        } = this.props;

        const posDim = {
            modalTop: 30,
            modalHeight: window.innerHeight - 180,
            modalWidth: window.innerWidth - 100,
            fileBrowserHeight: window.innerHeight - 450,
        };

        const inputBoxes = this._buildRenameInputs();

        return (
            <div>
                <DialogModal
                    title="Move or Rename"
                    isVisible={isVisible}
                    onClose={onCancel}
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
                            onClick={this._handleClickRename.bind(this)}
                            startIcon={<SaveIcon />}
                        >
                            Move or Rename
                        </Button>,
                    ]}
                >
                    <div
                        className="ib-moverename-dirsel-box"
                        style={{ height: posDim.fileBrowserHeight }}
                    >
                        <h4>Destination Directory</h4>
                        <FilesystemBrowser
                            callAPI={callAPI}
                            basePath={initialPath}
                            lockToBasePath={false}
                            onChangeDirectory={this._handleChangeDirectory.bind(
                                this
                            )}
                            serverInfo={serverInfo}
                            showDirectories={true}
                            showFiles={false}
                            enableCheckboxes={false}
                        />
                    </div>
                    <div className="ib-moverename-inputs-container">
                        <h4>Items to Rename</h4>
                        {inputBoxes}
                    </div>
                </DialogModal>
            </div>
        );
    }
}

MoveRenameModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    initialPath: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    itemsToRename: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRenameComplete: PropTypes.func.isRequired,
    serverInfo: PropTypes.object.isRequired,
};

export default MoveRenameModal;
