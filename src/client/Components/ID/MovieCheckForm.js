import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { 
    Checkbox,
    Input
} from 'antd';

class MovieCheckForm extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        onSearchMovies: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            checkedMovieNames: [],
            searchString: ""
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
            checkedMovieNames,
            searchString: checkedMovieNames.join(" ")
        });
    }

    _handleChangeSearchText(evt){
        this.setState({
            searchString: evt.target.value
        })
    }

    render() {
        const { currentFilename, onSearchMovies } = this.props;
        const { checkedMovieNames, searchString } = this.state;

        const possibleNames = currentFilename.split(".");

        let possibleChecks = [];
        possibleNames.forEach((name)=>{
            const checkBox = <div key={name} ><Checkbox onChange={this._handleClickMovieCheck.bind(this,name)}>{name}</Checkbox></div>
            possibleChecks.push(checkBox);
        });

        return (
            <div>
                <Input.Search 
                    placeholder="Movie search..." 
                    value={searchString}
                    onSearch={onSearchMovies}
                    onChange={this._handleChangeSearchText.bind(this)}
                />
                <div>
                    {possibleChecks}
                </div>
            </div>
        );
    }
}

export default MovieCheckForm;