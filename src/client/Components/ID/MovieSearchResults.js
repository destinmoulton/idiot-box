import PropTypes from "prop-types";
import React, { Component } from "react";

import { Input, Row } from "antd";

import MediaItemSearchDetails from "../shared/MediaItemSearchDetails";

class MovieSearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: props.initialSearchString,
            movies: []
        };
    }

    componentWillMount() {
        this._getSearchResultsFromServer();
    }

    _handleSelectMovie(movie, imageURL) {
        const { onSelectMovie } = this.props;

        onSelectMovie(movie, imageURL);
    }

    _handleSearchPress() {
        this._getSearchResultsFromServer();
    }

    _handleChangeSearchInput(evt) {
        this.setState({
            currentSearchString: evt.currentTarget.value
        });
    }

    _getSearchResultsFromServer() {
        const { currentSearchString } = this.state;
        const { callAPI } = this.props;

        const options = {
            search_string: currentSearchString
        };

        callAPI(
            "mediascraper.movies.search",
            options,
            this._searchResultsReceived.bind(this),
            false
        );
    }

    _searchResultsReceived(results) {
        this.setState({
            movies: results
        });
    }

    render() {
        const { currentFilename } = this.props;
        const { currentSearchString, movies } = this.state;

        let movieList = [];
        movies.forEach(movie => {
            const movieDetails = (
                <MediaItemSearchDetails
                    key={movie.ids.trakt}
                    item={movie}
                    onSelectItem={this._handleSelectMovie.bind(this)}
                />
            );

            movieList.push(movieDetails);
        });
        return (
            <div>
                <h4>Movie - Search Results</h4>
                <div id="ib-idmodal-movieresults-searchbox">
                    <Input.Search
                        value={currentSearchString}
                        onChange={this._handleChangeSearchInput.bind(this)}
                        style={{ width: 400 }}
                        onSearch={this._handleSearchPress.bind(this)}
                        enterButton
                    />
                </div>
                <Row>{movieList}</Row>
            </div>
        );
    }
}
MovieSearchResults.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    initialSearchString: PropTypes.string.isRequired,
    onSelectMovie: PropTypes.func.isRequired
};

export default MovieSearchResults;
