import PropTypes from "prop-types";
import React, { Component } from "react";
import { debounce } from "lodash";
import { Grid, CircularProgress, TextField } from "@material-ui/core";

import LetterBar from "./LetterBar";
import MovieInfoModal from "./MovieInfoModal";
import MovieThumbInfo from "./MovieThumbInfo";
import { STATUS_TAGS, StatusTagsLib } from "../../lib/StatusTags.lib";

class MoviesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: "",
            currentStatusTagSelected: "all",
            infomodalIsVisible: false,
            infomodalMovie: {},
            isLoadingMovies: false,
            isTyping: false, // Is the user typing in the filter box

            movies: [],
            selectedLetter: "All",
        };
    }

    componentDidMount() {
        this._getMovies("All");
    }

    _getMovies(startingLetter) {
        const { callAPI } = this.props;

        this.setState({
            isLoadingMovies: true,
        });

        let endpoint = "movies.movies.get_all_with_file_info";
        let params = {};
        if (startingLetter !== "All") {
            endpoint = "movies.movies.get_all_starting_with";
            params = { starting_letter: startingLetter };
        }

        callAPI(endpoint, params, this._moviesReceived.bind(this), false);
    }

    _moviesReceived(movies) {
        let processedMovies = [];
        movies.forEach((movie) => {
            // Add properties to each movie
            movie["is_visible"] = true;
            movie["searchable_text"] = this._prepStringForFilter(movie.title);
            processedMovies.push(movie);
        });

        this.setState({
            movies: processedMovies,
            isLoadingMovies: false,
        });
    }

    _handleClickMovie(movie) {
        this.setState({
            infomodalIsVisible: true,
            infomodalMovie: movie,
        });
    }

    _handleCloseModal(shouldReload = false) {
        this.setState({
            infomodalIsVisible: false,
            infomodalMovie: {},
        });

        if (shouldReload) {
            this._getMovies();
        }
    }

    _handlePressDelete(movie) {
        if (
            confirm(
                `Really delete ${movie.title}?\nThis will NOT remove the file.`
            )
        ) {
            this._deleteMovie(movie);
        }
    }

    _deleteMovie(movie) {
        const { callAPI } = this.props;

        const params = {
            movie_id: movie.id,
        };

        callAPI(
            "movies.movie.delete",
            params,
            this._movieDeleteComplete.bind(this, movie.id),
            false
        );
    }

    _movieDeleteComplete(movieId) {
        // Delete can be called from the modal (close it)
        this._handleCloseModal(false);

        const { movies } = this.state;

        const filteredMovies = movies.filter((movie) => {
            return movie.id !== movieId;
        });

        this.setState({
            movies: filteredMovies,
        });
    }

    _handlePressToggleStatusTag(movie, tagToToggle) {
        const { callAPI } = this.props;

        const statusTagsLib = new StatusTagsLib();

        const params = {
            movie_id: movie.id,
            status_tags: statusTagsLib.toggleTag(
                movie.status_tags,
                tagToToggle
            ),
        };

        callAPI(
            "movies.movie.update_status_tags",
            params,
            this._toggleStatusTagComplete.bind(this, movie),
            false
        );
    }

    _toggleStatusTagComplete(oldMovie, newMovie) {
        const { infomodalIsVisible, infomodalMovie, movies } = this.state;

        let newInfomodalMovie = {};
        const updatedMovies = movies.map((movie) => {
            if (movie.id === newMovie.id) {
                movie.status_tags = newMovie.status_tags;
                newInfomodalMovie = infomodalIsVisible
                    ? newMovie
                    : infomodalMovie;
            }
            return movie;
        });

        this.setState({
            infomodalMovie: newInfomodalMovie,
            movies: updatedMovies,
        });
    }

    _handleChangeFilter(evt) {
        const currentSearchString = evt.currentTarget.value;

        this.setState({
            isTyping: true,
            currentSearchString,
        });
        const debounced = debounce(() => {
            this.setState({
                isTyping: false,
            });
        }, 500);
        debounced();
    }

    _handleChangeStatusTagFilter(evt) {
        this.setState({
            currentStatusTagSelected: evt.currentTarget.value,
        });
    }

    _handleClickLetter(letter) {
        this.setState({
            selectedLetter: letter,
        });

        this._getMovies(letter);
    }

    _filterMovies() {
        const {
            currentSearchString,
            currentStatusTagSelected,
            movies,
        } = this.state;

        const filterText = this._prepStringForFilter(currentSearchString);

        let filteredMovies = [];
        movies.forEach((movie) => {
            if (filterText === "" && currentStatusTagSelected === "all") {
                movie.is_visible = true;
            } else {
                let hasFilterText = false;
                if (filterText === "") {
                    // Show all
                    hasFilterText = true;
                } else {
                    if (movie.searchable_text.includes(filterText)) {
                        hasFilterText = true;
                    }
                }

                let hasStatusTag = false;
                if (currentStatusTagSelected === "all") {
                    // Show all
                    hasStatusTag = true;
                } else {
                    if (
                        movie.status_tags !== null &&
                        movie.status_tags.includes(currentStatusTagSelected)
                    ) {
                        hasStatusTag = true;
                    }
                }

                movie.is_visible = hasFilterText && hasStatusTag;
            }

            filteredMovies.push(movie);
        });

        return filteredMovies;
    }

    _prepStringForFilter(title) {
        const lowerTitle = title.toLowerCase();
        return lowerTitle.replace(/[^a-z0-9]/g, "");
    }

    _buildMovieList() {
        const filteredMovies = this._filterMovies();
        let movieList = [];
        filteredMovies.forEach((movie) => {
            if (movie.is_visible) {
                movieList.push(
                    <MovieThumbInfo
                        key={movie.id}
                        movie={movie}
                        directories={this.props.settings.directories}
                        onClickDelete={this._handlePressDelete.bind(this)}
                        onClickMovie={this._handleClickMovie.bind(this)}
                        onClickToggleStatusTag={this._handlePressToggleStatusTag.bind(
                            this
                        )}
                    />
                );
            }
        });

        return movieList;
    }

    _buildStatusTagFilterSelect() {
        const { currentStatusTagSelected } = this.state;

        let selectOptions = [
            <option key="all" value="all">
                All
            </option>,
        ];

        for (let tag of STATUS_TAGS) {
            selectOptions.push(
                <option key={tag.tag} value={tag.tag}>
                    {tag.title}
                </option>
            );
        }
        return (
            <select
                className="ib-movies-selectstatustag"
                value={currentStatusTagSelected}
                onChange={this._handleChangeStatusTagFilter.bind(this)}
            >
                {selectOptions}
            </select>
        );
    }

    render() {
        const {
            currentSearchString,
            infomodalIsVisible,
            infomodalMovie,
            isLoadingMovies,
            isTyping,
            movies,
            selectedLetter,
        } = this.state;

        let content = "";
        if (isLoadingMovies || isTyping) {
            content = (
                <div className="ib-spinner-container">
                    <CircularProgress />
                </div>
            );
        } else {
            content = this._buildMovieList();
        }

        const filterPlaceholder = `Filter ${movies.length} movies...`;
        const filterSelect = this._buildStatusTagFilterSelect();
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Movies</h1>
                </Grid>
                <Grid item xs={12} className="ib-movies-searchbar">
                    <TextField
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        style={{ width: 250 }}
                        placeholder={filterPlaceholder}
                    />
                    {filterSelect}
                </Grid>
                <Grid item xs={12} className="ib-movies-letterbar">
                    <LetterBar
                        selectedLetter={selectedLetter}
                        onClick={this._handleClickLetter.bind(this)}
                    />
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    {content}
                </Grid>
                <MovieInfoModal
                    onClickDelete={this._handlePressDelete.bind(this)}
                    onClose={this._handleCloseModal.bind(this)}
                    movie={infomodalMovie}
                    isVisible={infomodalIsVisible}
                    onClickToggleStatusTag={this._handlePressToggleStatusTag.bind(
                        this
                    )}
                />
            </Grid>
        );
    }
}

MoviesList.propTypes = {
    settings: PropTypes.object.isRequired,
    callAPI: PropTypes.func.isRequired,
};

export default MoviesList;
