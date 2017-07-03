import React, { Component } from 'react';


import { Button, Col, Icon, Input, InputGroup } from 'antd';

import DirectorySelectorModal from '../Filesystem/DirectorySelectorModal';

const DEFAULT_INITIAL_DIR = "/";
class DirectoriesEditor extends Component {

    constructor(props){
        super(props);

        this.state = {
            dirModalSettingID: "",
            dirModalIsVisible: false,
            dirModalSelectedDirectory: DEFAULT_INITIAL_DIR,
            currentEditData:{
                key: "",
                value: DEFAULT_INITIAL_DIR
            }
        }
    }

    _openDirectorySelector(evt) {
        const settingID = evt.currentTarget.getAttribute('data-setting-id');
        this.setState({
            ...this.state,
            dirModalSettingID: settingID,
            dirModalIsVisible: true
        });

    }

    _okDirectorySelector(){
        this.setState({
            ...this.state,
            dirModalIsVisible: false,
            currentEditData:{
                ...this.state.currentEditData,
                value: this.state.dirModalSelectedDirectory
            }
        });
    }

    _cancelDirectorySelector(){
        this.setState({
            ...this.state,
            dirModalSelectedDirectory: "",
            dirModalIsVisible: false
        });
    }

    _handleChangeDirectory(newDir) {
        this.setState({
            ...this.state,
            dirModalSelectedDirectory: newDir
        });
    }

    _handleSaveButtonPress(){
        
    }

    _handleChangeSettingName(e){
        this.setState({
            ...this.state,
            currentEditData:{
                ...this.state.currentEditData,
                key: e.currentTarget.value
            }
        });
    }

    _handleChangeSettingValue(e){
        this.setState({
            ...this.state,
            currentEditData:{
                ...this.state.currentEditData,
                value: e.currentTarget.value
            }
        });
    }

    _buildSettingEditorForm(settingID){
        const { currentEditData } = this.state;
        return (
            <div>
                <Input.Group size="large">
                    <Col span={8}>
                        <Input 
                            placeholder="Setting name..."
                            onChange={this._handleChangeSettingName.bind(this)}
                            value={currentEditData.key}
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            addonAfter={<Icon type="folder" onClick={this._openDirectorySelector.bind(this)} data-setting-id={settingID} />} 
                            onChange={this._handleChangeSettingValue.bind(this)}
                            value={currentEditData.value}
                        />
                    </Col>
                    <Col span={2}>
                        <Button onClick={this._handleSaveButtonPress.bind(this)}>Save</Button>
                    </Col>
                </Input.Group>
            </div>
        );
    }

    render() {
        const { dirModalIsVisible } = this.state;

        const newEditorForm = this._buildSettingEditorForm("new_setting");
        return (
            <div>
                <div className="ib-settings-dir-list">

                </div>
                {newEditorForm}
                <Button 
                    >New Directory Setting</Button>
                <DirectorySelectorModal 
                    initialPath="/"
                    visible={dirModalIsVisible}
                    onCancel={this._cancelDirectorySelector.bind(this)}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    onOk={this._okDirectorySelector.bind(this)}
                />
            </div>
        );
    }
}


export default DirectoriesEditor;