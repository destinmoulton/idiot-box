import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { truncate } from "lodash";

import { Col, Icon, Row, Spin } from "antd";

import { callAPI } from "../actions/api.actions";

class NewEpisodes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            days: [],
            episodes: {}
        };
    }

    componentWillMount() {
        let days = [];
        for (let i = 0; i <= 7; i++) {
            const dayMoment = moment().subtract(i, "day");
            days.push(dayMoment);
            this._getNewEpisodes(dayMoment);
        }

        this.setState({
            days
        });
    }

    _getNewEpisodes(dayMoment) {
        const { callAPI } = this.props;

        const startUnixTimestamp = dayMoment
            .hours(0)
            .minutes(0)
            .seconds(0)
            .unix();
        const endUnixTimestamp = dayMoment
            .hours(23)
            .minutes(59)
            .seconds(59)
            .unix();
        const params = {
            start_unix_timestamp: startUnixTimestamp,
            end_unix_timestamp: endUnixTimestamp
        };

        callAPI(
            "shows.episodes.get_between_unix_timestamps",
            params,
            this._episodesReceived.bind(this, dayMoment),
            false
        );
    }

    _episodesReceived(dayMoment, newEpisodes) {
        let { episodes } = this.state;

        episodes[dayMoment.unix()] = newEpisodes;

        this.setState({
            episodes
        });
    }

    _buildEpisodeDetails(episode) {
        return (
            <div key={episode.id} className="ib-newepisode-container">
                <div className="ib-newepisode-img-box">
                    <Link to={"/show/" + episode.show_info.slug}>
                        <img
                            className="ib-newepisode-img"
                            src={
                                "/images/shows/" +
                                episode.show_info.image_filename
                            }
                        />
                    </Link>
                </div>
                <div className="ib-newepisode-details-box">
                    <div className="ib-newepisode-show-title">
                        <Link to={"/show/" + episode.show_info.slug}>
                            {truncate(episode.show_info.title, { length: 50 })}
                        </Link>
                    </div>
                    <div className="ib-newepisode-ep-title">
                        {truncate(episode.title, { length: 35 })}
                    </div>
                    <div>
                        Season {episode.season_number} - Episode{" "}
                        {episode.episode_number}
                    </div>
                    <div className="ib-newepisode-links">
                        <a
                            target="_blank"
                            href={
                                "https://www.1337x.to/search/" +
                                encodeURIComponent(episode.show_info.title) +
                                "/1/"
                            }
                        >
                            1337x
                        </a>
                        &nbsp;|&nbsp;
                        <a
                            target="_blank"
                            href={
                                "https://thepiratebay.org/search/" +
                                encodeURIComponent(episode.show_info.title) +
                                "/0/99/0/"
                            }
                        >
                            thepiratebay
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    _buildEpisodesList() {
        const { days, episodes } = this.state;

        let elements = [];
        days.forEach(dayMoment => {
            let unixDay = dayMoment.unix();
            const header = (
                <h3>
                    <Icon type="calendar" />&nbsp;{dayMoment.format(
                        "dddd, MMMM Do YYYY"
                    )}
                </h3>
            );

            let epList = [];
            if (episodes.hasOwnProperty(unixDay)) {
                if (episodes[unixDay].length === 0) {
                    // No episodes message
                    epList = (
                        <div key={unixDay} className="ib-newepisode-container">
                            <h3>Nothing to see here...</h3>
                        </div>
                    );
                } else {
                    episodes[unixDay].forEach(episode => {
                        const epEl = this._buildEpisodeDetails(episode);
                        epList.push(epEl);
                    });
                }
            }
            const el = (
                <Row key={unixDay} className="ib-newepisode-section">
                    {header}
                    {epList}
                </Row>
            );
            elements.push(el);
        });
        return elements;
    }

    render() {
        const episodesList = this._buildEpisodesList();
        return <div>{episodesList}</div>;
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEpisodes);
