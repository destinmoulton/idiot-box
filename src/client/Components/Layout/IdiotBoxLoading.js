import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

const IdiotBoxLoading = () => {
    return (
        <div id="ib-loading-box">
            <CircularProgress />
            <br />
            <br />
            <span>Loading Idiot Box...</span>
        </div>
    );
};

export default IdiotBoxLoading;
