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

    _movieFilenameToCleanArray(filename){
        const unwantedFormats = ['avi', 'ac3', 'aac', 'hevc', 'mkv', 'mp3', 'mp4', 'x264', 'x265'];
        const unwantedMedia = ['bluray', 'brrip', 'dvd', 'dvdr', 'dvdscr', 'hdrip', 'web', 'xvid'];
        const unwantedRes = ['480', '480p', '720', '720p', '1080', '1080p', '4k'];
        const unwanted = [...unwantedFormats, ...unwantedMedia, ...unwantedRes];

        // Make spaces into periods and split on periods
        const parts = filename
                        .replace(/[^\w]/g, " ")
                        .replace(/(\s+)/g, ".")
                        .split(".");

        return parts.filter((part)=>{
            return unwanted.indexOf(part.toLowerCase()) < 0;
        });;
    }

    render() {
        const { currentFilename, onSearchMovies } = this.props;
        const { checkedMovieNames, searchString } = this.state;
        
        const possibleNames = this._movieFilenameToCleanArray(currentFilename);

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