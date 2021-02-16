import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Select from "react-select";

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
        placeholder = ""
    ) {
        let options = items.map((item) => {
            const optionValue = prefix + item[titleKey];
            return { value: item.id.toString(), label: optionValue };
        });
        return (
            <Select
                options={options}
                placeholder={"Select " + placeholder + "..."}
                defaultValue={defaultValue.toString()}
                onChange={({ value }) => onChange(value)}
            />
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
            true,
            "Show"
        );
        let seasonsSelector = "Select a show...";
        if (currentShowID > 0) {
            seasonsSelector = this._buildSelect(
                seasons,
                "season_number",
                this._getEpisodes.bind(this),
                currentSeasonID,
                "Season ",
                true,
                "Season"
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
                "Episode"
            );
        }

        let buttonDisabled = true;
        if (currentShowID > 0 && currentSeasonID > 0 && currentEpisodeID > 0) {
            buttonDisabled = false;
        }
        return (
            <div className="ib-idmodal-idepisode-box">
                <div key="show">{showSelector}</div>
                <div key="season">{seasonsSelector}</div>
                <div key="episode">{episodesSelector}</div>
                <div key="button" className="ib-idmodal-button-box">
                    <Button
                        variant="contained"
                        color="primary"
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
