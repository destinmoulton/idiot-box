import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, Button, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';
import IDFileModal from './ID/IDFileModal';
import TrashModal from './Filesystem/TrashModal';

import { getSettingsForCategory } from '../actions/settings.actions';

class FileManager extends Component {
    VIDEO_FILE_REGX = /(\.mp4|\.mkv|\.avi)$/;
    constructor(props){
        super(props);

        this.state = {
            currentToplevelDirSetting: {},
            currentToplevelDirectory: "",
            currentPath: "",
            currentPathInfo: {},
            dirList: [],
            idModalFilename: "",
            isReloading: false,
            isTrashVisible: false,
            isIDModalVisible: false,
            itemsToTrash: [],
            selectedRows: []
        };
    }

    componentWillMount(){
        this.props.getSettingsForCategory('directories');
    }

    _reloadDirList(){
        this.setState({
            isReloading: true
        });
    }

    _handleChangeDirectory(newDir, dirList){
        const { currentToplevelDirectory, currentPathInfo } = this.state;
        
        const subpath = newDir.slice(currentToplevelDirectory.length + 1);
        currentPathInfo.subpath = subpath;
        this.setState({
            currentPathInfo,
            currentPath: newDir,
            dirList,
            selectedRows: [],
            isReloading: false
        })
    }

    _handleSelectTopLevelDir(dir) {
        const pathInfo = {
            setting_id: dir.id,
            subpath: ""
        };
        this.setState({
            currentPathInfo: pathInfo,
            currentToplevelDirectory: dir.value,
            currentPath: dir.value
        });
    }

    _handleSelectionChange(selectedRows){
        this.setState({
            selectedRows
        });
    }

    _handleClickTrash(evt){
        let itemsToTrash = [];
        if(evt.currentTarget.tagName === "BUTTON"){
            itemsToTrash = [...this.state.selectedRows];
        } else {
            const item = evt.currentTarget.getAttribute('data-item-name');
            itemsToTrash = [item];
        }

        this.setState({
            isTrashVisible: true,
            itemsToTrash
        });
    }

    _handleTrashComplete(){
        this.setState({
            isReloading: true,
            isTrashVisible: false,
            itemsToTrash: []
        });
    }

    _handleCancelTrash(){
        this.setState({
            isTrashVisible: false,
            itemsToTrash: []
        });
    }

    _handleClickIDFile(filename){
        this.setState({
            idModalFilename: filename,
            isIDModalVisible: true
        });
    }

    _handleIDModalCancel(){
        this.setState({
            isIDModalVisible: false,
            idModalFilename: ""
        });
    }

    _handleIDModalComplete(){
        this.setState({
            isIDModalVisible: false,
            isReloading: true,
            idModalFilename: ""
        });
    }
    
    _handleSelectVideos(){
        const { dirList } = this.state;
        
        let selected = [];
        dirList.forEach((item)=>{
            if(item.name.search(this.VIDEO_FILE_REGX) > -1){
                selected.push(item.name);
            }
        });

        this.setState({
            selectedRows: selected
        });
    }

    _handleClickUntag(id, mediaType){

    }    

    _buildActionColumns(){
        
        return [
            {
                title: "",
                dataIndex: "",
                render: (text,record)=>{
                    const { assocData } = record;
                    
                    let tag = "";
                    if(record.name.search(this.VIDEO_FILE_REGX) > -1){
                        if(!'id' in assocData){
                            tag = <a href="javascript:void(0);"
                                        onClick={this._handleClickIDFile.bind(this, record.name)}>
                                        <Icon type="tag"/>
                                    </a>;
                        }
                    }
                    
                    let untag = "";
                    if('id' in assocData){
                        untag = <a href="javascript:void(0)"
                                onClick={this._handleClickUntag.bind(this, assocData.id, assocData.type)}>
                                    <Icon type="disconnect" className="ib-filebrowser-media-play"/>
                                </a>;
                    }
                    return (
                        <span>
                            <a  href="javascript:void(0);"
                                onClick={this._handleClickTrash.bind(this)}
                                data-item-name={record.name}>
                                <Icon type="delete"/>
                            </a>&nbsp;{tag}{untag}
                        </span>
                    );
                }
            }
        ];
    }

    _buildFileManager(){
        const { 
            currentPath, 
            currentPathInfo,
            currentToplevelDirectory,
            idModalFilename,
            isReloading,
            isIDModalVisible,
            isTrashVisible,
            itemsToTrash,
            selectedRows } = this.state;

        const hasSelected = (selectedRows.length > 0) ? true : false;
        const buttonDisabled = !hasSelected;

        return (
            <div>
                <div className="ib-filemanager-button-bar">
                    <Button 
                        type="primary"
                        icon="video-camera"
                        onClick={this._handleSelectVideos.bind(this)}
                    >Select Videos</Button>&nbsp;&nbsp;
                    <Button.Group>
                        <Button type="primary" icon="search" disabled={buttonDisabled}>ID</Button>
                        <Button 
                            type="danger"
                            icon="delete"
                            disabled={buttonDisabled}
                            onClick={this._handleClickTrash.bind(this)}
                        >Trash</Button>
                    </Button.Group>
                </div>
                <FilesystemBrowser 
                    actionColumns={this._buildActionColumns()}
                    forceReload={isReloading}
                    hasCheckboxes={true}
                    initialPath={currentToplevelDirectory}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    parentHandleSelectChange={this._handleSelectionChange.bind(this)}
                    selectedRowKeys={selectedRows}
                    showDirectories={true}
                    showFiles={true}
                />
                <TrashModal
                    currentPath={currentPath}
                    isVisible={isTrashVisible}
                    itemsToTrash={itemsToTrash}
                    onTrashComplete={this._handleTrashComplete.bind(this)}
                    onCancel={this._handleCancelTrash.bind(this)}
                />
                <IDFileModal
                    key={idModalFilename}
                    isVisible={isIDModalVisible}
                    onIDComplete={this._handleIDModalComplete.bind(this)}
                    onCancel={this._handleIDModalCancel.bind(this)}
                    currentFilename={idModalFilename}
                    currentPathInfo={currentPathInfo}
                    currentToplevelDirectory={currentToplevelDirectory}
                />
            </div>
        );
    }

    _buildDirectoryButtons(){
        const { toplevelDirectories } = this.props;
        const { currentToplevelDirectory } = this.state;

        const buttonList = [];
        toplevelDirectories.forEach((dir)=>{
            const activeClass = (dir.value === currentToplevelDirectory) ? "ib-filemanager-button ib-filemanager-button-active" : "ib-filemanager-button";
            buttonList.push(
                <Button 
                    key={dir.key} 
                    onClick={this._handleSelectTopLevelDir.bind(this, dir)}
                    className={activeClass}
                >{dir.key}</Button>
            );
        });

        return (<Button.Group>{buttonList}</Button.Group>);
    }

    render() {
        const { currentToplevelDirectory } = this.state;
        
        let directoryButtons = this._buildDirectoryButtons();
        let output = "";
        if(currentToplevelDirectory){
            output = this._buildFileManager();
        } 
        return (
            <div>
                <div>
                    {directoryButtons}
                </div>
                {output}
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { settings } = state;
    
    return {
        toplevelDirectories: settings.settings.directories
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getSettingsForCategory: (category)=>dispatch(getSettingsForCategory(category))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);