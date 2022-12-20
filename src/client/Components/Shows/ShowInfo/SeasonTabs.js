import PropTypes from "prop-types";
import React, {Component} from "react";
import {useNavigate} from "react-router-dom";
import {CircularProgress, Grid, Tabs, Tab} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

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
        const {season_number} = this.props.uriMatch.params;
        if (season_number) {
            const old_season_number = prevProps.uriMatch.params.season_number;
            if (old_season_number) {
                if (old_season_number !== season_number) {
                    this._parseActiveSeason(this.props);
                }
            } else {
                this._parseActiveSeason(this.props);
            }
        }
    }


    _parseActiveSeason(props) {
        const {activeSeasonNum, seasons} = this.state;
        const season_number = props.uriMatch.params.season_number;
        if (season_number !== undefined) {
            if (season_number !== activeSeasonNum) {
                const seasonNumber = parseInt(season_number);
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
        const {callAPI, show} = this.props;

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
        const {activeSeasonNum} = this.state;
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
        const {history, show} = this.props;
        history("/show/" + show.slug + "/" + seasonNumber);
    }

    _handleToggleSingleSeasonLock(newLockStatus) {
        const {callAPI} = this.props;
        const {activeSeason} = this.state;

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

    _handleToggleAllSeasonsLock(newLockStatus) {
        const {callAPI, show} = this.props;
        const {activeSeason} = this.state;

        const params = {
            show_id: show.id,
            lock_status: newLockStatus,
        };

        callAPI(
            "shows.seasons.toggle_lock_all",
            params,
            this._getSeasons.bind(this),
            false
        );
    }

    _buildSeasonTabs() {
        const {activeSeasonNum, seasons} = this.state;
        const tabpanes = seasons.map((season, index) => {
            let lockIcon = "";
            if (season.locked === 1) {
                lockIcon = <LockIcon/>;
            } else {
                lockIcon = <LockOpenIcon/>;
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
            <Tabs
                value={activeSeasonNum}
                size="small"
                className="ib-show-info-tabs"
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabpanes}
            </Tabs>
        );
    }

    render() {
        const {activeSeason, activeSeasonNum, isLoadingSeasons} = this.state;
        const {callAPI, settings, show} = this.props;

        let seasonBar = "";
        if (isLoadingSeasons) {
            seasonBar = <CircularProgress/>;
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
                    onToggleSingleSeasonLock={this._handleToggleSingleSeasonLock.bind(
                        this
                    )}
                    onToggleAllSeasonsLock={this._handleToggleAllSeasonsLock.bind(
                        this
                    )}
                    onToggle
                />
            );
        }

        return (
            <Grid container>
                <Grid item xs={12}>
                    {seasonBar}
                </Grid>
                <Grid item xs={12}>
                    {episodesTable}
                </Grid>
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
