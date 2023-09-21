import PropTypes from "prop-types";
import React, {Component} from "react";

import {Box, Button, Tabs, Tab, CustomTabPanel} from "@mui/material";

import DialogModal from "../shared/DialogModal";
import TabPanel from "../shared/TabPanel";
import SaveIcon from "@mui/icons-material/Save";
import FileBrowser from "./FileBrowser";
import RecentDirectories from "./RecentDirectories";

class MoveRenameModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 0,
            destinationPath: "",
            isRenaming: false,
            itemsRenaming: {},
        };
    }

    componentDidUpdate(prevProps) {
        const {isVisible} = this.props;
        if (isVisible && isVisible !== prevProps.isVisible) {
            const {itemsToRename} = this.props;

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
        const {callAPI, initialPath} = this.props;
        const {destinationPath, itemsRenaming: itemsRenaming} = this.state;

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
        const {onRenameComplete} = this.props;

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
        const {itemsRenaming: itemsRenaming} = this.state;

        itemsRenaming[originalFilename] = evt.target.value;

        this.setState({
            itemsRenaming,
        });
    }

    _handleChangeTab(evt, newValue) {
        this.setState({
            selectedTab: newValue
        });
    }

    _buildRenameInputs() {
        const {itemsToRename} = this.props;
        const {itemsRenaming: itemsRenaming} = this.state;

        let inputList = [];
        itemsToRename.forEach((item) => {
            const el = (
                <div key={item} className="ib-moverename-input-box">
                    <div>
                        <u>Original:</u> {item}
                    </div>
                    <input
                        onChange={this._handleChangeFilename.bind(this, item)}
                        value={itemsRenaming[item]}
                    />
                </div>
            );
            inputList.push(el);
        });

        return inputList;
    }


    a11yProps(index) {
        return {
            id: `moverenamemodal-tab-${index}`,
            'aria-controls': `moverenamemodal-tabpanel-${index}`,
        };
    }

    render() {
        const {
            callAPI,
            initialPath,
            isVisible,
            onCancel,
            serverInfo,
        } = this.props;

        const {
            selectedTab,
            destinationPath
        } = this.state;

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
                    width={600}
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
                            startIcon={<SaveIcon/>}
                        >
                            Move or Rename
                        </Button>,
                    ]}
                >
                    <div
                        className="ib-moverename-dirsel-box"
                        style={{height: posDim.fileBrowserHeight}}
                    >

                        <Box>
                            <Tabs value={selectedTab}
                                  onChange={this._handleChangeTab.bind(this)}
                                  aria-label="Rename Tabs"
                                  size="small">
                                <Tab label="Browser"
                                     value={0}
                                     key={0}
                                     {...this.a11yProps(0)}/>
                                <Tab label="Recent"
                                     value={1}
                                     key={1}
                                     {...this.a11yProps(1)}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={selectedTab} index={0}>
                            <div>
                                <h4>Destination Directory</h4>
                                <FileBrowser
                                    basePath={initialPath}
                                    callAPI={callAPI}
                                    enableCheckboxes={false}
                                    enableSize={false}
                                    lockToBasePath={false}
                                    onChangeDirectory={this._handleChangeDirectory.bind(
                                        this
                                    )}
                                    serverInfo={serverInfo}
                                    showDirectories={true}
                                    showFiles={false}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel value={selectedTab} index={1}>
                            <div>
                                <h4>Recent Directories</h4>
                                <RecentDirectories callAPI={callAPI}
                                                   onChangeDirectory={this._handleChangeDirectory.bind(this)}/>
                            </div>
                        </TabPanel>
                    </div>
                    <div className="ib-moverename-inputs-container">
                        <h4>Items to Move or Rename</h4>
                        <label for="moverename-destination">Destination:</label>
                        <input name="moverename-destination"
                               style={{width: "400px"}}
                               disabled={true}
                               value={destinationPath}/>
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
