import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { 
    Checkbox,
    Input
} from 'antd';

class MovieCheckForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            checkedMovieNames: []
        };
    }

    _handleClickMovieCheck(name){
        const { checkedMovieNames } = this.state;

        const possibleNameIndex = checkedMovieNames.indexOf(name);
        if(possibleNameIndex > -1){
            checkedMovieNames.splice(possibleNameIndex, 1);
        } else {
            checkedMovieNames.push(name);
        }

        this.setState({
            checkedMovieNames
        });
    }

    render() {
        const { currentFilename } = this.props;
        const { checkedMovieNames } = this.state;

        const possibleNames = currentFilename.split(".");

        let possibleChecks = [];
        possibleNames.forEach((name)=>{
            const checkBox = <div key={name} ><Checkbox onChange={this._handleClickMovieCheck.bind(this,name)}>{name}</Checkbox></div>
            possibleChecks.push(checkBox);
        });

        return (
            <div>
                <div><h5>{currentFilename}</h5></div>
                <Input placeholder="Movie search..." value={checkedMovieNames.join(" ")} />
                <div>
                    {possibleChecks}
                </div>
            </div>
        );
    }
}

export default MovieCheckForm;