import React, { Component } from 'react';

import { Button, Icon } from 'antd';

import { connect } from 'react-redux';

import { emitAPIRequest } from '../actions/api.actions';
class VideoPlayerRemote extends Component {

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

    constructor(props){
        super(props);

        this.state = {
            activeCmd: ""
        };
    }

    _handlePressCmd(cmd){
        const { emitAPIRequest } = this.props;

        emitAPIRequest("videoplayer.cmd." + cmd, {}, this._sendCommandComplete.bind(this), false);

        this.setState({
            activeCmd: cmd
        });
    }

    _sendCommandComplete(){
        console.log(this.state.activeCmd+" sent!");
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
        let revButtons = this._buildButtonSet('reverse');
        let playpauseButtons = this._buildPlayPauseButton();
        let forwardButtons = this._buildButtonSet('forward');
        let closeButton = this._buildButtonSet('close');
        return (
            <div>
                <Button.Group>
                    {revButtons}
                    {playpauseButtons}
                    {forwardButtons}
                </Button.Group>
                &nbsp;{closeButton}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return { }
};

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerRemote);