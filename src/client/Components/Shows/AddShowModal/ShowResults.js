import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

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
            <Grid container spacing={3}>
                <Grid item xs={12} id="ib-showmodal-searbox">
                    <TextField
                        autoFocus
                        enterButton
                        onChange={this._handleChangeSearchInput.bind(this)}
                        // onSearch={this._handleSearchPress.bind(this)}
                        value={currentSearchString}
                    />
                </Grid>
                <Grid container>{showList}</Grid>
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

        let contents = "";

        if (isIDing) {
            contents = this._buildAddingShow();
        } else {
            contents = this._buildSearchResults();
        }

        return <div>{contents}</div>;
    }
}

ShowResults.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default ShowResults;
