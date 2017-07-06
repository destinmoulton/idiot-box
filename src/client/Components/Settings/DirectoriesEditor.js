import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    Button, 
    Col, 
    Icon, 
    Input, 
    InputGroup, 
    Modal,
    Table } from 'antd';

import DirectorySelectorModal from '../Filesystem/DirectorySelectorModal';

import { saveSetting } from '../../actions/settings.actions';

const DEFAULT_INITIAL_DIR = "/";
class DirectoriesEditor extends Component {
    static propTypes = {
        directories: PropTypes.array.isRequired
    }

    constructor(props){
        super(props);

        this.state = {
            dirModalSettingID: "",
            dirModalIsVisible: false,
            dirModalSelectedDirectory: DEFAULT_INITIAL_DIR,
            currentlyEditing: [],
            currentEditData:{
                0: {
                    id:0,
                    key:"",
                    value: DEFAULT_INITIAL_DIR
                }
            }
        }
    }

    _openDirectorySelector(evt) {
        const {currentEditData} = this.state;
        const settingID = evt.currentTarget.getAttribute('data-setting-id');
        this.setState({
            ...this.state,
            dirModalSettingID: settingID,
            dirModalIsVisible: true,
            dirModalSelectedDirectory: currentEditData[settingID].value
        });

    }

    _okDirectorySelector(){
        const { currentEditData, 
                dirModalSelectedDirectory, 
                dirModalSettingID} = this.state;

        const settingID = dirModalSettingID;

        const newData = {...currentEditData[settingID]};
        newData['value'] = dirModalSelectedDirectory;
        this.setState({
            ...this.state,
            dirModalSettingID: -1,
            dirModalSelectedDirectory: "",
            dirModalIsVisible: false,
            currentEditData:{
                ...currentEditData,
                [settingID]: newData
            }
        });
    }

    _cancelDirectorySelector(){
        this.setState({
            ...this.state,
            dirModalSettingID: -1,
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

    _handleSaveButtonPress(e){
        const {currentEditData} = this.state;
        
        const settingID = e.currentTarget.getAttribute("data-setting-id");
        const settingData = currentEditData[settingID];
        this.props.saveSetting(settingID, settingData.key, settingData.value);
        console.log("Save Button Pressed", currentEditData[settingID]);
    }

    _handleChangeSettingInput(e){
        const {currentEditData} = this.state;

        const settingID = e.currentTarget.getAttribute('data-setting-id');
        const settingField = e.currentTarget.getAttribute('data-setting-field');

        const newData = {...currentEditData[settingID]};
        newData[settingField] = e.currentTarget.value;
        this.setState({
            ...this.state,
            currentEditData:{
                ...currentEditData,
                [settingID]:newData
            }
        });
    }

    _buildSettingAddForm(){
        const { currentEditData } = this.state;
        return (
            <div>
                <h4>Add a Setting</h4>
                <Input.Group size="large">
                    <Col span={8}>
                        {this._buildInputNameField(0)}
                    </Col>
                    <Col span={8}>
                        {this._buildInputValueField(0)}
                    </Col>
                    <Col span={2}>
                        <Button onClick={this._handleSaveButtonPress.bind(this)}
                                data-setting-id={0}>Save</Button>
                    </Col>
                </Input.Group>
            </div>
        );
    }

    _buildInputNameField(settingID){
        const {currentEditData} = this.state;
        return (
            <Input 
                placeholder="Setting name..."
                onChange={this._handleChangeSettingInput.bind(this)}
                data-setting-field={"key"}
                data-setting-id={settingID}
                value={currentEditData[settingID].key}
            />
        );
    }

    _buildInputValueField(settingID, currentValue){
        const {currentEditData} = this.state;
        return (
            <Input 
                addonAfter={<Icon type="folder" onClick={this._openDirectorySelector.bind(this)} data-setting-id={settingID} />} 
                onChange={this._handleChangeSettingInput.bind(this)}
                data-setting-field={"value"}
                data-setting-id={settingID}
                value={currentEditData[settingID].value}
            />
        );
    }

    _buildDirectoriesTable(){
        const { directories } = this.props;
        const { currentlyEditing } = this.state;
        const columns = [{
            title: "Name",
            dataIndex: "key",
            render: (text, setting)=>{
                if(currentlyEditing.find(setting.id)){
                    return (
                        this._buildInputNameField(setting.id, setting.name)
                    )
                } else {
                    return (<span>{setting.name}</span>);
                }
            }
        }, 
        {
            title: "Directory",
            dataIndex: "value",
            render: (text, setting)=>{
                if(currentlyEditing.find(setting.id)){
                    return (
                        this._buildInputValueField(setting.id, setting.name)
                    )
                } else {
                    return (<span>{setting.name}</span>);
                }
            }
        },
        {
            title: "Edit",
            dataIndex: '',
            render: (text,setting)=> {
                if(currentlyEditing.find(setting.id)){
                    <Button 
                        data-setting-id={setting.id}
                        onClick={this._handleSaveButtonPress.bind(this)}>Save</Button>        
                } else {
                    return (
                        <a onClick={this._handleEditSettingClick.bind(this)}
                            data-setting-id={setting.id}>
                            <Icon type={"edit"} />
                        </a>
                    );
                }
            }
        },
        {
            title: "Delete",
            dataIndex: '',
            render: (text,setting)=> {
                if(currentlyEditing.find(setting.id)){
                    
                } else {
                    return (
                        <a onClick={this._handleDeleteSettingClick.bind(this)}
                            data-setting-id={setting.id}>
                            <Icon type={"trash"} />
                        </a>
                    );
                }
            }
        }];

        return (
            <Table columns={columns} 
                       dataSource={directories} 
                       pagination={false} 
                       size="small"
                       />
        );
    }

    render() {
        const { dirModalIsVisible } = this.state;

        return (
            <div>
                <div className="ib-settings-dir-list">
                    {this._buildDirectoriesTable()}
                </div>
                {this._buildSettingAddForm()}
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

const mapStateToProps = (state)=>{
    return {};
}

const mapDispatchToProps = (dispatch)=>{
    return {
        saveSetting: (settingID, key, value)=>dispatch(saveSetting(settingID, 'directories', key, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoriesEditor);