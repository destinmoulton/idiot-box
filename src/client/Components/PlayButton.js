import PropTypes from "prop-types";
import React, { Component } from "react";

import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { callAPI } from "../actions/api.actions";
class PlayButton extends Component {
    static propTypes = {
        filename: PropTypes.string.isRequired,
        fullPath: PropTypes.string.isRequired,
    };

    _startPlayback() {
        const { callAPI, filename, fullPath } = this.props;
        const options = {
            path: fullPath,
            filename: filename,
        };
        callAPI(
            "videoplayer.cmd.start",
            options,
            this._playbackStarted.bind(this),
            false
        );
    }

    _playbackStarted() {}

    render() {
        return (
            <Button onClick={this._startPlayback.bind(this)}>
                <PlayArrowIcon className="ib-playbutton-icon" />
            </Button>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayButton);
