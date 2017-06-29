import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, Table } from 'antd';

import { getDirList } from '../actions/filesystem.actions';

import { socketClient } from '../store';

class FilesystemBrowser extends Component {
    static propTypes = {
        dirList: PropTypes.array.isRequired,
        initialPath: PropTypes.string.isRequired,
        serverInfo: PropTypes.object.isRequired,
        lockToInitialPath: PropTypes.bool.isRequired,
        showDirectories: PropTypes.bool.isRequired,
        showFiles: PropTypes.bool.isRequired
    };

    static defaultProps = {
        dirList: [],
        lockToInitialPath: true,
        showDirectories: true,
        showFiles: false
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
        const options = {
            path
        };
        
        socketClient.off('filesystem.dir.ready');
        socketClient.on('filesystem.dir.ready', (recd)=>{
                    this.setState({
                        currentPath: path,
                        dirList: recd
                    });
                });
        return socketClient.emit('filesystem.dir.list', options);
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
                    key: item.ino,
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
        } else {
            newPath = currentPath + pathSeparator + desiredDir;   
        }

        this._getDirFromServer(newPath);
    }

    render() {
        const {currentPath, dirList} = this.state;
        const rows = this._prepareDirList(dirList);
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
                <Table columns={columns} 
                       dataSource={rows} 
                       pagination={false} 
                       size="small"
                       title={()=> currentPath}/>
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

export default connect(mapStateToProps)(FilesystemBrowser);