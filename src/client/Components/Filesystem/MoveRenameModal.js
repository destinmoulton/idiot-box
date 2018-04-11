import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Input, Modal } from 'antd';

import FilesystemBrowser from './FilesystemBrowser';

import { callAPI } from '../../actions/api.actions';

class MoveRenameModal extends Component {
    static propTypes = {
        initialPath: PropTypes.string.isRequired,
        isVisible: PropTypes.bool.isRequired,
        itemsToRename: PropTypes.array.isRequired,
        onCancel: PropTypes.func.isRequired,
        onRenameComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            destinationPath: "",
            isRenaming: false,
            itemsRenamed: {},
        };
    }

    componentWillReceiveProps(nextProps){
        const { itemsToRename } = nextProps;
        
        let itemsRenamed = {};
        itemsToRename.forEach((item)=>{
            itemsRenamed[item] = item;
        });

        this.setState({
            itemsRenamed
        });
    }

    _handleClickRename(){
        this._performRename();
    }

    _performRename(){
        const { callAPI, initialPath } = this.props;
        const { destinationPath, itemsRenamed } = this.state;

        this.setState({
            isRenaming: true
        });

        const params = {
            source_path: initialPath,
            dest_path: destinationPath,
            items_to_rename: itemsRenamed
        };

        callAPI("filesystem.rename.multiple", params, this._renameComplete.bind(this), false);
    }

    _renameComplete(){
        const { onRenameComplete } = this.props;

        this.setState({
            isRenaming: false
        });

        onRenameComplete();
    }

    _handleChangeDirectory(newPath){
        this.setState({
            destinationPath: newPath
        });
    }

    _handleChangeFilename(originalFilename, evt){
        const { itemsRenamed } = this.state;

        itemsRenamed[originalFilename] = evt.target.value;

        this.setState({
            itemsRenamed
        });
    }

    _buildRenameInputs(){
        const { itemsToRename } = this.props;
        const { itemsRenamed } = this.state;

        let inputList = [];
        itemsToRename.forEach((item)=>{
            const el = <div key={item}
                            className="ib-moverename-input-box">
                            <h5><u>Original:</u> {item}</h5>
                            <Input onChange={this._handleChangeFilename.bind(this, item)}
                                   value={itemsRenamed[item]}/>
                       </div>
            inputList.push(el);
        });

        return inputList;
    }

    render() {
        const {
            initialPath,
            isVisible,
            onCancel
        } = this.props;

        const posDim = {
            modalTop: 30,
            modalHeight: window.innerHeight - 180,
            modalWidth: window.innerWidth - 100,
            fileBrowserHeight: window.innerHeight - 450
        }
        
        const inputBoxes = this._buildRenameInputs();

        return (
            <div>
                <Modal
                    title="Move or Rename"
                    visible={isVisible}
                    onCancel={onCancel}
                    onOk={this._handleClickRename.bind(this)}
                    okText="Move or Rename"
                    cancelText="Cancel"
                    style={{top: posDim.modalTop, height:posDim.modalHeight}}
                    width={posDim.modalWidth}>
                        <div className="ib-moverename-dirsel-box" 
                            style={{height:posDim.fileBrowserHeight}}>
                            <h4>Destination Directory</h4>
                            <FilesystemBrowser 
                                basePath={initialPath}
                                lockToBasePath={false}
                                onChangeDirectory={this._handleChangeDirectory.bind(this)}
                                showDirectories={true}
                                showFiles={false}
                            />
                        </div>
                        <div className="ib-moverename-inputs-container">
                            <h4>Items to Rename</h4>
                            {inputBoxes}
                        </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch)=>dispatch(callAPI(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoveRenameModal);