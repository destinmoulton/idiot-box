import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class FileDetails extends Component {
    VIDEO_FILE_REGX = /(\.mp4|\.mkv|\.avi)$/;

    static propTypes = {
        assocData: PropTypes.object.isRequired,
        basePath: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        fullPath: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
    }

    _startPlayback(){

        const { emitAPIRequest, filename, fullPath } = this.props;
        const options = {
            path: fullPath,
            filename: filename
        }
        emitAPIRequest("videoplayer.cmd.start", options, this._playbackStarted.bind(this), false);
    }

    _playbackStarted(){

    }

    render() {
        const { assocData, filename } = this.props;

        let mediaDetails = "";
        if('title' in assocData){
            mediaDetails = <div className="ib-filebrowser-media-title">{assocData.title}</div>;
        }

        let actions = "";
        if(filename.search(this.VIDEO_FILE_REGX) > -1){
            actions = <a href="javascript:void(0)"
                            onClick={this._startPlayback.bind(this)}>
                            <Icon type="play-circle" className="ib-filebrowser-media-play"/>
                        </a>;
        }
        
        return (
            <div>
                {mediaDetails}
                <div>{actions}{filename}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { }
};

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDetails);