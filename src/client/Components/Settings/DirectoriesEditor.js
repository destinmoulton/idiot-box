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
    Spin,
    Table } from 'antd';

import DirectorySelectorModal from '../Filesystem/DirectorySelectorModal';

import { deleteSetting, saveSetting } from '../../actions/settings.actions';

const DEFAULT_INITIAL_DIR = "/";
const BLANK_DATA = {
    id:0,
    key:"",
    value: DEFAULT_INITIAL_DIR
};
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
            currentEditData:{}
        }
    }

    componentWillReceiveProps(nextProps){
        const { currentlyEditing, currentEditData } = this.state;
        const { lastAPIAction, lastSavedSettingID } = nextProps;


        if(lastAPIAction === "save"){
            const indexOfLastSave = currentlyEditing.indexOf(lastSavedSettingID);
            if(indexOfLastSave > -1){
                currentlyEditing.splice(indexOfLastSave, 1);
            }
            delete currentEditData[lastSavedSettingID];
        }
        
        this.setState({
            ...this.state,
            currentlyEditing,
            currentEditData
        });
    }

    _openDirectorySelector(evt) {
        const { currentEditData } = this.state;
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
                dirModalSettingID } = this.state;

        const settingID = dirModalSettingID;

        const newData = {...currentEditData[settingID]};
        newData['value'] = dirModalSelectedDirectory;
        this.setState({
            ...this.state,
            dirModalSettingID: -1,
            dirModalSelectedDirectory: DEFAULT_INITIAL_DIR,
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
        const { currentEditData } = this.state;
        const settingID = e.currentTarget.getAttribute("data-setting-id");
        if(currentEditData[settingID].key !== ""){
            const settingData = currentEditData[settingID];
            this.props.saveSetting(parseInt(settingID), settingData.key, settingData.value);
        }
    }

    _handleChangeSettingInput(e){
        const { currentEditData } = this.state;

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

    _handleEditSettingClick(e){
        const { currentlyEditing, currentEditData } = this.state;
        const { directories } = this.props;
        const settingID = parseInt(e.currentTarget.getAttribute('data-setting-id'));
        currentlyEditing.push(settingID);

        for(let i = 0; i<directories.length; i++){
            if(settingID === directories[i].id){
                currentEditData[settingID] = directories[i];
            }
        }
        
        this.setState({
            ...this.state,
            currentlyEditing,
            currentEditData
        });
    }

    _handleDeleteSettingClick(e){
        const settingID = parseInt(e.currentTarget.getAttribute('data-setting-id'));
        this.props.deleteSetting(settingID);
    }

    _buildInputNameField(settingID){
        const { saveInProgress } = this.props;
        const { currentEditData } = this.state;
        return (
            <Input 
                onChange={this._handleChangeSettingInput.bind(this)}
                data-setting-field={"key"}
                data-setting-id={settingID}
                value={currentEditData[settingID].key}
                disabled={true}
            />
        );
    }

    _buildInputValueField(settingID, currentValue){
        const { saveInProgress } = this.props;
        const { currentEditData } = this.state;
        return (
            <Input 
                addonAfter={<Icon type="folder" onClick={this._openDirectorySelector.bind(this)} data-setting-id={settingID} />} 
                onChange={this._handleChangeSettingInput.bind(this)}
                data-setting-field={"value"}
                data-setting-id={settingID}
                value={currentEditData[settingID].value}
                disabled={saveInProgress}
            />
        );
    }

    _buildSaveButton(settingID){
        const { saveInProgress } = this.props;
        if(saveInProgress){
            return (
                <Spin />
            );
        } else {
            return (
                <Button 
                    data-setting-id={settingID}
                    onClick={this._handleSaveButtonPress.bind(this)}>Save</Button>
            )
        }
    }

    _buildDirectoriesTable(){
        const { directories, saveInProgress } = this.props;
        const { currentlyEditing } = this.state;
        const columns = [{
            title: "Name",
            dataIndex: "key",
            render: (text, setting)=>{
                if(currentlyEditing.indexOf(setting.id)>-1){
                    return (
                        this._buildInputNameField(setting.id, setting.key)
                    )
                } else {
                    return (<span>{setting.key}</span>);
                }
            }
        }, 
        {
            title: "Directory",
            dataIndex: "value",
            render: (text, setting)=>{
                if(currentlyEditing.indexOf(setting.id)>-1){
                    return (
                        this._buildInputValueField(setting.id, setting.value)
                    )
                } else {
                    return (<span>{setting.value}</span>);
                }
            }
        },
        {
            title: "Edit",
            dataIndex: '',
            render: (text,setting)=> {
                if(currentlyEditing.indexOf(setting.id)>-1){
                    return this._buildSaveButton(setting.id);
                } else {
                    return (
                        <a onClick={this._handleEditSettingClick.bind(this)}
                            data-setting-id={setting.id}>
                            <Icon type={"edit"} />
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
                <DirectorySelectorModal 
                    initialPath={DEFAULT_INITIAL_DIR}
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