import PropTypes from "prop-types";
import React, { Component } from "react";

import IconButton from "@material-ui/core/IconButton";

import TopBar from "./FileBrowser/TopBar";
import BrowserTable from "./FileBrowser/BrowserTable";
import Spinner from "./FileBrowser/Spinner";

import humanfilesize from "../../lib/humanfilesize.lib";

class FileBrowser extends Component {
    PARENT_DIR_NAME = "..";
    INITIAL_STATE = {
        isAllSelected: false,
        isLoading: false,
        currentPath: "",
        dirList: [],
        showHidden: false,
    };

    constructor(props) {
        super(props);

        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        let currentPath = this.props.basePath;
        if (this.props.currentPath !== "") {
            currentPath = this.props.currentPath;
        }

        this._getDirFromServer(currentPath, this.props.basePath);
    }

    componentDidUpdate(prevProps, prevState) {
        const { forceReload, currentPath, basePath } = this.props;
        if (forceReload !== prevProps.forceReload && forceReload === true) {
            this._reloadDir();
        }
        if (!this.state.isLoading) {
            if (currentPath !== "" && currentPath !== prevState.currentPath) {
                this._getDirFromServer(currentPath, prevProps.basePath);
            } else if (basePath !== prevProps.basePath) {
                this._getDirFromServer(basePath, basePath);
            }
        }
    }

    _reloadDir() {
        this._getDirFromServer(this.state.currentPath, this.props.basePath);
    }

    _getDirFromServer(fullPath, basePath) {
        const { callAPI } = this.props;

        const options = {
            base_path: basePath,
            full_path: fullPath,
        };

        callAPI(
            "filesystem.dir.get",
            options,
            this._dirListReceived.bind(this),
            false
        );

        this.setState({
            isLoading: true,
        });
    }

    _dirListReceived(newDirList, recd) {
        const { onChangeDirectory } = this.props;

        const newPath = recd.request.params.full_path;

        const dirList = this._prepareDirList(newDirList, newPath);

        //Notify the parent components of a directory change
        onChangeDirectory(newPath, dirList);

        this.setState({
            currentPath: newPath,
            dirList,
            isLoading: false,
            isAllSelected: false,
        });
    }

    _prepareDirList(dirList, newPath) {
        const {
            basePath,
            lockToBasePath,
            showDirectories,
            showFiles,
        } = this.props;
        const { showHidden } = this.state;

        let directories = [];
        let files = [];

        const parentDirectory = {
            key: 0,
            name: this.PARENT_DIR_NAME,
            isDirectory: true,
            size: "",
            assocData: {},
        };

        if (!lockToBasePath || (lockToBasePath && basePath !== newPath)) {
            directories.push(parentDirectory);
        }

        dirList.forEach((item) => {
            let includeItem = true;
            if (!showHidden && item.name.startsWith(".")) {
                includeItem = false;
            }

            if (includeItem) {
                const newItem = {
                    ...item,
                    key: item.name,
                    size: humanfilesize(item.size, false),
                    assocData: item.assocData,
                };
                if (newItem.isDirectory) {
                    directories.push(newItem);
                } else {
                    files.push(newItem);
                }
            }
        });

        if (showDirectories && showFiles) {
            return [...directories, ...files];
        } else if (!showDirectories && showFiles) {
            return [...files];
        } else if (showDirectories && !showFiles) {
            return [...directories];
        }
        return [];
    }

    _handleDirClick(nextDirName) {
        const { serverInfo, basePath } = this.props;
        const { pathSeparator } = serverInfo;
        const { currentPath } = this.state;

        let newPath = currentPath;
        if (nextDirName === this.PARENT_DIR_NAME) {
            const pathParts = currentPath.split(pathSeparator);
            pathParts.pop();
            newPath = pathParts.join(pathSeparator);

            if (newPath === "") {
                newPath = pathSeparator;
            }
        } else {
            if (currentPath === pathSeparator) {
                // Don't concat additional / when at linux root "/"
                newPath = currentPath + nextDirName;
            } else {
                newPath = currentPath + pathSeparator + nextDirName;
            }
        }

        this._getDirFromServer(newPath, basePath);
    }

    _handleClickSingleCheckbox(item) {
        this.props.handleSelectChangeSingle(item);
        this.setState({
            isAllSelected: false,
        });
    }

    _handleClickAllCheckbox() {
        if (this.state.isAllSelected) {
            // Clear the selected set
            this.props.handleSelectChangeMultiple(new Set());
            this.setState({
                isAllSelected: false,
            });
        } else {
            const { dirList } = this.state;
            let selected = new Set();
            dirList.forEach((item) => {
                selected.add(item.name);
            });
            this.props.handleSelectChangeMultiple(selected);
            this.setState({
                isAllSelected: true,
            });
        }
    }

    render() {
        const {
            basePath,
            selectedRows,
            enableCheckboxes,
            enableSize,
        } = this.props;
        const { currentPath, dirList, isAllSelected, isLoading } = this.state;

        if (isLoading) {
            return <Spinner />;
        }

        return (
            <div>
                <TopBar
                    path={currentPath}
                    handleClickReload={this._reloadDir.bind(this)}
                />
                <BrowserTable
                    basePath={basePath}
                    enableCheckboxes={enableCheckboxes}
                    enableSize={enableSize}
                    handleClickAllCheckbox={this._handleClickAllCheckbox.bind(
                        this
                    )}
                    handleClickDir={this._handleDirClick.bind(this)}
                    handleClickSingleCheckbox={this._handleClickSingleCheckbox.bind(
                        this
                    )}
                    isAllChecked={isAllSelected}
                    path={currentPath}
                    rowData={dirList}
                    selectedRows={selectedRows}
                />
            </div>
        );
    }
}

FileBrowser.propTypes = {
    basePath: PropTypes.string.isRequired,
    callAPI: PropTypes.func.isRequired,
    currentPath: PropTypes.string,
    enableCheckboxes: PropTypes.bool,
    enableSize: PropTypes.bool,
    forceReload: PropTypes.bool,
    hasCheckboxes: PropTypes.bool,
    lockToBasePath: PropTypes.bool,
    onChangeDirectory: PropTypes.func,
    parentHandleSelectChange: PropTypes.func,
    selectedRowKeys: PropTypes.array,
    serverInfo: PropTypes.object.isRequired,
    showDirectories: PropTypes.bool,
    showFiles: PropTypes.bool,
};

FileBrowser.defaultProps = {
    actionColumns: [],
    currentPath: "",
    enableCheckboxes: true,
    enableSize: false,
    forceReload: false,
    hasCheckboxes: false,
    lockToBasePath: true,
    onChangeDirectory: () => {},
    parentHandleSelectChange: () => {},
    selectedRowKeys: [],
    showDirectories: true,
    showFiles: true,
};

export default FileBrowser;
