import PropTypes from "prop-types";
import React, { Component } from "react";

import MovieArchive from "./MovieArchive";
import MovieSearchResults from "./MovieSearchResults";

class MovieID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMovieIDView: "movie_search_results",
            selectedMovie: {},
            selectedMovieImageURL: ""
        };
    }

    _handleSetSelectedMovie(movie, imageURL) {
        this.setState({
            currentMovieIDView: "movie_archive",
            selectedMovie: movie,
            selectedMovieImageURL: imageURL
        });
    }

    render() {
        const {
            currentMovieIDView,
            selectedMovie,
            selectedMovieImageURL
        } = this.state;

        const {
            callAPI,
            currentFilename,
            currentPathInfo,
            movieSearchString,
            onIDComplete
        } = this.props;

        let contents = "";
        if (currentMovieIDView === "movie_search_results") {
            contents = (
                <MovieSearchResults
                    callAPI={callAPI}
                    currentFilename={currentFilename}
                    currentPathInfo={currentPathInfo}
                    initialSearchString={movieSearchString}
                    onSelectMovie={this._handleSetSelectedMovie.bind(this)}
                />
            );
        } else {
            contents = (
                <MovieArchive
                    callAPI={callAPI}
                    currentFilename={currentFilename}
                    currentPathInfo={currentPathInfo}
                    movie={selectedMovie}
                    movieImageURL={selectedMovieImageURL}
                    onIDComplete={onIDComplete}
                />
            );
        }
        return <div>{contents}</div>;
    }
}
MovieID.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    movieSearchString: PropTypes.string.isRequired,
    onIDComplete: PropTypes.func.isRequired
};

export default MovieID;
