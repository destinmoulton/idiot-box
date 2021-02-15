import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
const Spinner = () => {
    return (
        <div className="ib-filebrowser-spin-box">
            <CircularProgress />
            <br />
            Loading directory list...
        </div>
    );
};

export default Spinner;
