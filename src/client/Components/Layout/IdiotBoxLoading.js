import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

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
