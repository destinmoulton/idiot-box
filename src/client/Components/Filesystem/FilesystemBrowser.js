import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Checkbox, Icon, Table } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';
import { socketClient } from '../../store';

class FilesystemBrowser extends Component {
    static propTypes = {
        dirList: PropTypes.array.isRequired,
        hasCheckboxes: PropTypes.bool.isRequired,
        initialPath: PropTypes.string.isRequired,
        lockToInitialPath: PropTypes.bool.isRequired,
        onChangeDirectory: PropTypes.func,
        parentHandleSelectChange: PropTypes.func,
        selectedRowKeys: PropTypes.array,
        serverInfo: PropTypes.object.isRequired,
        showDirectories: PropTypes.bool.isRequired,
        showFiles: PropTypes.bool.isRequired
    };

    static defaultProps = {
        actionColumns: [],
        dirList: [],
        hasCheckboxes: false,
        lockToInitialPath: true,
        onChangeDirectory: ()=>{},
        parentHandleSelectChange: ()=>{},
        showDirectories: true,
        showFiles: true,
    }

    constructor(props){
        super(props);

        this.state = {
            currentPath: props.initialPath,
            dirList: [],
            showHidden: false
        };
    }

    componentWillMount(){
        this._getDirFromServer(this.state.currentPath);
    }

    _getDirFromServer(path){
        const { emitAPIRequest } = this.props;

        const options = {
            path
        };
        
        emitAPIRequest("filesystem.dir.get", options, this._dirListReceived.bind(this), false);
    }

    _reloadDir(){
        this._getDirFromServer(this.state.currentPath);
    }

    _dirListReceived(dirList, recd){
        const { onChangeDirectory } = this.props;

        //Notify the parent components of a directory change
        onChangeDirectory(recd.request.params.path);

        this.setState({
            currentPath: recd.request.params.path,
            dirList
        });
    }

    _prepareDirList(dirList){
        const { initialPath, lockToInitialPath, showDirectories, showFiles } = this.props;
        const { currentPath, showHidden } = this.state;

        let directories = [];
        let files = [];

        const parentDirectory = {
            key: 0,
            name: "..",
            isDirectory: true,
            size: ""
        };
        if(lockToInitialPath){
            if(initialPath !== currentPath){
                directories.push(parentDirectory);
            }
        } else {
            directories.push(parentDirectory);
        }
        
        dirList.forEach((item)=>{
            let includeItem = true;
            if(!showHidden && item.name.startsWith('.')){
                includeItem = false;
            }

            if(includeItem){
                const newItem = {
                    ...item,
                    key: item.name,
                    size: this._humanFileSize(item.size, false)
                };
                if(newItem.isDirectory){
                    directories.push(newItem);
                } else {
                    files.push(newItem);
                }
            }
        });

        if(showDirectories && showFiles){
            return [...directories, ...files];
        } else if(!showDirectories && showFiles){
            return [...files];
        } else if(showDirectories && !showFiles){
            return [...directories];
        }
        return [];
    }

    _humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    _handleDirClick(e){
        const { serverInfo } = this.props;
        const { pathSeparator } = serverInfo;
        const { currentPath } = this.state;
        const desiredDir = e.target.getAttribute("data-directory-name");

        let newPath = currentPath;
        if(desiredDir === ".."){
            const pathParts = currentPath.split(pathSeparator);
            pathParts.pop();
            newPath = pathParts.join(pathSeparator);
            
            if(newPath === ""){
                newPath = pathSeparator;
            }
        } else {
            if(currentPath === pathSeparator){
                // Don't concat additional / when at linux root "/"
                newPath = currentPath + desiredDir;
            } else {
                newPath = currentPath + pathSeparator + desiredDir;
            }
        }

        this._getDirFromServer(newPath);
    }

    _buildColumns(){
        return [
            {
                title: "Name",
                dataIndex: "name",
                render: (text, record) => {
                    if (record.isDirectory) {
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
            }
        ];
    }

    render() {
        const { 
            actionColumns,
            hasCheckboxes,
            parentHandleSelectChange,
            selectedRowKeys
        } = this.props;

        const { 
            currentPath,
            dirList,
        } = this.state;

        const rows = this._prepareDirList(dirList);

        let columns = [...this._buildColumns(), ...actionColumns];

        let rowSelection = false;
        if(hasCheckboxes){
            rowSelection = {
                selectedRowKeys,
                onChange: parentHandleSelectChange
            };
        }

        return (
            <div>
                <Table 
                    columns={columns} 
                    dataSource={rows} 
                    pagination={false} 
                    size="small"
                    title={()=> {
                        return (
                            <span>
                                <Button icon="reload" onClick={this._reloadDir.bind(this)}></Button>&nbsp;{currentPath}
                            </span>
                        )
                    }}
                    rowSelection={rowSelection}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { server } = state;

    return {
        serverInfo: server.serverInfo
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesystemBrowser);