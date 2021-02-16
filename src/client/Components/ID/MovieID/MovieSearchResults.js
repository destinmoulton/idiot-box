import PropTypes from "prop-types";
import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";

import MediaItemSearchDetails from "../../shared/MediaItemSearchDetails";

class MovieSearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: props.initialSearchString,
            movies: [],
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
            currentSearchString: evt.currentTarget.value,
        });
    }

    _getSearchResultsFromServer() {
        const { currentSearchString } = this.state;
        const { callAPI } = this.props;

        const options = {
            search_string: currentSearchString,
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
            movies: results,
        });
    }

    render() {
        const { currentFilename } = this.props;
        const { currentSearchString, movies } = this.state;
        const numberToShow = 4;
        let movieList = [];
        let count = 0;
        movies.forEach((movie) => {
            if (count < numberToShow) {
                const movieDetails = (
                    <MediaItemSearchDetails
                        key={movie.ids.trakt}
                        item={movie}
                        onSelectItem={this._handleSelectMovie.bind(this)}
                        resultNumber={count}
                    />
                );

                movieList.push(movieDetails);
                count++;
            }
        });
        return (
            <Grid container>
                <Grid item xs={12} className="ib-idmodal-movieresults-topbar">
                    <h4>Movie - Search Results</h4>
                    <div className="ib-idmodal-movieresults-searchbox">
                        <TextField
                            value={currentSearchString}
                            onChange={this._handleChangeSearchInput.bind(this)}
                            variant="outlined"
                            size="small"
                            style={{ width: "250px" }}
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={this._handleSearchPress.bind(this)}
                            startIcon={<SearchIcon />}
                        >
                            Search
                        </Button>
                    </div>
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    alignItems="center"
                    alignContent="center"
                    justify="center"
                >
                    {movieList}
                </Grid>
            </Grid>
        );
    }
}
MovieSearchResults.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    initialSearchString: PropTypes.string.isRequired,
    onSelectMovie: PropTypes.func.isRequired,
};

export default MovieSearchResults;
