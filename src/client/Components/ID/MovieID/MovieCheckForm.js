import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

import MovieNameLib from "../../../lib/MovieName.lib";

class MovieCheckForm extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        onSearchMovies: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            checkedMovieNames: [],
            searchString: "",
        };

        this.movieNameLib = new MovieNameLib();
    }

    _handleClickMovieCheck(name) {
        const { checkedMovieNames } = this.state;

        const possibleNameIndex = checkedMovieNames.indexOf(name);
        if (possibleNameIndex > -1) {
            checkedMovieNames.splice(possibleNameIndex, 1);
        } else {
            checkedMovieNames.push(name);
        }

        this.setState({
            checkedMovieNames,
            searchString: checkedMovieNames.join(" "),
        });
    }

    _handleChangeSearchText(evt) {
        this.setState({
            searchString: evt.target.value,
        });
    }

    render() {
        const { currentFilename, onSearchMovies } = this.props;
        const { checkedMovieNames, searchString } = this.state;

        const possibleNames = this.movieNameLib.getUsefulMovieNameParts(
            currentFilename
        );

        let possibleChecks = [];
        possibleNames.forEach((name) => {
            const checkBox = (
                <div key={name} className="idmodal-movie-checksearch-option">
                    <Checkbox
                        onChange={this._handleClickMovieCheck.bind(this, name)}
                    />
                    {name}
                </div>
            );
            possibleChecks.push(checkBox);
        });

        return (
            <div className="idmodal-movie-checksearch-wrapper">
                <TextField
                    style={{ width: "90%" }}
                    placeholder="Movie to search for..."
                    value={searchString}
                    onChange={this._handleChangeSearchText.bind(this)}
                />
                <div className="idmodal-movie-checksearch-checks-wrapper">
                    {possibleChecks}
                </div>
                <div align="right">
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => onSearchMovies(searchString)}
                    >
                        Search for Movie
                    </Button>
                </div>
            </div>
        );
    }
}

export default MovieCheckForm;
