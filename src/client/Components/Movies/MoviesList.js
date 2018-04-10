import { truncate } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Col, Icon, Input, Row, Select, Spin } from "antd";
const Option = Select.Option;

import MovieInfoModal from "./MovieInfoModal";
import MovieThumbInfo from "./MovieThumbInfo";
import { STATUS_TAGS, StatusTagsLib } from "../../lib/StatusTags.lib";

import { emitAPIRequest } from "../../actions/api.actions";

class MoviesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: "",
            currentStatusTagSelected: "all",
            infomodalIsVisible: false,
            infomodalMovie: {},
            isLoadingMovies: false,
            movies: []
        };
    }

    componentWillMount() {
        this._getMovies();
    }

    _getMovies() {
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingMovies: true
        });

        emitAPIRequest(
            "movies.movies.get_all_with_file_info",
            {},
            this._moviesReceived.bind(this),
            false
        );
    }

    _moviesReceived(movies) {
        let processedMovies = [];
        movies.forEach(movie => {
            // Add properties to each movie
            movie["is_visible"] = true;
            movie["searchable_text"] = this._prepStringForFilter(movie.title);
            processedMovies.push(movie);
        });

        this.setState({
            movies: processedMovies,
            isLoadingMovies: false
        });
    }

    _handleClickMovie(movie) {
        this.setState({
            infomodalIsVisible: true,
            infomodalMovie: movie
        });
    }

    _handleCloseModal(shouldReload = false) {
        this.setState({
            infomodalIsVisible: false,
            infomodalMovie: {}
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
        const { emitAPIRequest } = this.props;

        const params = {
            movie_id: movie.id
        };

        emitAPIRequest(
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

        const filteredMovies = movies.filter(movie => {
            return movie.id !== movieId;
        });

        this.setState({
            movies: filteredMovies
        });
    }

    _handlePressToggleStatusTag(movie, tagToToggle) {
        const { emitAPIRequest } = this.props;

        const statusTagsLib = new StatusTagsLib();

        const params = {
            movie_id: movie.id,
            status_tags: statusTagsLib.toggleTag(movie.status_tags, tagToToggle)
        };

        emitAPIRequest(
            "movies.movie.update_status_tags",
            params,
            this._toggleStatusTagComplete.bind(this, movie),
            false
        );
    }

    _toggleStatusTagComplete(oldMovie, newMovie) {
        const { infomodalIsVisible, infomodalMovie, movies } = this.state;

        let newInfomodalMovie = {};
        const updatedMovies = movies.map(movie => {
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
            movies: updatedMovies
        });
    }

    _handleChangeFilter(evt) {
        const { currentStatusTagSelected } = this.state;

        const currentSearchString = evt.currentTarget.value;

        this.setState({
            currentSearchString
        });
    }

    _handleChangeStatusTagFilter(tag) {
        const { currentSearchString } = this.state;

        this.setState({
            currentStatusTagSelected: tag
        });
    }

    _filterMovies() {
        const {
            currentSearchString,
            currentStatusTagSelected,
            movies
        } = this.state;

        const filterText = this._prepStringForFilter(currentSearchString);

        let filteredMovies = [];
        movies.forEach(movie => {
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
        filteredMovies.forEach(movie => {
            if (movie.is_visible) {
                movieList.push(
                    <Col
                        key={movie.id}
                        className="ib-movies-thumbnail-box"
                        span={4}
                    >
                        <MovieThumbInfo
                            movie={movie}
                            directories={this.props.directories}
                            onClickDelete={this._handlePressDelete.bind(this)}
                            onClickMovie={this._handleClickMovie.bind(this)}
                            onClickToggleStatusTag={this._handlePressToggleStatusTag.bind(
                                this
                            )}
                        />
                    </Col>
                );
            }
        });

        return movieList;
    }

    _buildStatusTagFilterSelect() {
        const { currentStatusTagSelected } = this.state;

        let selectOptions = [
            <Option key="all" value="all">
                All
            </Option>
        ];

        for (let tag of STATUS_TAGS) {
            selectOptions.push(
                <Option key={tag.tag} value={tag.tag}>
                    <Icon type={tag.icons.active} />&nbsp;
                    {tag.title}
                </Option>
            );
        }
        return (
            <Select
                className="ib-movies-selectstatustag"
                defaultValue={currentStatusTagSelected}
                onChange={this._handleChangeStatusTagFilter.bind(this)}
            >
                {selectOptions}
            </Select>
        );
    }

    render() {
        const {
            currentSearchString,
            infomodalIsVisible,
            infomodalMovie,
            isLoadingMovies,
            movies
        } = this.state;

        let content = "";
        if (isLoadingMovies) {
            content = (
                <div className="ib-spinner-container">
                    <Spin />
                </div>
            );
        } else {
            content = this._buildMovieList();
        }

        const filterPlaceholder = `Filter ${movies.length} movies...`;
        const filterSelect = this._buildStatusTagFilterSelect();
        return (
            <div>
                <Row>
                    <h2>Movies</h2>
                </Row>
                <Row className="ib-movies-searchbar">
                    <Input.Search
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        style={{ width: 400 }}
                        onSearch={this._handleChangeFilter.bind(this)}
                        placeholder={filterPlaceholder}
                    />
                    {filterSelect}
                </Row>
                <Row>{content}</Row>
                <MovieInfoModal
                    onClickDelete={this._handlePressDelete.bind(this)}
                    onClose={this._handleCloseModal.bind(this)}
                    movie={infomodalMovie}
                    isVisible={infomodalIsVisible}
                    onClickToggleStatusTag={this._handlePressToggleStatusTag.bind(
                        this
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { settings } = state;
    return {
        directories: settings.settings.directories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch) =>
            dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
