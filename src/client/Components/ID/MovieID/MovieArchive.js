import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";

import MovieNameLib from "../../../lib/MovieName.lib";

class MovieArchive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newMovieDirectory: "",
            newMovieFilename: "",
            isIDing: false,
        };

        this.movieNameLib = new MovieNameLib();
    }

    componentWillMount() {
        const { currentFilename, movie } = this.props;
        this.setState({
            newMovieDirectory: this.movieNameLib.getMovieTitleAndYear(movie),
            newMovieFilename: this.movieNameLib.getMovieFilename(
                currentFilename,
                movie
            ),
        });
    }

    _idAndArchiveMovie() {
        const {
            currentFilename,
            currentPathInfo,
            callAPI,
            movie,
            movieImageURL,
        } = this.props;

        const { newMovieDirectory, newMovieFilename } = this.state;

        this.setState({
            isIDing: true,
        });

        const options = {
            movie_info: movie,
            image_url: movieImageURL,
            source_info: {
                setting_id: currentPathInfo.setting_id,
                subpath: currentPathInfo.subpath,
                filename: currentFilename,
            },
            dest_info: {
                subpath: newMovieDirectory,
                filename: newMovieFilename,
            },
        };

        callAPI(
            "id.movie.id_and_archive",
            options,
            this._idMovieComplete.bind(this),
            false
        );
    }

    _idMovieComplete(recd) {
        const { onIDComplete } = this.props;

        onIDComplete();
    }

    _handleChangeFilename(evt) {
        this.setState({
            newMovieFilename: evt.target.value,
        });
    }

    _handleChangeDirectory(evt) {
        this.setState({
            newMovieDirectory: evt.target.value,
        });
    }

    _buildEpisodeForm() {
        const { newMovieDirectory, newMovieFilename } = this.state;

        const { movie } = this.props;

        return (
            <div>
                <div className="ib-idmodal-archivesingle-episodeinfo">
                    <div>{movie.title}</div>
                    <div>{movie.year}</div>
                </div>
                <div className="ib-idmodal-archivesingle-form-box">
                    <label>Directory:</label>
                    <br />
                    <input
                        name="movie-archive-single-directory"
                        onChange={this._handleChangeDirectory.bind(this)}
                        value={newMovieDirectory}
                    />
                    <label>Filename:</label>
                    <br />
                    <input
                        name="movie-archive-single-filename"
                        onChange={this._handleChangeFilename.bind(this)}
                        value={newMovieFilename}
                    />
                    <div className="ib-idmodal-button-box">
                        <Button
                            className="ib-button-green"
                            onClick={this._idAndArchiveMovie.bind(this)}
                        >
                            Archive Movie
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { isIDing } = this.state;

        let contents = "";
        if (isIDing) {
            contents = (
                <div className="ib-spinner-container">
                    <CircularProgress />
                    <br />
                    Adding Movie...
                </div>
            );
        } else {
            contents = this._buildEpisodeForm();
        }

        return <div>{contents}</div>;
    }
}

MovieArchive.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired,
    movieImageURL: PropTypes.string.isRequired,
    onIDComplete: PropTypes.func.isRequired,
};

export default MovieArchive;
