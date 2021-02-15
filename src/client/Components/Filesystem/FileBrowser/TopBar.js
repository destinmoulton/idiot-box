import React from "react";

import CachedIcon from "@material-ui/icons/Cached";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
const TopBar = ({ handleClickReload, path }) => {
    return (
        <Grid container className="ib-filebrowser-topbar">
            <Grid xs="11" className="filebrowser-topbar-current-path">
                <input value={path} disabled={true} />
            </Grid>
            <Grid
                xs="1"
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
