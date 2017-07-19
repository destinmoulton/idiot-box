import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class FileDetails extends Component {
    VIDEO_FILE_REGX = /(\.mp4|\.mkv|\.avi)$/;

    static propTypes = {
        basePath: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        fullPath: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            idInfo: {}
        }
    }

    componentWillMount(){
        const { basePath,
                emitAPIRequest,
                filename,
                fullPath} = this.props;
        if(filename.search(this.VIDEO_FILE_REGX) > -1){
            const options = {
                file_info: {
                    basePath,
                    filename,
                    fullPath
                }
            };

            emitAPIRequest("id.file.search", options, this._idComplete.bind(this), false);
        }
    }

    _idComplete(data){
        if('id' in data){
            this.setState({
                idInfo: data
            });
        }
    }

    render() {
        const { filename } = this.props;
        const { idInfo } = this.state;

        let mediaDetails = "";
        if('title' in idInfo){
            mediaDetails = <div className="ib-filebrowser-media-title">{idInfo.title}</div>
        }
        return (
            <div>
                {mediaDetails}
                <div>{filename}</div>
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