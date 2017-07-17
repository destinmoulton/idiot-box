import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import DirectoriesEditor from './DirectoriesEditor';

import { getSettingsForCategory } from '../../actions/settings.actions';

class Settings extends Component {
    constructor(props){
        super(props);

    }

    componentWillMount(){
        this.props.getSettingsForCategory('directories');
        this.props.getSettingsForCategory('thumbpaths');
    }

    render() {
        const { lastAPIAction, lastSavedSettingID, saveInProgress, settings } = this.props;
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
                <Row>
                    <Col>
                        <h3>Thumbnail Paths</h3>
                    </Col>
                    <Col>
                        <DirectoriesEditor 
                            saveInProgress={saveInProgress}
                            lastAPIAction={lastAPIAction}
                            lastSavedSettingID={lastSavedSettingID}
                            settings={settings.thumbpaths}
                            settingCategory={"thumbpaths"} />
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

const mapDispatchToProps = (dispatch)=>{
    return {
        getSettingsForCategory: (category)=>dispatch(getSettingsForCategory(category))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);