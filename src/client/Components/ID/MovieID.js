import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MovieArchive from './MovieArchive';
import MovieSearchResults from './MovieSearchResults';

class MovieID extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        currentPathInfo: PropTypes.object.isRequired,
        movieSearchString: PropTypes.string.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            currentMovieIDView: "movie_search_results",
            selectedMovie: {},
            selectedMovieImageURL: ""
        };
    }

    _handleSetSelectedMovie(movie, imageURL){
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
            currentFilename,
            currentPathInfo,
            movieSearchString,
            onIDComplete
        } = this.props;

        let contents = "";
        if(currentMovieIDView === "movie_search_results"){
            contents = <MovieSearchResults
                            currentFilename={currentFilename}
                            currentPathInfo={currentPathInfo}
                            initialSearchString={movieSearchString}
                            onSelectMovie={this._handleSetSelectedMovie.bind(this)}
                        />;
        } else {
            contents = <MovieArchive
                            currentFilename={currentFilename}
                            currentPathInfo={currentPathInfo}
                            movie={selectedMovie}
                            movieImageURL={selectedMovieImageURL}
                            onIDComplete={onIDComplete}
                        />;
        }
        return (
            <div>
                {contents}
            </div>
        );
    }
}

export default MovieID;