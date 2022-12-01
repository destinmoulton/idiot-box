import React from "react";

import { CircularProgress, Grid, Paper } from "@mui/material";

const IdiotBoxLoading = () => {
    return (
        <Grid container alignItems="center" justify="center">
            <Grid item xs={8} className="ib-loading-box">
                <CircularProgress />
                <br />
                <br />
                <span>Loading Idiot Box...</span>
            </Grid>
        </Grid>
    );
};

export default IdiotBoxLoading;
