import React from "react";

import { CircularProgress } from "@mui/material";
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
