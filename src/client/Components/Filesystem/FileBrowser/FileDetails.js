import PropTypes from "prop-types";
import React from "react";

//import PlayButton from "../PlayButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import VideocamIcon from "@material-ui/icons/Videocam";

import Regex from "../../../lib/Regex.lib";
const FileDetails = ({
    assocData,
    enableTagSingleLink,
    filename,
    fullPath,
    onClickTagSingle,
}) => {
    const isVideoFile = Regex.isVideoFile(filename);
    let extra = null;
    if ("title" in assocData) {
        let txt = "";
        if (assocData.type === "movie") {
            txt = " - " + assocData.year + " [Movie]";
        } else {
            txt = " [Episode]";
        }
        extra = (
            <div>
                {assocData.title}
                {txt}
            </div>
        );
    } else {
        if (isVideoFile && enableTagSingleLink) {
            extra = (
                <div
                    className="tag-single-wrapper"
                    onClick={() => onClickTagSingle(filename)}
                >
                    <div className="tag-single-icon">
                        <LocalOfferIcon />
                    </div>
                    <div className="tag-single-text">ID This Video</div>
                </div>
            );
        }
    }

    let videoClass = "";
    let videoIcon = "";
    if (isVideoFile) {
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
            <div className="filemanager-filename-bottomline">{extra}</div>
        </div>
    );
};

FileDetails.propTypes = {
    assocData: PropTypes.object.isRequired,
    basePath: PropTypes.string.isRequired,
    enableTagSingleLink: PropTypes.bool,
    filename: PropTypes.string.isRequired,
    fullPath: PropTypes.string.isRequired,
    onClickTagSingle: () => {},
};

export default FileDetails;
