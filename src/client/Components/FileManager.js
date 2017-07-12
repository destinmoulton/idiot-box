import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon, Button, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';

class FileManager extends Component {
    INITIAL_PATH = "/home/destin/Downloads/idiot-box-sandbox";
    VIDEO_FILE_REGX = /(\.mp4|\.mkv|\.avi)$/;
    constructor(props){
        super(props);

        this.state = {
            currentPath: this.INITIAL_PATH,
            dirList: [],
            isReloading: false,
            selectedRows: []
        };
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

    _handleSelectionChange(selectedRows){
        this.setState({
            selectedRows
        });
    }

    _handleClickDelete(evt){
        const item = evt.currentTarget.getAttribute('data-item-name');
        
        console.log("Delete Clicked", item);
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
                           onClick={this._handleClickDelete.bind(this)}
                           data-item-name={record.name}>
                           <Icon type="delete"/>
                        </a>
                    );
                }
            }
        ];
    }

    render() {
        const { isReloading, selectedRows } = this.state;

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
                        <Button type="danger" icon="delete" disabled={buttonDisabled}>Trash</Button>
                    </Button.Group>
                </div>
                <FilesystemBrowser 
                    actionColumns={this._buildActionColumns()}
                    forceReload={isReloading}
                    hasCheckboxes={true}
                    initialPath={this.INITIAL_PATH}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    parentHandleSelectChange={this._handleSelectionChange.bind(this)}
                    selectedRowKeys={selectedRows}
                    showDirectories={true}
                    showFiles={true}
                />
            </div>
        );
    }
}

export default FileManager;