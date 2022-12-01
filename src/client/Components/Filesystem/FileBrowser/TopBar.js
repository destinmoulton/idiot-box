import React from "react";

import { IconButton, Grid } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
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
