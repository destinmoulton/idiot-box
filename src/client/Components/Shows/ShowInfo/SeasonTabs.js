import PropTypes from "prop-types";
import React, { Component } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import EpisodesTable from "./EpisodesTable";

class SeasonTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSeasonNum: 0,
            activeSeason: {},
            isLoadingSeasons: false,
            seasons: [],
        };
    }

    componentDidMount() {
        this._getSeasons();
        this._parseActiveSeason(this.props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.season_number !== undefined) {
            if (prevProps.match.params.season_number !== undefined) {
                const prevSeasonNum = prevProps.match.params.season_number;
                const thisSeasonNum = this.props.match.params.season_number;
                if (prevSeasonNum !== thisSeasonNum) {
                    this._parseActiveSeason(this.props);
                }
            } else {
                this._parseActiveSeason(this.props);
            }
        }
    }

    _parseActiveSeason(props) {
        const { match } = props;
        const { activeSeasonNum, seasons } = this.state;

        if (match.params.season_number !== undefined) {
            if (match.params.season_number !== activeSeasonNum) {
                const seasonNumber = parseInt(match.params.season_number);
                let activeSeason = {};
                seasons.forEach((season) => {
                    if (season.season_number === seasonNumber) {
                        activeSeason = season;
                    }
                });
                this.setState({
                    activeSeasonNum: seasonNumber,
                    activeSeason,
                });
            }
        }
    }

    _getSeasons() {
        const { callAPI, show } = this.props;

        this.setState({
            isLoadingSeasons: true,
        });

        const options = {
            show_id: show.id,
        };

        callAPI(
            "shows.seasons.get",
            options,
            this._seasonsReceived.bind(this),
            false
        );
    }

    _seasonsReceived(seasons) {
        const { activeSeasonNum } = this.state;
        let activeSeason = {};
        seasons.forEach((season) => {
            if (season.season_number === activeSeasonNum) {
                activeSeason = season;
            }
        });

        this.setState({
            activeSeason,
            isLoadingSeasons: false,
            seasons,
        });
    }

    _handleClickTab(seasonNumber) {
        const { history, show } = this.props;
        history.push("/show/" + show.slug + "/" + seasonNumber);
    }

    _handleToggleSeasonLock(newLockStatus) {
        const { callAPI } = this.props;
        const { activeSeason } = this.state;

        const params = {
            season_id: activeSeason.id,
            lock_status: newLockStatus,
        };

        callAPI(
            "shows.season.toggle_lock",
            params,
            this._getSeasons.bind(this),
            false
        );
    }

    _buildSeasonTabs() {
        const { activeSeasonNum, seasons } = this.state;
        const tabpanes = seasons.map((season, index) => {
            let lockIcon = "";
            if (season.locked === 1) {
                lockIcon = <LockIcon />;
            } else {
                lockIcon = <LockOpenIcon />;
            }

            const tabTitle = (
                <span>
                    {season.season_number}&nbsp;
                    {lockIcon}
                </span>
            );
            return (
                <Tab
                    label={tabTitle}
                    value={season.season_number}
                    key={season.season_number}
                    onClick={() => this._handleClickTab(season.season_number)}
                />
            );
        });
        return (
            <Tabs value={activeSeasonNum} size="small">
                {tabpanes}
            </Tabs>
        );
    }

    render() {
        const { activeSeason, activeSeasonNum, isLoadingSeasons } = this.state;
        const { callAPI, settings, show } = this.props;

        let seasonBar = "";
        if (isLoadingSeasons) {
            seasonBar = <CircularProgress />;
        } else {
            seasonBar = this._buildSeasonTabs();
        }

        let episodesTable = null;
        if (activeSeasonNum > -1 && !isLoadingSeasons) {
            episodesTable = (
                <EpisodesTable
                    activeSeasonNum={activeSeasonNum}
                    callAPI={callAPI}
                    season={activeSeason}
                    settings={settings}
                    show={show}
                    onToggleSeasonLock={this._handleToggleSeasonLock.bind(this)}
                />
            );
        }

        return (
            <Grid container>
                {seasonBar}
                {episodesTable}
            </Grid>
        );
    }
}

SeasonTabs.propTypes = {
    callAPI: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    show: PropTypes.object.isRequired,
};

export default SeasonTabs;
