import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { Card, Icon, Row, Spin, Table, Tabs } from "antd";
const TabPane = Tabs.TabPane;

import { emitAPIRequest } from "../../actions/api.actions";

import EpisodesTable from "./EpisodesTable";
import PlayButton from "../PlayButton";

class SeasonTabs extends Component {
    static propTypes = {
        show: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            activeSeasonNum: -1,
            activeSeason: {},
            isLoadingSeasons: false,
            seasons: []
        };
    }

    componentWillMount() {
        this._getSeasons();
        this._parseActiveSeason(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._parseActiveSeason(nextProps);
    }

    _parseActiveSeason(props) {
        const { match } = props;
        const { activeSeasonNum, seasons } = this.state;

        if (match.params.season_number !== undefined) {
            if (match.params.season_number !== activeSeasonNum) {
                const seasonNumber = parseInt(match.params.season_number);
                let activeSeason = {};
                seasons.forEach(season => {
                    if (season.season_number === seasonNumber) {
                        activeSeason = season;
                    }
                });
                this.setState({
                    activeSeasonNum: seasonNumber,
                    activeSeason
                });
            }
        }
    }

    _getSeasons() {
        const { emitAPIRequest, show } = this.props;

        this.setState({
            isLoadingSeasons: true
        });

        const options = {
            show_id: show.id
        };

        emitAPIRequest(
            "shows.seasons.get",
            options,
            this._seasonsReceived.bind(this),
            false
        );
    }

    _seasonsReceived(seasons) {
        const { activeSeasonNum } = this.state;
        let activeSeason = {};
        seasons.forEach(season => {
            if (season.season_number === activeSeasonNum) {
                activeSeason = season;
            }
        });

        this.setState({
            activeSeason,
            isLoadingSeasons: false,
            seasons
        });
    }

    _handleClickTab(seasonNumber) {
        const { history, show } = this.props;
        history.push("/show/" + show.slug + "/" + seasonNumber);
    }

    _handleToggleSeasonLock(newLockStatus) {
        const { emitAPIRequest } = this.props;
        const { activeSeason } = this.state;

        const params = {
            season_id: activeSeason.id,
            lock_status: newLockStatus
        };

        emitAPIRequest(
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
                lockIcon = <Icon type="lock" />;
            } else {
                lockIcon = <Icon type="unlock" />;
            }

            const tabTitle = (
                <span>
                    {season.season_number}&nbsp;
                    {lockIcon}
                </span>
            );
            return <TabPane tab={tabTitle} key={season.season_number} />;
        });
        return (
            <Tabs
                defaultActiveKey={activeSeasonNum}
                onTabClick={this._handleClickTab.bind(this)}
                size="small"
                tabBarGutter={1}
            >
                {tabpanes}
            </Tabs>
        );
    }

    render() {
        const { activeSeason, activeSeasonNum, isLoadingSeasons } = this.state;
        const { show } = this.props;

        let seasonBar = "";
        if (isLoadingSeasons) {
            seasonBar = <Spin />;
        } else {
            seasonBar = this._buildSeasonTabs();
        }

        let episodesTable = null;
        if (activeSeasonNum > -1 && !isLoadingSeasons) {
            episodesTable = (
                <EpisodesTable
                    activeSeasonNum={activeSeasonNum}
                    season={activeSeason}
                    show={show}
                    onToggleSeasonLock={this._handleToggleSeasonLock.bind(this)}
                />
            );
        }

        return (
            <Card title="Seasons">
                {seasonBar}
                {episodesTable}
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(SeasonTabs);
