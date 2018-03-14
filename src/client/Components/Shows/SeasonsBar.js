import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { Icon, Row, Spin, Table, Tabs } from "antd";
const TabPane = Tabs.TabPane;

import { emitAPIRequest } from "../../actions/api.actions";

import PlayButton from "../PlayButton";

class SeasonsBar extends Component {
    static propTypes = {
        activeSeasonNum: PropTypes.number.isRequired,
        show: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoadingSeasons: false,
            seasons: []
        };
    }

    componentWillMount() {
        this._getSeasons();
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
        this.setState({
            isLoadingSeasons: false,
            seasons
        });
    }

    _handleClickToggleLock(seasonID, newLockStatus) {
        const { emitAPIRequest } = this.props;

        const params = {
            season_id: seasonID,
            lock_status: newLockStatus
        };

        emitAPIRequest(
            "shows.season.toggle_lock",
            params,
            this._getSeasons.bind(this),
            false
        );
    }

    _buildSeasonBar() {
        const { seasons } = this.state;
        const { activeSeasonNum, show } = this.props;

        let seasonList = [];
        seasons.forEach(season => {
            let boxClass = "ib-show-seasonlist-season-box";
            let seasonNumEl = "";
            if (season.season_number === activeSeasonNum) {
                boxClass += " ib-show-seasonlist-season-box-active";
                seasonNumEl = season.season_number;
            } else {
                seasonNumEl = (
                    <Link
                        to={"/show/" + show.slug + "/" + season.season_number}
                    >
                        {season.season_number}
                    </Link>
                );
            }

            let lockedIcon = "";
            if (season.locked === 1) {
                lockedIcon = (
                    <a
                        href="javascript:void(0);"
                        title="Locked. Click to Unlock."
                        onClick={this._handleClickToggleLock.bind(
                            this,
                            season.id,
                            0
                        )}
                    >
                        <Icon type="lock" />
                    </a>
                );
            } else {
                lockedIcon = (
                    <a
                        href="javascript:void(0);"
                        title="Unlocked. Click to Lock."
                        onClick={this._handleClickToggleLock.bind(
                            this,
                            season.id,
                            1
                        )}
                    >
                        <Icon type="unlock" />
                    </a>
                );
            }

            const el = (
                <div key={season.season_number} className={boxClass}>
                    {seasonNumEl}&nbsp;|&nbsp;{lockedIcon}
                </div>
            );

            seasonList.push(el);
        });

        return seasonList;
    }

    _buildSeasonTabs() {
        const { seasons } = this.state;
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
            <Tabs defaultActiveKey={seasons[0]["season_number"]}>
                {tabpanes}
            </Tabs>
        );
    }

    render() {
        const { isLoadingSeasons } = this.state;

        let seasonBar = "";
        if (isLoadingSeasons) {
            seasonBar = <Spin />;
        } else {
            seasonBar = this._buildSeasonTabs();
        }

        return <div>{seasonBar}</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(SeasonsBar);
