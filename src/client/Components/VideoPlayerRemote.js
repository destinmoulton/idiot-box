import React, { Component } from 'react';

import { Button } from 'antd';

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
        this.setState({
            activeCmd: cmd
        });
        console.log(cmd+" pressed!");
    }

    _buildButtonSet(buttonSection){
        const { activeCmd, isPlaying } = this.state;

        const buttonSet = this.BUTTONS[buttonSection];

        let buttons = [];
        buttonSet.forEach((but)=>{
            let className = "";
            if(activeCmd === but.cmd){
                className = this.BUTTON_ACTIVE_CLASS;
            }

            buttons.push(
                <Button 
                    className={className}
                    icon={but.icon}
                    key={but.cmd}
                    onClick={this._handlePressCmd.bind(this, but.cmd)}></Button>
            );
        });
        return buttons;
    }

    render() {
        let revButtons = this._buildButtonSet('reverse');
        let forwardButtons = this._buildButtonSet('forward');
        return (
            <div>
                <Button.Group>
                    {revButtons}
                    {forwardButtons}
                </Button.Group>
            </div>
        );
    }
}

export default VideoPlayerRemote;