import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon, Button, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';

class FileManager extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedRows: []
        };
    }

    _handleChangeDirectory(evt){
        this.setState({
            ...this.state,
            selectedRows: []
        })
    }

    _handleCheckboxSelection(selectedRows){
        
        this.setState({
            ...this.state,
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
        const hasSelected = (selectedRows.length > 0) ? true : false;
        const buttonDisabled = !hasSelected;
        const initialPath = "/home/destin/Downloads/idiot-box-sandbox"
        return (
            <div>
                <Button.Group>
                    <Button type="primary" icon="search" disabled={buttonDisabled}>ID</Button>
                    <Button type="danger" icon="delete" disabled={buttonDisabled}>Delete</Button>
                </Button.Group>
                <FilesystemBrowser 
                            actionColumns={this._buildActionColumns()}
                            initialPath={initialPath} 
                            onChangeDirectory={this._handleChangeDirectory.bind(this)}
                            showDirectories={true}
                            showFiles={true}
                            hasCheckboxes={true}
                            parentHandleSelectChange={this._handleCheckboxSelection.bind(this)}
                        />
            </div>
        );
    }
}

export default FileManager;