import PropTypes from "prop-types";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Button, Icon, Row, Spin, Table } from "antd";

import moment from "moment";

import PlayButton from "../../PlayButton";

class EpisodesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSeasonNum: -1,
            episodes: [],
            isLoadingEpisodes: false,
            selectedEpisodeKeys: []
        };
    }

    componentWillMount() {
        this._shouldGetEpisodes(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._shouldGetEpisodes(nextProps);
    }

    _shouldGetEpisodes(props) {
        if (props.activeSeasonNum !== this.state.selectedSeasonNum) {
            this._getEpisodes(props.activeSeasonNum);
        }
    }

    _getEpisodes(seasonNum) {
        const { callAPI, show } = this.props;

        this.setState({
            isLoadingEpisodes: true
        });

        const options = {
            show_id: show.id,
            season_number: seasonNum
        };

        callAPI(
            "shows.episodes.get_all_with_file_info",
            options,
            this._episodesReceived.bind(this, seasonNum),
            false
        );
    }

    _episodesReceived(seasonNum, episodes) {
        this.setState({
            selectedSeasonNum: seasonNum,
            episodes,
            isLoadingEpisodes: false
        });
    }

    _changeSelectedEpisodesWatchedStatus(newWatchedStatus) {
        const { selectedEpisodeKeys } = this.state;
        const { activeSeasonNum, callAPI } = this.props;

        this.setState({
            isLoadingEpisodes: true
        });

        const params = {
            episode_ids: selectedEpisodeKeys,
            watched_status: newWatchedStatus
        };
        callAPI(
            "shows.episodes.toggle_watched",
            params,
            this._getEpisodes.bind(this, activeSeasonNum),
            false
        );
    }

    _handleSelectEpisodeTableRow(selectedEpisodeKeys) {
        this.setState({
            selectedEpisodeKeys
        });
    }

    _handleToggleSeasonLock(newStatus) {
        this.props.onToggleSeasonLock(newStatus);
    }

    _buildEpisodesTable() {
        const { episodes, selectedEpisodeKeys } = this.state;
        const { directories } = this.props.settings;

        let columns = this._episodeTableColumns();

        let rowSelection = {
            selectedEpisodeKeys,
            onChange: this._handleSelectEpisodeTableRow.bind(this)
        };

        const locale = {
            emptyText: "No episodes found."
        };

        return (
            <Table
                columns={columns}
                dataSource={episodes}
                pagination={false}
                size="small"
                rowKey="id"
                rowSelection={rowSelection}
                locale={locale}
            />
        );
    }

    _episodeTableColumns() {
        const { directories } = this.props.settings;

        return [
            {
                title: "Num",
                dataIndex: "episode_number"
            },
            {
                title: <Icon type="check" />,
                render: (text, record) => {
                    let iconType = "";
                    if (record.watched === 1) {
                        iconType = "check";
                    } else {
                        iconType = "minus";
                    }
                    return <Icon type={iconType} />;
                }
            },
            {
                title: "Name",
                dataIndex: "title"
            },
            {
                title: "First Aired",
                render: (text, record) => {
                    return moment
                        .unix(record.first_aired)
                        .format("MMM. D, YYYY, h:mm:ss a");
                }
            },
            {
                title: (
                    <Icon type="play-circle" className="ib-playbutton-icon" />
                ),
                render: (text, record) => {
                    if (record.file_info.hasOwnProperty("id")) {
                        const fullPath =
                            directories.Shows + "/" + record.file_info.subpath;
                        return (
                            <PlayButton
                                filename={record.file_info.filename}
                                fullPath={fullPath}
                            />
                        );
                    }
                }
            }
        ];
    }

    _buildEpisodesList() {
        const { episodes } = this.state;
        const { directories } = this.props.settings;

        let episodeList = [];

        episodes.forEach(episode => {
            let playButton = "";

            const el = (
                <div
                    key={episode.id}
                    className="ib-shows-seasonlist-episode-row"
                >
                    {playButton}
                    {episode.episode_number}. {episode.title}
                </div>
            );
            episodeList.push(el);
        });
        return episodeList;
    }

    _buildButtons() {
        const { season } = this.props;
        const { selectedEpisodeKeys } = this.state;

        let toggleLockButton = null;
        if (season.locked) {
            toggleLockButton = (
                <Button onClick={this._handleToggleSeasonLock.bind(this, 0)}>
                    <Icon type="unlock" />&nbsp;Unlock Season
                </Button>
            );
        } else {
            toggleLockButton = (
                <Button onClick={this._handleToggleSeasonLock.bind(this, 1)}>
                    <Icon type="lock" />&nbsp;Lock Season
                </Button>
            );
        }

        const buttonsDisabled = selectedEpisodeKeys.length > 0 ? false : true;

        return (
            <div>
                <Button.Group>
                    <Button
                        onClick={this._changeSelectedEpisodesWatchedStatus.bind(
                            this,
                            1
                        )}
                        disabled={buttonsDisabled}
                    >
                        Toggle to Watched
                    </Button>
                    <Button
                        onClick={this._changeSelectedEpisodesWatchedStatus.bind(
                            this,
                            0
                        )}
                        disabled={buttonsDisabled}
                    >
                        Toggle to UnWatched
                    </Button>
                </Button.Group>
                &nbsp;
                <Button.Group>{toggleLockButton}</Button.Group>
            </div>
        );
    }

    render() {
        const { activeSeasonNum } = this.props;
        const { selectedSeasonNum, isLoadingEpisodes } = this.state;

        let episodeList = "";
        if (selectedSeasonNum > -1) {
            if (isLoadingEpisodes) {
                episodeList = (
                    <div id="ib-loading-box">
                        <Spin />
                    </div>
                );
            } else {
                episodeList = this._buildEpisodesTable();
            }
        }

        const buttons = this._buildButtons();

        return (
            <div className="ib-show-seasonlist-episodes-container">
                <h3>Season {activeSeasonNum}</h3>
                {buttons}
                {episodeList}
            </div>
        );
    }
}

EpisodesTable.propTypes = {
    activeSeasonNum: PropTypes.number.isRequired,
    callAPI: PropTypes.func.isRequired,
    onToggleSeasonLock: PropTypes.func.isRequired,
    season: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    show: PropTypes.object.isRequired
};

export default EpisodesTable;
