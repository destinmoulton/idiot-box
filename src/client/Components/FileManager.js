import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon, Button, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';

class FileManager extends Component {
    INITIAL_PATH = "/home/destin/Downloads/idiot-box-sandbox";
    constructor(props){
        super(props);

        this.state = {
            currentPath: this.INITIAL_PATH,
            selectedRows: []
        };
    }

    _handleChangeDirectory(newDir){
        
        this.setState({
            currentPath: newDir,
            selectedRows: []
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
        const { selectedRows } = this.state;
        console.log(selectedRows);
        const hasSelected = (selectedRows.length > 0) ? true : false;
        const buttonDisabled = !hasSelected;

        return (
            <div>
                &nbsp;
                <Button.Group>
                    
                    <Button type="primary" icon="search" disabled={buttonDisabled}>ID</Button>
                    <Button type="danger" icon="delete" disabled={buttonDisabled}>Delete</Button>
                </Button.Group>
                <FilesystemBrowser 
                    actionColumns={this._buildActionColumns()}
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