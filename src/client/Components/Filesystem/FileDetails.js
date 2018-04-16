import PropTypes from "prop-types";
import React from "react";

import { Icon, Spin } from "antd";

import PlayButton from "../PlayButton";

import Regex from "../../lib/Regex.lib";
const FileDetails = ({ assocData, filename, fullPath }) => {
    let mediaDetails = "";
    if ("title" in assocData) {
        mediaDetails = (
            <div className="ib-filebrowser-media-title">{assocData.title}</div>
        );
    }

    let actions = "";
    if (Regex.isVideoFile(filename)) {
        actions = <PlayButton filename={filename} fullPath={fullPath} />;
    }

    return (
        <div>
            {mediaDetails}
            <div>
                {actions}
                {filename}
            </div>
        </div>
    );
};

FileDetails.propTypes = {
    assocData: PropTypes.object.isRequired,
    basePath: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    fullPath: PropTypes.string.isRequired
};

export default FileDetails;
