import React from "react";

import { IconButton, Grid } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
const TopBar = ({ handleClickReload, path }) => {
    return (
        <Grid container className="ib-filebrowser-topbar">
            <Grid item xs={11} className="filebrowser-topbar-current-path">
                <input value={path} disabled={true} />
            </Grid>
            <Grid
                item
                xs={1}
                align="center"
                className="filebrowser-topbar-refresh-icon"
            >
                <IconButton onClick={handleClickReload} size="small">
                    <CachedIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default TopBar;
