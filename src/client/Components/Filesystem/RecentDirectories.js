import PropTypes from "prop-types";
import React, {Component} from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import Spinner from "./FileBrowser/Spinner";

class RecentDirectories extends Component {

    INITIAL_STATE = {
        isLoading: false,
        dirs: [],
        selectedPath: ""
    };

    constructor(props) {
        super(props);

        this.state = {...this.INITIAL_STATE};
    }

    componentDidMount() {
        this._getRecentDirsFromServer();
    }

    _getRecentDirsFromServer() {
        const {callAPI} = this.props;

        const options = {
            limit: 10
        };
        callAPI(
            "files.recent_dirs.get",
            options,
            this._recentDirsReceived.bind(this),
            false
        );
        this.setState({isLoading: true});
    }

    _recentDirsReceived(recentDirs, recd) {
        this.setState({isLoading: false, dirs: recentDirs});
    }

    _renderRecentDirs() {
        const {selectedPath} = this.state;

        const {dirs} = this.state;
        let rows = [];
        for (const dir of dirs) {
            const selected = dir.path === selectedPath;

            rows.push(
                <TableRow
                    onClick={this._handleClickDirectory.bind(this, dir.path)}
                    selected={selected}
                    style={{cursor: "pointer"}}
                >
                    <TableCell>
                        {dir.path}
                    </TableCell>
                </TableRow>
            )
        }
        return rows;
    }

    _handleClickDirectory(dir) {
        this.setState({selectedPath: dir});
        this.props.onChangeDirectory(dir);
    }

    render() {
        const {isLoading} = this.state;

        if (isLoading) {
            return <Spinner/>;
        }
        const rows = this._renderRecentDirs();
        return (
            <TableContainer>
                <Table className="ib-filemanager-table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                className="filemanager-name-column"
                            >
                                Directory
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{rows}</TableBody>
                </Table>
            </TableContainer>
        )
    }
}

RecentDirectories.propTypes = {
    callAPI: PropTypes.func.isRequired,
    onChangeDirectory: PropTypes.func
};

RecentDirectories.defaultProps = {
    onChangeDirectory: () => {
    }
};

export default RecentDirectories;

