import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, Button, Menu, Modal } from 'antd';

import FilesystemBrowser from './Filesystem/FilesystemBrowser';
import IDFileModal from './ID/IDFileModal';
import IDMultipleEpisodesModal from './ID/IDMultipleEpisodesModal';
import TrashModal from './Filesystem/TrashModal';
import UntagModal from './ID/UntagModal';

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
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: [],
            idsingleFilename: "",
            idsingleIsModalVisible: false,
            isReloading: false,
            isTrashVisible: false,
            itemsToTrash: [],
            selectedRows: [],
            untagIsModalVisible: false,
            untagIDinfo: []
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
            idsingleFilename: filename,
            idsingleIsModalVisible: true
        });
    }

    _handleIDModalCancel(){
        this.setState({
            idsingleIsModalVisible: false,
            idsingleFilename: ""
        });
    }

    _handleIDModalComplete(){
        this.setState({
            isReloading: true,
            idsingleIsModalVisible: false,
            idsingleFilename: ""
        });
    }

    _handleClickIDMultipleEpisodes(){
        const { dirList } = this.state;

        const filenamesToID = [...this.state.selectedRows];

        const idItems = [];
        filenamesToID.forEach((filename)=>{
            dirList.forEach((item)=>{
                if(item.name === filename &&
                    item.name.search(this.VIDEO_FILE_REGX) > -1){
                    idItems.push(item);
                }
            })
        });

        if(idItems.length > 0){
            this.setState({
                idmultipleIsModalVisible: true,
                idmultipleEpisodes: idItems
            });
        }
    }

    _handleIDMultipleCancel(){
        this.setState({
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: []
        });
    }

    _handleIDMultipleComplete(){
        this.setState({
            isReloading: true,
            idmultipleIsModalVisible: false,
            idmultipleEpisodes: []
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

    _handleClickUntag(evt){
        const { dirList } = this.state;

        let filenamesToUntag = [];
        if(evt.currentTarget.tagName === "BUTTON"){
            filenamesToUntag = [...this.state.selectedRows];
        } else {
            const item = evt.currentTarget.getAttribute('data-item-name');
            filenamesToUntag = [item];
        }

        const untagItems = [];
        filenamesToUntag.forEach((filename)=>{
            dirList.forEach((item)=>{
                if(item.name === filename && item.assocData.hasOwnProperty('type')){
                    untagItems.push(item);
                }
            })
        });

        if(untagItems.length > 0){
            this.setState({
                untagIsModalVisible: true,
                untagIDinfo: untagItems
            });
        }
    }

    _handleUntagModalComplete(){
        this.setState({
            isReloading: true,
            untagIsModalVisible: false,
            untagIDinfo: []
        });
    }

    _handleUntagCancel(){
        this.setState({
            untagIsModalVisible: false,
            untagIDinfo: []
        });
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
                        if(!('type' in assocData)){
                            tag =   <a  href="javascript:void(0);"
                                        onClick={this._handleClickIDFile.bind(this, record.name)}>
                                        <Icon type="tag"/>
                                    </a>;
                        }
                    }
                    
                    let untag = "";
                    if('type' in assocData){
                        untag = <a  href="javascript:void(0);"
                                    onClick={this._handleClickUntag.bind(this)}
                                    data-item-name={record.name}>
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
            idmultipleIsModalVisible,
            idmultipleEpisodes,
            idsingleFilename,
            idsingleIsModalVisible,
            isReloading,
            isTrashVisible,
            itemsToTrash,
            selectedRows,
            untagIDinfo,
            untagIsModalVisible
        } = this.state;

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
                        <Button 
                            icon="tag"
                            disabled={buttonDisabled}
                            onClick={this._handleClickIDMultipleEpisodes.bind(this)}>ID Multiple</Button>
                        <Button 
                            type="danger"
                            icon="delete"
                            disabled={buttonDisabled}
                            onClick={this._handleClickTrash.bind(this)}
                        >Trash</Button>
                        <Button 
                            type="danger"
                            icon="disconnect"
                            disabled={buttonDisabled}
                            onClick={this._handleClickUntag.bind(this)}
                        >Remove ID</Button>
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
                    key={idsingleFilename}
                    isVisible={idsingleIsModalVisible}
                    onIDComplete={this._handleIDModalComplete.bind(this)}
                    onCancel={this._handleIDModalCancel.bind(this)}
                    currentFilename={idsingleFilename}
                    currentPathInfo={currentPathInfo}
                    currentToplevelDirectory={currentToplevelDirectory}
                />
                <IDMultipleEpisodesModal
                    currentPathInfo={currentPathInfo}
                    episodesToID={idmultipleEpisodes}
                    isVisible={idmultipleIsModalVisible}
                    onCancel={this._handleIDMultipleCancel.bind(this)}
                    onIDComplete={this._handleIDMultipleComplete.bind(this)}
                />
                <UntagModal
                    isVisible={untagIsModalVisible}
                    onUntagComplete={this._handleUntagModalComplete.bind(this)}
                    onCancel={this._handleUntagCancel.bind(this)}
                    itemsToUntag={untagIDinfo}
                />
            </div>
        );
    }

    _buildDirectoryMenu(){
        const { toplevelDirectories } = this.props;
        const { currentToplevelDirectory } = this.state;

        const menuList = [];
        toplevelDirectories.forEach((dir)=>{
            const activeClass = (dir.value === currentToplevelDirectory) ? "ib-filemanager-button ib-filemanager-button-active" : "ib-filemanager-button";
            menuList.push(
                <Menu.Item 
                    key={dir.value}>
                    <a href="javascript:void(0);"
                        onClick={this._handleSelectTopLevelDir.bind(this, dir)}>
                        {dir.key}
                    </a>
                </Menu.Item>
            );
        });

        return (<Menu mode="horizontal" selectedKeys={[currentToplevelDirectory]}>{menuList}</Menu>);
    }

    render() {
        const { currentToplevelDirectory } = this.state;
        
        let directoryMenu = this._buildDirectoryMenu();
        let output = "";
        if(currentToplevelDirectory){
            output = this._buildFileManager();
        } 
        return (
            <div>
                <div>
                    {directoryMenu}
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