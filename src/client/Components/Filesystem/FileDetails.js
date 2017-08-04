import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon, Spin } from 'antd';

import PlayButton from '../PlayButton';

import Regex from '../../lib/Regex.lib';
class FileDetails extends Component {

    static propTypes = {
        assocData: PropTypes.object.isRequired,
        basePath: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        fullPath: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { assocData, filename, fullPath } = this.props;

        let mediaDetails = "";
        if('title' in assocData){
            mediaDetails = <div className="ib-filebrowser-media-title">{assocData.title}</div>;
        }

        let actions = "";
        if(Regex.isVideoFile(filename)){
            actions = <PlayButton filename={filename} fullPath={fullPath} />;
        }
        
        return (
            <div>
                {mediaDetails}
                <div>{actions}{filename}</div>
            </div>
        );
    }
}

export default FileDetails;