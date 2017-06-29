import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, Table } from 'antd';

import { getDirList } from '../actions/filesystem.actions';

class FilesystemBrowser extends Component {
    static propTypes = {
        parentDir: PropTypes.string.isRequired
    };

    static defaultProps = {
        dirList: []
    }

    componentWillMount(){
        this.props.getDirList(this.props.parentDir);
    }

    _directoriesFirst(dirList){
        let directories = [];
        let files = [];
        dirList.forEach((item)=>{
            const newItem = {
                ...item,
                key: item.ino
            };
            if(newItem.isDirectory){
                directories.push(newItem);
            } else {
                files.push(newItem);
            }
        });
        return [...directories, ...files];
    }

    _handleDirClick(e){
        const newParentDir = e.target.getAttribute("data-directory-name");

        this.props.getDirList(this.props.parentDir)
    }

    render() {
        const {dirList} = this.props;
        const rows = this._directoriesFirst(dirList);
        const columns = [{
            title: "Name",
            dataIndex: "name",
            render: (text, record)=>{
                if(record.isDirectory){
                    return (
                        <a href="javascript:void(0);" 
                           onClick={this._handleDirClick.bind(this)} 
                           data-directory-name={record.name}
                           >
                        <Icon type={"folder"} />&nbsp;&nbsp;{record.name}
                        </a>
                    )
                } else {
                    return (<span>{record.name}</span>);
                }
            }
        }, 
        {
            title: "Size",
            dataIndex: "size"
        }];
        return (
            <div>
                <h4>File Browser</h4>
                <Table columns={columns} dataSource={rows} pagination={false}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { filesystem } = state;

    return {
        dirList: filesystem.dirList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDirList: (parentDir) => dispatch(getDirList(parentDir))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesystemBrowser);