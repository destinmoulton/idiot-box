import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";

import DirectoriesEditor from "./DirectoriesEditor";
import Links from "./Links";

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            lastAPIAction,
            lastSavedSettingID,
            isSaveInProgress,
            settings,
        } = this.props;
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h3>Media Directories</h3>
                </Grid>
                <Grid item xs={12}>
                    <DirectoriesEditor
                        saveInProgress={isSaveInProgress}
                        lastAPIAction={lastAPIAction}
                        lastSavedSettingID={lastSavedSettingID}
                        settings={settings.directories}
                        settingCategory={"directories"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Links links={settings.links} />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    const { settings } = state;
    return {
        isSaveInProgress: settings.isSaveInProgress,
        isGetAllInProgress: settings.isGetAllInProgress,
        lastAPIAction: settings.lastAPIAction,
        lastSavedSettingID: settings.lastSavedSettingID,
        settings: settings.settings,
    };
};

export default connect(mapStateToProps)(Settings);
