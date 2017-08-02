import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Checkbox, Icon, Spin, Table } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';
import { socketClient } from '../../store';

import FileDetails from './FileDetails';

class FilesystemBrowser extends Component {
    PARENT_DIR_NAME = "..";

    static propTypes = {
        forceReload: PropTypes.bool,
        hasCheckboxes: PropTypes.bool,
        basePath: PropTypes.string.isRequired,
        currentPath: PropTypes.string,
        lockToBasePath: PropTypes.bool,
        onChangeDirectory: PropTypes.func,
        parentHandleSelectChange: PropTypes.func,
        selectedRowKeys: PropTypes.array,
        serverInfo: PropTypes.object.isRequired,
        showDirectories: PropTypes.bool,
        showFiles: PropTypes.bool
    };

    static defaultProps = {
        actionColumns: [],
        currentPath: "",
        forceReload: false,
        hasCheckboxes: false,
        lockToBasePath: true,
        onChangeDirectory: ()=>{},
        parentHandleSelectChange: ()=>{},
        selectedRowKeys: [],
        showDirectories: true,
        showFiles: true,
    }

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            currentPath: "",
            dirList: [],
            showHidden: false
        };
    }

    componentWillMount(){
        let currentPath = this.props.basePath;
        if(this.props.currentPath !== ""){
            currentPath = this.props.currentPath;
        } 

        this._getDirFromServer(currentPath, this.props.basePath);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.forceReload){
            this._reloadDir();
        }

        if(nextProps.currentPath !== "" && nextProps.currentPath !== this.state.currentPath){
            this._getDirFromServer(nextProps.currentPath, this.props.basePath);
        } else if(nextProps.basePath !== this.props.basePath){
            this._getDirFromServer(nextProps.basePath, nextProps.basePath);
        }
    }

    _reloadDir(){
        this._getDirFromServer(this.state.currentPath, this.props.basePath);
    }

    _getDirFromServer(fullPath, basePath){
        const { emitAPIRequest } = this.props;

        const options = {
            base_path: basePath,
            full_path: fullPath
        };

        emitAPIRequest("filesystem.dir.get", options, this._dirListReceived.bind(this), false);

        this.setState({
            isLoading: true
        });
    }

    _dirListReceived(newDirList, recd){
        const { onChangeDirectory } = this.props;

        const newPath = recd.request.params.full_path;

        const dirList = this._prepareDirList(newDirList, newPath);

        //Notify the parent components of a directory change
        onChangeDirectory(newPath, dirList);

        this.setState({
            currentPath: newPath,
            dirList,
            isLoading: false
        });
    }

    _prepareDirList(dirList, newPath){
        const { basePath, lockToBasePath, showDirectories, showFiles } = this.props;
        const { showHidden } = this.state;

        let directories = [];
        let files = [];

        const parentDirectory = {
            key: 0,
            name: this.PARENT_DIR_NAME,
            isDirectory: true,
            size: "",
            assocData: {}
        };

        if( !lockToBasePath || ( lockToBasePath && (basePath !== newPath) ) ){
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
                    size: this._humanFileSize(item.size, false),
                    assocData: item.assocData
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

    _handleDirClick(nextDirName){
        const { serverInfo, basePath } = this.props;
        const { pathSeparator } = serverInfo;
        const { currentPath } = this.state;

        let newPath = currentPath;
        if(nextDirName === this.PARENT_DIR_NAME){
            const pathParts = currentPath.split(pathSeparator);
            pathParts.pop();
            newPath = pathParts.join(pathSeparator);
            
            if(newPath === ""){
                newPath = pathSeparator;
            }
        } else {
            if(currentPath === pathSeparator){
                // Don't concat additional / when at linux root "/"
                newPath = currentPath + nextDirName;
            } else {
                newPath = currentPath + pathSeparator + nextDirName;
            }
        }

        this._getDirFromServer(newPath, basePath);
    }

    _buildColumns(){
        const { basePath } = this.props;
        const { currentPath } = this.state;

        return [
            {
                title: "Name",
                dataIndex: "name",
                render: (text, record) => {
                    if (record.isDirectory) {
                        let iconType = "folder";
                        if(record.name === this.PARENT_DIR_NAME){
                            iconType = "arrow-up";
                        }
                        return (
                            <a href="javascript:void(0);"
                                onClick={this._handleDirClick.bind(this, record.name)}>
                                <Icon type={iconType} />&nbsp;&nbsp;{record.name}
                            </a>
                        )
                    } else {
                        return (<FileDetails 
                                    assocData={record.assocData}
                                    filename={record.name} 
                                    basePath={basePath} 
                                    fullPath={currentPath} />);
                    }
                }
            },
            {
                title: "Size",
                dataIndex: "size"
            }
        ];
    }

    _buildLoadingBox(){
        return (
            <div className="ib-filebrowser-spin-box">
                <Spin />
                <br/>Loading directory list...
            </div>
        );
    }

    _buildTable(){
        const { 
            actionColumns,
            hasCheckboxes,
            parentHandleSelectChange,
            selectedRowKeys
        } = this.props;

        const { 
            currentPath,
            dirList,
            isLoading
        } = this.state;

        const rows = dirList;

        let columns = [...this._buildColumns(), ...actionColumns];

        let rowSelection = {};
        if(hasCheckboxes){
            rowSelection = {
                selectedRowKeys,
                onChange: parentHandleSelectChange
            };
        }

        const locale = {
            emptyText: "Empty directory."
        }

        
        return (
            <Table 
                columns={columns} 
                dataSource={rows} 
                pagination={false} 
                size="small"
                title={()=> {
                    return (
                        <span>
                            <Button icon="reload" onClick={this._reloadDir.bind(this)}></Button>
                            <span className="ib-filebrowser-current-path">{currentPath}</span>
                        </span>
                    )
                }}
                rowSelection={rowSelection}
                locale={locale}
            />
        );
        
    }

    render() {
        const { isLoading } = this.state;
        let displayComponent = ( isLoading ) ? this._buildLoadingBox() : this._buildTable();
        
        return (
            <div>
                {displayComponent}
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