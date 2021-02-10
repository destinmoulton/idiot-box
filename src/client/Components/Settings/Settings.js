import React, { Component } from "react";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";

import DirectoriesEditor from "./DirectoriesEditor";

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            lastAPIAction,
            lastSavedSettingID,
            saveInProgress,
            settings,
        } = this.props;

        return (
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <h3>Media Directories</h3>
                </Grid>
                <Grid xs={12}>
                    <DirectoriesEditor
                        saveInProgress={saveInProgress}
                        lastAPIAction={lastAPIAction}
                        lastSavedSettingID={lastSavedSettingID}
                        settings={settings.directories}
                        settingCategory={"directories"}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    const { settings } = state;
    return {
        saveInProgress: settings.saveInProgress,
        lastAPIAction: settings.lastAPIAction,
        lastSavedSettingID: settings.lastSavedSettingID,
        settings: settings.settings,
    };
};

export default connect(mapStateToProps)(Settings);
