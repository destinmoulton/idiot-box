import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import DirectoriesEditor from './DirectoriesEditor';

class Settings extends Component {
    constructor(props){
        super(props);

    }

    render() {
        const {
            lastAPIAction,
            lastSavedSettingID,
            saveInProgress,
            settings
        } = this.props;
        
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Media Directories</h3>
                    </Col>
                    <Col>
                        <DirectoriesEditor 
                            saveInProgress={saveInProgress}
                            lastAPIAction={lastAPIAction}
                            lastSavedSettingID={lastSavedSettingID}
                            settings={settings.directories}
                            settingCategory={"directories"} />
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { settings } = state;
    return {
        saveInProgress: settings.saveInProgress,
        lastAPIAction: settings.lastAPIAction,
        lastSavedSettingID: settings.lastSavedSettingID,
        settings: settings.settings
    }
}

export default connect(mapStateToProps)(Settings);