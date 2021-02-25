import PropTypes from "prop-types";
import React, { Component } from "react";

import { Button, Grid, TextField, CircularProgress } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import MediaItemSearchDetails from "../../shared/MediaItemSearchDetails";

class ShowResults extends Component {
    static propTypes = {
        currentSearchString: PropTypes.string.isRequired,
        onAddShowComplete: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.INITIAL_STATE = {
            currentSearchString: props.currentSearchString,
            isIDing: false,
            shows: [],
        };

        this.state = this.INITIAL_STATE;
    }

    componentWillMount() {
        if (this.state.currentSearchString !== "") {
            this._getSearchResultsFromServer();
        }

        this.setState(this.INITIAL_STATE);
    }

    _handleSelectMovie(show, imageURL) {
        const { callAPI } = this.props;

        this.setState({
            isIDing: true,
        });

        const options = {
            show_info: show,
            image_info: {
                url: imageURL,
            },
        };

        callAPI("id.show.add", options, this._idShowComplete.bind(this), false);
    }

    _idShowComplete(recd) {
        const { onAddShowComplete } = this.props;

        onAddShowComplete();
    }

    _handleChangeSearchInput(evt) {
        this.setState({
            currentSearchString: evt.currentTarget.value,
        });
    }

    _handleSearchPress() {
        this._getSearchResultsFromServer();
    }

    _getSearchResultsFromServer() {
        const { currentSearchString } = this.state;
        const { callAPI } = this.props;

        const options = {
            search_string: currentSearchString,
        };

        callAPI(
            "mediascraper.shows.search",
            options,
            this._searchResultsReceived.bind(this),
            false
        );
    }

    _searchResultsReceived(results) {
        this.setState({
            shows: results,
        });
    }

    _buildSearchResults() {
        const { currentSearchString, shows } = this.state;

        let showList = [];
        let count = 0;
        shows.forEach((show) => {
            const showDetails = (
                <MediaItemSearchDetails
                    key={show.ids.trakt}
                    item={show}
                    onSelectItem={this._handleSelectMovie.bind(this)}
                    resultNumber={count}
                />
            );

            showList.push(showDetails);
            count++;
        });

        return (
            <Grid container>
                <Grid item xs={12} className="ib-showmodal-search-topbar">
                    <TextField
                        onChange={this._handleChangeSearchInput.bind(this)}
                        // onSearch={this._handleSearchPress.bind(this)}
                        value={currentSearchString}
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
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    alignContent="center"
                    justify="center"
                    spacing={2}
                >
                    {showList}
                </Grid>
            </Grid>
        );
    }

    _buildAddingShow() {
        return (
            <div className="ib-spinner-container">
                <CircularProgress />
                <br />
                Adding show. This could take a while...
            </div>
        );
    }

    render() {
        const { isIDing } = this.state;

        let contents = this._buildAddingShow();

        if (!isIDing) {
            contents = this._buildSearchResults();
        }

        return <div>{contents}</div>;
    }
}

ShowResults.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default ShowResults;
