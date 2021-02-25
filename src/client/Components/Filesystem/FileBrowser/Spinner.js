import React from "react";

import { CircularProgress } from "@material-ui/core";
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
