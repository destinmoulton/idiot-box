import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import SelectSearch from "react-select-search";

import { callAPI } from "../../actions/api.actions";

class EpisodeIDSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentShowID: 0,
            currentSeasonID: 0,
            currentEpisodeID: 0,
            episodes: [],
            seasons: [],
            shows: [],
        };
    }

    componentWillMount() {
        this._getShows();
    }

    _getShows() {
        const { callAPI } = this.props;

        callAPI("shows.shows.get", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows) {
        this.setState({
            currentSeasonID: 0,
            currentEpisodeID: 0,
            shows,
            seasons: [],
            episodes: [],
        });
    }

    _getSeasons(showID) {
        const { callAPI } = this.props;

        this.setState({
            currentEpisodeID: 0,
            currentSeasonID: 0,
            currentShowID: parseInt(showID),
            seasons: [],
            episodes: [],
        });

        const options = {
            show_id: showID,
        };
        callAPI(
            "shows.seasons.get",
            options,
            this._seasonsReceived.bind(this),
            false
        );
    }

    _seasonsReceived(seasons) {
        this.setState({
            seasons,
        });
    }

    _getEpisodes(seasonID) {
        const { callAPI } = this.props;

        this.setState({
            currentSeasonID: parseInt(seasonID),
            currentEpisodeID: 0,
            episodes: [],
        });

        const options = {
            show_id: this.state.currentShowID,
            season_id: seasonID,
        };
        callAPI(
            "shows.episodes.get",
            options,
            this._episodesReceived.bind(this),
            false
        );
    }

    _episodesReceived(episodes) {
        this.setState({
            episodes,
        });
    }

    _handleSelectEpisode(episodeID) {
        this.setState({
            currentEpisodeID: parseInt(episodeID),
        });
    }

    _buildSelect(
        items,
        titleKey,
        onChange,
        defaultValue,
        prefix = "",
        searchable = false
    ) {
        let options = [];

        items.forEach((item) => {
            const optionValue = prefix + item[titleKey];
            options.push({ value: item.id.toString(), name: optionValue });
        });

        return (
            <SelectSearch
                options={options}
                placeholder="Select..."
                value={defaultValue.toString()}
                onChange={onChange}
                search={searchable}
                filterOptions={(input, option) => {
                    const toSearch = option.props.children;
                    return (
                        toSearch.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                }}
            >
                {options}
            </SelectSearch>
        );
    }

    _handleClickIDButton() {
        const { onIDEpisode } = this.props;
        const { currentShowID, currentSeasonID, currentEpisodeID } = this.state;

        const episodeInfo = {
            currentShowID,
            currentSeasonID,
            currentEpisodeID,
        };

        onIDEpisode(episodeInfo);
    }

    render() {
        const {
            currentShowID,
            currentSeasonID,
            currentEpisodeID,
            episodes,
            seasons,
            shows,
        } = this.state;

        const showSelector = this._buildSelect(
            shows,
            "title",
            this._getSeasons.bind(this),
            currentShowID,
            "",
            true
        );
        let seasonsSelector = "Select a show...";
        if (currentShowID > 0) {
            seasonsSelector = this._buildSelect(
                seasons,
                "season_number",
                this._getEpisodes.bind(this),
                currentSeasonID,
                "Season ",
                true
            );
        }
        let episodesSelector = "Select a season...";
        if (currentSeasonID > 0) {
            episodesSelector = this._buildSelect(
                episodes,
                "episode_number",
                this._handleSelectEpisode.bind(this),
                currentEpisodeID,
                "Episode ",
                true
            );
        }

        let buttonDisabled = true;
        if (currentShowID > 0 && currentSeasonID > 0 && currentEpisodeID > 0) {
            buttonDisabled = false;
        }
        return (
            <div>
                <div key="show">{showSelector}</div>
                <div key="season">{seasonsSelector}</div>
                <div key="episode">{episodesSelector}</div>
                <div key="button" className="ib-idmodal-button-box">
                    <Button
                        onClick={this._handleClickIDButton.bind(this)}
                        disabled={buttonDisabled}
                    >
                        ID Episode
                    </Button>
                </div>
            </div>
        );
    }
}

EpisodeIDSelector.propTypes = {
    callAPI: PropTypes.func.isRequired,
    onIDEpisode: PropTypes.func.isRequired,
};

export default EpisodeIDSelector;
