import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelOffIcon from "@material-ui/icons/LabelOff";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import VideocamIcon from "@material-ui/icons/Videocam";

import FileBrowser from "./Filesystem/FileBrowser";
import IDFileModal from "./ID/IDFileModal";
import IDMultipleEpisodesModal from "./ID/IDMultipleEpisodesModal";
import MoveRenameModal from "./Filesystem/MoveRenameModal";
import TrashModal from "./Filesystem/TrashModal";
import UntagModal from "./ID/UntagModal";

import Regex from "../lib/Regex.lib";
class FileManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentToplevelDirectory: "",
            currentPath: "",
            currentPathInfo: {},
            dirList: [],
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: [],
            idsingleFilename: "",
            idsingleIsModalVisible: false,
            isReloading: false,
            moverenameIsModalVisible: false,
            moverenameSelectedItems: [],
            trashIsModalVisible: false,
            trashSelectedItems: [],
            selectedRows: new Set(),
            untagIsModalVisible: false,
            untagIDinfo: [],
        };
    }

    componentDidMount() {
        this._parseURL();
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps, this.props)) {
            this._parseURL();
        }
    }

    _parseURL() {
        const { settings, match } = this.props;
        const settingDirectories = settings.directories;

        let settingKey = match.params.setting_key;

        const newSubpath = match.params.subpath;

        let subpath = "";
        if (newSubpath !== undefined) {
            subpath = decodeURIComponent(newSubpath);
        }

        let dir = {};
        if (settingKey === undefined) {
            dir = settingDirectories[0];
        } else {
            dir = settingDirectories.find((dir) => dir.key === settingKey);
        }

        const pathInfo = {
            setting_id: dir.id,
            setting_key: dir.key,
            subpath,
        };
        this.setState({
            currentPath: dir.value + "/" + subpath,
            currentPathInfo: pathInfo,
            currentToplevelDirectory: dir.value,
            selectedRows: new Set(),
            isReloading: false,
        });
    }

    _handleChangeDirectory(newDir, dirList) {
        const { currentPathInfo, currentToplevelDirectory } = this.state;
        const subpath = newDir.slice(currentToplevelDirectory.length + 1);

        this.setState({
            dirList,
            isReloading: false,
        });

        if (currentPathInfo.subpath !== subpath) {
            const newSubpath = subpath.startsWith("/")
                ? subpath.slice(1)
                : subpath;

            // The subpath has changed so go there
            const location = {
                pathname:
                    "/filemanager/" +
                    currentPathInfo.setting_key +
                    "/" +
                    encodeURIComponent(newSubpath),
            };
            this.props.history.push(location);
        }
    }

    _reloadDirList() {
        this.setState({
            isReloading: true,
        });
    }

    /**
     * Handle checking/unchecking single items
     *
     * @param {object} item
     */
    _handleSelectionChangeSingle(item) {
        const { selectedRows } = this.state;

        if (selectedRows.has(item)) {
            selectedRows.delete(item);
        } else {
            selectedRows.add(item);
        }

        this.setState({
            selectedRows,
        });
    }
    /**
     * Handle checking/unchecking multiple items
     *
     * @param {object} item
     */
    _handleSelectionChangeMultiple(selectedItemsSet) {
        this.setState({
            selectedRows: selectedItemsSet,
        });
    }

    _handleClickTrash(evt) {
        let trashSelectedItems = [];
        if (evt.currentTarget.tagName === "BUTTON") {
            trashSelectedItems = [...this.state.selectedRows];
        } else {
            const item = evt.currentTarget.getAttribute("data-item-name");
            trashSelectedItems = [item];
        }

        this.setState({
            trashIsModalVisible: true,
            trashSelectedItems,
        });
    }

    _handleTrashComplete() {
        this.setState({
            isReloading: true,
            trashIsModalVisible: false,
            trashSelectedItems: [],
            selectedRows: new Set(),
        });
    }

    _handleCancelTrash() {
        this.setState({
            trashIsModalVisible: false,
            trashSelectedItems: [],
        });
    }

    _handleClickMoveRename(evt) {
        let moverenameSelectedItems = [];
        if (evt.currentTarget.tagName === "BUTTON") {
            moverenameSelectedItems = [...this.state.selectedRows];
        } else {
            const item = evt.currentTarget.getAttribute("data-item-name");
            moverenameSelectedItems = [item];
        }

        this.setState({
            moverenameIsModalVisible: true,
            moverenameSelectedItems,
        });
    }

    _handleMoveRenameCancel() {
        this.setState({
            moverenameIsModalVisible: false,
            moverenameSelectedItems: [],
        });
    }

    _handleMoveRenameComplete() {
        this.setState({
            isReloading: true,
            moverenameIsModalVisible: false,
            moverenameSelectedItems: [],
            selectedRows: new Set(),
        });
    }

    _handleClickIDFile(filename) {
        this.setState({
            idsingleFilename: filename,
            idsingleIsModalVisible: true,
        });
    }

    _handleIDModalCancel() {
        this.setState({
            idsingleIsModalVisible: false,
            idsingleFilename: "",
        });
    }

    _handleIDModalComplete() {
        this.setState({
            isReloading: true,
            idsingleIsModalVisible: false,
            idsingleFilename: "",
        });
    }

    _handleClickIDMultipleEpisodes() {
        const { dirList } = this.state;

        const filenamesToID = [...this.state.selectedRows];

        const idItems = [];
        filenamesToID.forEach((filename) => {
            dirList.forEach((item) => {
                if (item.name === filename && Regex.isVideoFile(item.name)) {
                    idItems.push(item);
                }
            });
        });

        if (idItems.length > 0) {
            this.setState({
                idmultipleIsModalVisible: true,
                idmultipleEpisodes: idItems,
            });
        }
    }

    _handleIDMultipleCancel() {
        this.setState({
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: [],
        });
    }

    _handleIDMultipleComplete() {
        this.setState({
            isReloading: true,
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: [],
            selectedRows: new Set(),
        });
    }

    _handleSelectVideos() {
        const { dirList } = this.state;

        let selected = new Set();
        dirList.forEach((item) => {
            if (Regex.isVideoFile(item.name)) {
                selected.add(item.name);
            }
        });

        this.setState({
            selectedRows: selected,
        });
    }

    _handleClickUntag(evt) {
        const { dirList } = this.state;

        let filenamesToUntag = [];
        if (evt.currentTarget.tagName === "BUTTON") {
            filenamesToUntag = [...this.state.selectedRows];
        } else {
            const item = evt.currentTarget.getAttribute("data-item-name");
            filenamesToUntag = [item];
        }

        const untagItems = [];
        filenamesToUntag.forEach((filename) => {
            dirList.forEach((item) => {
                if (
                    item.name === filename &&
                    item.assocData.hasOwnProperty("type")
                ) {
                    untagItems.push(item);
                }
            });
        });

        if (untagItems.length > 0) {
            this.setState({
                untagIsModalVisible: true,
                untagIDinfo: untagItems,
            });
        }
    }

    _handleUntagModalComplete() {
        this.setState({
            isReloading: true,
            untagIsModalVisible: false,
            untagIDinfo: [],
        });
    }

    _handleUntagCancel() {
        this.setState({
            untagIsModalVisible: false,
            untagIDinfo: [],
        });
    }

    _buildActionColumns() {
        return [
            {
                title: "",
                dataIndex: "",
                render: (text, record) => {
                    const { assocData } = record;

                    let tagAction = "";
                    if (Regex.isVideoFile(record.name)) {
                        if (!("type" in assocData)) {
                            tagAction = (
                                <a
                                    href="javascript:void(0);"
                                    onClick={this._handleClickIDFile.bind(
                                        this,
                                        record.name
                                    )}
                                >
                                    <Icon type="tag" />
                                </a>
                            );
                        }
                    }

                    let untagAction = "";
                    if ("type" in assocData) {
                        untagAction = (
                            <a
                                href="javascript:void(0);"
                                onClick={this._handleClickUntag.bind(this)}
                                data-item-name={record.name}
                            >
                                <Icon
                                    type="disconnect"
                                    className="ib-filebrowser-media-play"
                                />
                            </a>
                        );
                    }

                    return (
                        <span>
                            <a
                                href="javascript:void(0);"
                                onClick={this._handleClickTrash.bind(this)}
                                data-item-name={record.name}
                            >
                                <Icon type="delete" />
                            </a>
                            &nbsp;{tagAction}
                            {untagAction}
                        </span>
                    );
                },
            },
        ];
    }

    _buildFileManager() {
        const {
            currentPath,
            currentPathInfo,
            currentToplevelDirectory,
            idmultipleIsModalVisible,
            idmultipleEpisodes,
            idsingleFilename,
            idsingleIsModalVisible,
            isReloading,
            moverenameIsModalVisible,
            moverenameSelectedItems,
            trashIsModalVisible,
            trashSelectedItems,
            selectedRows,
            untagIDinfo,
            untagIsModalVisible,
        } = this.state;

        const hasSelected = selectedRows.size > 0 ? true : false;
        const buttonDisabled = !hasSelected;

        return (
            <div>
                <div className="ib-filemanager-button-bar">
                    <ButtonGroup>
                        <Button
                            type="primary"
                            startIcon={<VideocamIcon />}
                            size="small"
                            onClick={this._handleSelectVideos.bind(this)}
                        >
                            Select Videos
                        </Button>
                    </ButtonGroup>
                    &nbsp;
                    <ButtonGroup>
                        <Button
                            startIcon={<LocalOfferIcon />}
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickIDMultipleEpisodes.bind(
                                this
                            )}
                        >
                            ID
                        </Button>
                        <Button
                            startIcon={<LabelOffIcon />}
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickUntag.bind(this)}
                        >
                            Remove ID
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            startIcon={<TextRotationNoneIcon />}
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickMoveRename.bind(this)}
                        >
                            Move or Rename
                        </Button>
                        <Button
                            startIcon={<DeleteIcon />}
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickTrash.bind(this)}
                        >
                            Trash
                        </Button>
                    </ButtonGroup>
                </div>
                <FileBrowser
                    basePath={currentToplevelDirectory}
                    callAPI={this.props.callAPI}
                    currentPath={currentPath}
                    enableCheckboxes={true}
                    enableSize={true}
                    forceReload={isReloading}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    handleSelectChangeSingle={this._handleSelectionChangeSingle.bind(
                        this
                    )}
                    handleSelectChangeMultiple={this._handleSelectionChangeMultiple.bind(
                        this
                    )}
                    selectedRows={selectedRows}
                    serverInfo={this.props.serverInfo}
                    showDirectories={true}
                    showFiles={true}
                />
                <TrashModal
                    callAPI={this.props.callAPI}
                    currentPath={currentPath}
                    isVisible={trashIsModalVisible}
                    itemsToTrash={trashSelectedItems}
                    onTrashComplete={this._handleTrashComplete.bind(this)}
                    onCancel={this._handleCancelTrash.bind(this)}
                />
                <MoveRenameModal
                    callAPI={this.props.callAPI}
                    initialPath={currentPath}
                    isVisible={moverenameIsModalVisible}
                    itemsToRename={moverenameSelectedItems}
                    onRenameComplete={this._handleMoveRenameComplete.bind(this)}
                    onCancel={this._handleMoveRenameCancel.bind(this)}
                    serverInfo={this.props.serverInfo}
                />
                <IDFileModal
                    callAPI={this.props.callAPI}
                    currentFilename={idsingleFilename}
                    currentPathInfo={currentPathInfo}
                    currentToplevelDirectory={currentToplevelDirectory}
                    isVisible={idsingleIsModalVisible}
                    key={idsingleFilename}
                    onCancel={this._handleIDModalCancel.bind(this)}
                    onIDComplete={this._handleIDModalComplete.bind(this)}
                />
                <IDMultipleEpisodesModal
                    callAPI={this.props.callAPI}
                    currentPathInfo={currentPathInfo}
                    episodesToID={idmultipleEpisodes}
                    isVisible={idmultipleIsModalVisible}
                    onCancel={this._handleIDMultipleCancel.bind(this)}
                    onIDComplete={this._handleIDMultipleComplete.bind(this)}
                />
                <UntagModal
                    callAPI={this.props.callAPI}
                    isVisible={untagIsModalVisible}
                    onUntagComplete={this._handleUntagModalComplete.bind(this)}
                    onCancel={this._handleUntagCancel.bind(this)}
                    itemsToUntag={untagIDinfo}
                />
            </div>
        );
    }

    _handleClickTab(directory) {
        const { history } = this.props;
        //const { currentToplevelDirectory } = this.state;
        history.push("/filemanager/" + directory);
    }
    _buildDirectoryMenu() {
        const settingDirectories = this.props.settings.directories;
        const { currentToplevelDirectory } = this.state;

        const menuList = [];
        settingDirectories.forEach((dir) => {
            const activeClass =
                dir.value === currentToplevelDirectory
                    ? "ib-filemanager-button ib-filemanager-button-active"
                    : "ib-filemanager-button";
            menuList.push(
                <Tab
                    label={dir.key}
                    key={dir.value}
                    value={dir.value}
                    onClick={() => this._handleClickTab(dir.key)}
                />
            );
        });

        return (
            <div id="ib-filemanager-directorymenu">
                <Tabs value={currentToplevelDirectory} size="small">
                    {menuList}
                </Tabs>
            </div>
        );
    }

    render() {
        const { currentToplevelDirectory } = this.state;

        let directoryMenu = "";
        let output = "";
        if (currentToplevelDirectory) {
            directoryMenu = this._buildDirectoryMenu();
            output = this._buildFileManager();
        }
        return (
            <div>
                <div>{directoryMenu}</div>
                {output}
            </div>
        );
    }
}

FileManager.propTypes = {
    callAPI: PropTypes.func.isRequired,
    serverInfo: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
};

export default FileManager;
