import PropTypes from "prop-types";
import React, { Component } from "react";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FolderIcon from "@material-ui/icons/Folder";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { socketClient } from "../../store";

import FileDetails from "./FileDetails";

class FilesystemBrowser extends Component {
    PARENT_DIR_NAME = "..";

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            currentPath: "",
            dirList: [],
            showHidden: false,
        };
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
                    size: this._humanFileSize(item.size, false),
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

    _humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + " B";
        }
        var units = si
            ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
            : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
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

    _buildRows() {
        const { basePath } = this.props;
        const { currentPath, dirList } = this.state;

        const rows = [];
        dirList.forEach((item) => {
            let name = "";
            if (item.isDirectory) {
                let icon = <FolderIcon />;
                if (item.name === this.PARENT_DIR_NAME) {
                    icon = <ArrowUpwardIcon />;
                }
                name = (
                    <Button onClick={() => this._handleDirClick(item.name)}>
                        {icon}&nbsp;&nbsp;{item.name}
                    </Button>
                );
            } else {
                name = (
                    <FileDetails
                        assocData={item.assocData}
                        filename={item.name}
                        basePath={basePath}
                        fullPath={currentPath}
                    />
                );
            }
            rows.push(
                <TableRow key={item.name}>
                    <TableCell></TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            );
        });
        return rows;
    }

    _buildLoadingBox() {
        return (
            <div className="ib-filebrowser-spin-box">
                <CircularProgress />
                <br />
                Loading directory list...
            </div>
        );
    }

    _buildTable() {
        const {
            hasCheckboxes,
            parentHandleSelectChange,
            selectedRowKeys,
        } = this.props;

        const { currentPath } = this.state;

        const rows = this._buildRows();

        let rowSelection = {};
        if (hasCheckboxes) {
            rowSelection = {
                selectedRowKeys,
                onChange: parentHandleSelectChange,
            };
        }

        return (
            <div>
                <span>
                    <Button
                        icon="reload"
                        onClick={this._reloadDir.bind(this)}
                        size="small"
                    />
                    <span className="ib-filebrowser-current-path">
                        {currentPath}
                    </span>
                </span>
                <TableContainer>
                    <Table className="ib-filemanager-table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{rows}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

    render() {
        const { isLoading } = this.state;
        return isLoading ? this._buildLoadingBox() : this._buildTable();
    }
}

FilesystemBrowser.propTypes = {
    callAPI: PropTypes.func.isRequired,
    basePath: PropTypes.string.isRequired,
    currentPath: PropTypes.string,
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

FilesystemBrowser.defaultProps = {
    actionColumns: [],
    currentPath: "",
    forceReload: false,
    hasCheckboxes: false,
    lockToBasePath: true,
    onChangeDirectory: () => {},
    parentHandleSelectChange: () => {},
    selectedRowKeys: [],
    showDirectories: true,
    showFiles: true,
};

export default FilesystemBrowser;
