import PropTypes from "prop-types";
import React from "react";

//import PlayButton from "../PlayButton";
import VideocamIcon from "@material-ui/icons/Videocam";

import Regex from "../../../lib/Regex.lib";
const FileDetails = ({ assocData, filename, fullPath }) => {
    let mediaDetails = "";
    if ("title" in assocData) {
        let extra = "";
        if (assocData.type === "movie") {
            extra = " - " + assocData.year + " [Movie]";
        } else {
            extra = " [Episode]";
        }
        mediaDetails = (
            <div className="filemanager-media-info">
                {assocData.title}
                {extra}
            </div>
        );
    }

    let videoClass = "";
    let videoIcon = "";
    if (Regex.isVideoFile(filename)) {
        videoClass = "is-video-file";
        videoIcon = <VideocamIcon className="filemanager-video-icon" />;
        //actions = <PlayButton filename={filename} fullPath={fullPath} />;
    }

    return (
        <div className={"filemanager-file-details " + videoClass}>
            <div className="filemanager-filename-topline">
                {videoIcon}
                <div className="filemanager-filename-text">{filename}</div>
            </div>
            {mediaDetails}
        </div>
    );
};

FileDetails.propTypes = {
    assocData: PropTypes.object.isRequired,
    basePath: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    fullPath: PropTypes.string.isRequired,
};

export default FileDetails;
