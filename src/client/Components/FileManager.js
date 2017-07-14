import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, Button, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';
import TrashModal from './Filesystem/TrashModal';

import { getSettingsForCategory } from '../actions/settings.actions';

class FileManager extends Component {
    VIDEO_FILE_REGX = /(\.mp4|\.mkv|\.avi)$/;
    constructor(props){
        super(props);

        this.state = {
            currentToplevelDirectory: "",
            currentPath: "",
            dirList: [],
            isReloading: false,
            isTrashVisible: false,
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
        this.setState({
            currentPath: newDir,
            dirList,
            selectedRows: [],
            isReloading: false
        })
    }

    _handleSelectTopLevelDir(dir) {
        this.setState({
            currentToplevelDirectory: "",
            currentPath: ""
        });
        this.setState({
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
        console.log(itemsToTrash);

        this.setState({
            isTrashVisible: true,
            itemsToTrash
        });
    }

    _handleCancelTrash(){
        this.setState({
            isTrashVisible: false,
            itemsToTrash: []
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

    _buildActionColumns(){
        return [
            {
                title: "",
                dataIndex: "",
                render: (text,record)=>{
                    return (
                        <a href="javascript:void(0);"
                           onClick={this._handleClickTrash.bind(this)}
                           data-item-name={record.name}>
                           <Icon type="delete"/>
                        </a>
                    );
                }
            }
        ];
    }

    _buildFileManager(){
        const { 
            currentPath, 
            currentToplevelDirectory,
            isReloading,
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
                    onTrashComplete={()=>{}}
                    onCancel={this._handleCancelTrash.bind(this)}
                />
            </div>
        );
    }

    _buildDirectoryButtons(){
        const { toplevelDirectories } = this.props;

        const buttonList = [];
        toplevelDirectories.forEach((dir)=>{
            buttonList.push(<Button key={dir.key} onClick={this._handleSelectTopLevelDir.bind(this, dir)}>{dir.key}</Button>);
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