import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { truncate } from "lodash";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import Grid from "@material-ui/core/Grid";
import { callAPI } from "../actions/api.actions";

const NUM_DAYS = 14;
class NewEpisodes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            days: [],
            episodes: {},
        };
    }

    componentWillMount() {
        let days = [];
        for (let i = 0; i <= NUM_DAYS; i++) {
            const dayMoment = moment().subtract(i, "day");
            days.push(dayMoment);
            this._getNewEpisodes(dayMoment);
        }

        this.setState({
            days,
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
            end_unix_timestamp: endUnixTimestamp,
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
            episodes,
        });
    }

    _buildEpisodeDetails(episode) {
        let sNum =
            episode.season_number < 10
                ? "0" + episode.season_number
                : episode.season_number;
        let eNum =
            episode.episode_number < 10
                ? "0" + episode.episode_number
                : episode.episode_number;
        let searchString = encodeURIComponent(
            episode.show_info.title + " S" + sNum + "E" + eNum
        );
        return (
            <Grid item xs={12} sm={6} lg={4} key={episode.id}>
                <div className="ib-newepisode-container">
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
                                {truncate(episode.show_info.title, {
                                    length: 50,
                                })}
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
                                    searchString +
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
                                    searchString +
                                    "/0/99/0/"
                                }
                            >
                                thepiratebay
                            </a>
                        </div>
                    </div>
                </div>
            </Grid>
        );
    }

    _buildEpisodesList() {
        const { days, episodes } = this.state;

        let elements = [];
        days.forEach((dayMoment) => {
            let unixDay = dayMoment.unix();

            let headerIcon = null;
            let epList = [];
            let noEpisodesClass = "";
            if (episodes.hasOwnProperty(unixDay)) {
                if (episodes[unixDay].length === 0) {
                    headerIcon = (
                        <EventBusyIcon className="newepisodes-title-icon" />
                    );
                    noEpisodesClass = "newepisodes-no-episodes";
                    // No episodes message
                    epList = <p>No new episodes.</p>;
                } else {
                    headerIcon = (
                        <EventAvailableIcon className="newepisodes-title-icon" />
                    );
                    episodes[unixDay].forEach((episode) => {
                        const epEl = this._buildEpisodeDetails(episode);
                        epList.push(epEl);
                    });
                }
            }
            const header = (
                <h3>
                    {headerIcon}
                    <span className="newepisodes-title-text">
                        {dayMoment.format("dddd, MMMM Do YYYY")}
                    </span>
                </h3>
            );
            const el = (
                <Card
                    key={unixDay}
                    className={"ib-newepisodes-block " + noEpisodesClass}
                >
                    <CardContent>
                        {header}
                        <Grid container spacing={1}>
                            {epList}
                        </Grid>
                    </CardContent>
                </Card>
            );
            elements.push(el);
        });
        return elements;
    }

    render() {
        const episodesList = this._buildEpisodesList();
        return (
            <div>
                <h1>New Episodes</h1>
                {episodesList}
            </div>
        );
    }
}

NewEpisodes.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default NewEpisodes;
