import PropTypes from "prop-types";
import React, {Component} from "react";

import Spinner from "./FileBrowser/Spinner";

class RecentDirectories extends Component {

    INITIAL_STATE = {
        isLoading: false,
        dirs: []
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
        const {dirs} = this.state;
        let rows = [];
        for (const dir of dirs) {

            rows.push(
                <li>
                    {dir.subpath}
                </li>
            )
        }
        return rows;
    }

    render() {
        const {isLoading} = this.state;

        if (isLoading) {
            return <Spinner/>;
        }
        return (
            <ul>{this._renderRecentDirs()}</ul>
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

