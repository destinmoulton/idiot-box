import PropTypes from "prop-types";
import React, { Component } from 'react';

import { Button, Icon, Modal } from 'antd';

import { connect } from 'react-redux';

import { callAPI } from '../actions/api.actions';
class VideoPlayerRemoteModal extends Component {

    BUTTONS = {
        reverse: [
            {
                title: "Back 30s",
                icon: "step-backward",
                cmd: "back30"
            },
            {
                title: "Rewind",
                icon: "backward",
                cmd: "rewind"
            }
        ],
        forward: [
            {
                title: "Fast Forward",
                icon: "forward",
                cmd: "fastFwd"
            },
            {
                title: "Forward 30s",
                icon: "step-forward",
                cmd: "fwd30"
            }
        ],
        close: [
            {
                title: "Close",
                icon: "close",
                cmd: "close"
            }
        ]
    };

    BUTTON_ACTIVE_CLASS = "ib-remote-button-active";

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired
    }

    constructor(props){
        super(props);

        this.state = {
            activeCmd: ""
        };
    }

    _handlePressCmd(cmd){
        const { callAPI } = this.props;

        callAPI("videoplayer.cmd." + cmd, {}, this._sendCommandComplete.bind(this), false);

        this.setState({
            activeCmd: cmd
        });
    }

    _sendCommandComplete(){
        console.log("VideoPlayerRemoteModal :: command sent :: " + this.state.activeCmd);
    }

    _buildButtonSet(buttonSection){
        const { activeCmd, isPlaying } = this.state;

        const buttonSet = this.BUTTONS[buttonSection];

        let buttons = [];
        buttonSet.forEach((but)=>{
            let className = "ib-remote-button ";
            if(activeCmd === but.cmd){
                className += this.BUTTON_ACTIVE_CLASS;
            }

            buttons.push(
                <Button 
                    className={className}
                    key={but.cmd}
                    onClick={this._handlePressCmd.bind(this, but.cmd)}>&nbsp;<Icon className="ib-remote-icon" type={but.icon}/></Button>
            );
        });
        return buttons;
    }

    _buildPlayPauseButton(){
        return (<Button 
                    className="ib-remote-button"
                    key="playpause"
                    onClick={this._handlePressCmd.bind(this, "play")}>
                    &nbsp;<Icon className="ib-remote-icon" type="caret-right"/>
                    &nbsp;/&nbsp;<Icon className="ib-remote-icon" type="pause"/>
                </Button>);
    }

    render() {
        const {
            isVisible,
            onCancel
        } = this.props;

        let revButtons = this._buildButtonSet('reverse');
        let playpauseButtons = this._buildPlayPauseButton();
        let forwardButtons = this._buildButtonSet('forward');
        let closeButton = this._buildButtonSet('close');
        return (
            <Modal
                title="ID Multiple Episodes"
                visible={isVisible}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" size="large" onClick={onCancel}>Close</Button>
                ]}
                width={700}
            >
                <div>
                    <Button.Group>
                        {revButtons}
                        {playpauseButtons}
                        {forwardButtons}
                    </Button.Group>
                    &nbsp;{closeButton}
                </div>
            </Modal>
        );
    }
}
const mapStateToProps = (state) => {
    return { }
};

const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch)=>dispatch(callAPI(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerRemoteModal);