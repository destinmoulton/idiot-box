import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Icon, Button, Menu, Modal } from "antd";

import FilesystemBrowser from "./Filesystem/FilesystemBrowser";
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
            selectedRows: [],
            untagIsModalVisible: false,
            untagIDinfo: []
        };
    }

    componentWillMount() {
        this._parseURL(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._parseURL(nextProps);
    }

    _parseURL(props) {
        const { toplevelDirectories } = this.props;

        const settingKey = props.match.params.setting_key;

        if (settingKey === undefined) {
            this.setState({
                currentPath: "",
                currentPathInfo: {},
                currentToplevelDirecory: "",
                selectedRows: [],
                isReloading: false
            });
            return;
        }

        const newSubpath = props.match.params.subpath;

        let subpath = "";
        if (newSubpath !== undefined) {
            subpath = decodeURIComponent(newSubpath);
        }

        const dir = toplevelDirectories.find(dir => dir.key === settingKey);

        const pathInfo = {
            setting_id: dir.id,
            setting_key: settingKey,
            subpath
        };
        this.setState({
            currentPath: dir.value + "/" + subpath,
            currentPathInfo: pathInfo,
            currentToplevelDirectory: dir.value,
            selectedRows: [],
            isReloading: false
        });
    }

    _handleChangeDirectory(newDir, dirList) {
        const { currentPathInfo, currentToplevelDirectory } = this.state;
        const subpath = newDir.slice(currentToplevelDirectory.length + 1);

        this.setState({
            dirList,
            isReloading: false
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
                    encodeURIComponent(newSubpath)
            };
            this.props.history.push(location);
        }
    }

    _reloadDirList() {
        this.setState({
            isReloading: true
        });
    }

    _handleSelectionChange(selectedRows) {
        this.setState({
            selectedRows
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
            trashSelectedItems
        });
    }

    _handleTrashComplete() {
        this.setState({
            isReloading: true,
            trashIsModalVisible: false,
            trashSelectedItems: [],
            selectedRows: []
        });
    }

    _handleCancelTrash() {
        this.setState({
            trashIsModalVisible: false,
            trashSelectedItems: []
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
            moverenameSelectedItems
        });
    }

    _handleMoveRenameCancel() {
        this.setState({
            moverenameIsModalVisible: false,
            moverenameSelectedItems: []
        });
    }

    _handleMoveRenameComplete() {
        this.setState({
            isReloading: true,
            moverenameIsModalVisible: false,
            moverenameSelectedItems: [],
            selectedRows: []
        });
    }

    _handleClickIDFile(filename) {
        this.setState({
            idsingleFilename: filename,
            idsingleIsModalVisible: true
        });
    }

    _handleIDModalCancel() {
        this.setState({
            idsingleIsModalVisible: false,
            idsingleFilename: ""
        });
    }

    _handleIDModalComplete() {
        this.setState({
            isReloading: true,
            idsingleIsModalVisible: false,
            idsingleFilename: ""
        });
    }

    _handleClickIDMultipleEpisodes() {
        const { dirList } = this.state;

        const filenamesToID = [...this.state.selectedRows];

        const idItems = [];
        filenamesToID.forEach(filename => {
            dirList.forEach(item => {
                if (item.name === filename && Regex.isVideoFile(item.name)) {
                    idItems.push(item);
                }
            });
        });

        if (idItems.length > 0) {
            this.setState({
                idmultipleIsModalVisible: true,
                idmultipleEpisodes: idItems
            });
        }
    }

    _handleIDMultipleCancel() {
        this.setState({
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: []
        });
    }

    _handleIDMultipleComplete() {
        this.setState({
            isReloading: true,
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: [],
            selectedRows: []
        });
    }

    _handleSelectVideos() {
        const { dirList } = this.state;

        let selected = [];
        dirList.forEach(item => {
            if (Regex.isVideoFile(item.name)) {
                selected.push(item.name);
            }
        });

        this.setState({
            selectedRows: selected
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
        filenamesToUntag.forEach(filename => {
            dirList.forEach(item => {
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
                untagIDinfo: untagItems
            });
        }
    }

    _handleUntagModalComplete() {
        this.setState({
            isReloading: true,
            untagIsModalVisible: false,
            untagIDinfo: []
        });
    }

    _handleUntagCancel() {
        this.setState({
            untagIsModalVisible: false,
            untagIDinfo: []
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
                            </a>&nbsp;{tagAction}
                            {untagAction}
                        </span>
                    );
                }
            }
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
            untagIsModalVisible
        } = this.state;

        const hasSelected = selectedRows.length > 0 ? true : false;
        const buttonDisabled = !hasSelected;

        return (
            <div>
                <div className="ib-filemanager-button-bar">
                    <Button.Group>
                        <Button
                            type="primary"
                            icon="video-camera"
                            size="small"
                            onClick={this._handleSelectVideos.bind(this)}
                        >
                            Select Videos
                        </Button>
                    </Button.Group>&nbsp;
                    <Button.Group>
                        <Button
                            icon="tag"
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickIDMultipleEpisodes.bind(
                                this
                            )}
                        >
                            ID
                        </Button>
                        <Button
                            icon="export"
                            size="small"
                            disabled={buttonDisabled}
                            onClick={this._handleClickMoveRename.bind(this)}
                        >
                            Move or Rename
                        </Button>
                        <Button
                            icon="delete"
                            size="small"
                            type="danger"
                            disabled={buttonDisabled}
                            onClick={this._handleClickTrash.bind(this)}
                        >
                            Trash
                        </Button>
                        <Button
                            icon="disconnect"
                            size="small"
                            type="danger"
                            disabled={buttonDisabled}
                            onClick={this._handleClickUntag.bind(this)}
                        >
                            Remove ID
                        </Button>
                    </Button.Group>
                </div>
                <FilesystemBrowser
                    actionColumns={this._buildActionColumns()}
                    basePath={currentToplevelDirectory}
                    currentPath={currentPath}
                    forceReload={isReloading}
                    hasCheckboxes={true}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    parentHandleSelectChange={this._handleSelectionChange.bind(
                        this
                    )}
                    selectedRowKeys={selectedRows}
                    showDirectories={true}
                    showFiles={true}
                />
                <TrashModal
                    currentPath={currentPath}
                    isVisible={trashIsModalVisible}
                    itemsToTrash={trashSelectedItems}
                    onTrashComplete={this._handleTrashComplete.bind(this)}
                    onCancel={this._handleCancelTrash.bind(this)}
                />
                <MoveRenameModal
                    initialPath={currentPath}
                    isVisible={moverenameIsModalVisible}
                    itemsToRename={moverenameSelectedItems}
                    onRenameComplete={this._handleMoveRenameComplete.bind(this)}
                    onCancel={this._handleMoveRenameCancel.bind(this)}
                />
                <IDFileModal
                    key={idsingleFilename}
                    isVisible={idsingleIsModalVisible}
                    onIDComplete={this._handleIDModalComplete.bind(this)}
                    onCancel={this._handleIDModalCancel.bind(this)}
                    currentFilename={idsingleFilename}
                    currentPathInfo={currentPathInfo}
                    currentToplevelDirectory={currentToplevelDirectory}
                />
                <IDMultipleEpisodesModal
                    currentPathInfo={currentPathInfo}
                    episodesToID={idmultipleEpisodes}
                    isVisible={idmultipleIsModalVisible}
                    onCancel={this._handleIDMultipleCancel.bind(this)}
                    onIDComplete={this._handleIDMultipleComplete.bind(this)}
                />
                <UntagModal
                    isVisible={untagIsModalVisible}
                    onUntagComplete={this._handleUntagModalComplete.bind(this)}
                    onCancel={this._handleUntagCancel.bind(this)}
                    itemsToUntag={untagIDinfo}
                />
            </div>
        );
    }

    _buildDirectoryMenu() {
        const { toplevelDirectories } = this.props;
        const { currentToplevelDirectory } = this.state;

        const menuList = [];
        toplevelDirectories.forEach(dir => {
            const activeClass =
                dir.value === currentToplevelDirectory
                    ? "ib-filemanager-button ib-filemanager-button-active"
                    : "ib-filemanager-button";
            menuList.push(
                <Menu.Item key={dir.value}>
                    <Link to={"/filemanager/" + dir.key}>{dir.key}</Link>
                </Menu.Item>
            );
        });

        return (
            <div id="ib-filemanager-directorymenu">
                <Menu
                    mode="horizontal"
                    theme="light"
                    selectedKeys={[currentToplevelDirectory]}
                >
                    {menuList}
                </Menu>
            </div>
        );
    }

    render() {
        const { currentToplevelDirectory } = this.state;

        let directoryMenu = this._buildDirectoryMenu();
        let output = "";
        if (currentToplevelDirectory) {
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

const mapStateToProps = state => {
    const { settings } = state;

    return {
        toplevelDirectories: settings.settings.directories
    };
};

export default connect(mapStateToProps)(FileManager);
