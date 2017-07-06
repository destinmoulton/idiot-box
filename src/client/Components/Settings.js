import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import DirectoriesEditor from './Settings/DirectoriesEditor';

import { getSettingsForCategory } from '../actions/settings.actions';

class Settings extends Component {
    constructor(props){
        super(props);

    }

    componentWillMount(){
        this.props.getSettingsForCategory('directories');
    }

    render() {
        const { lastAPIAction, lastSavedSettingID, saveInProgress, settings } = this.props;
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                    <Col>
                        <DirectoriesEditor 
                            saveInProgress={saveInProgress}
                            lastAPIAction={lastAPIAction}
                            lastSavedSettingID={lastSavedSettingID}
                            directories={settings.directories}/>
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