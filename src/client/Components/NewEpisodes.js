import moment from 'moment';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Row, Spin } from 'antd';

import { emitAPIRequest } from '../actions/api.actions';
class NewEpisodes extends Component {
    constructor(props){
        super(props);

        this.state = {
            days: [],
            episodes: {}
        }
    }

    componentWillMount(){
        let days = [];
        for(let i=0; i<=7; i++){
            const dayMoment = moment().subtract(i, 'day')
            days.push(dayMoment);
            this._getNewEpisodes(dayMoment);
        }

        this.setState({
            days
        });
    }

    _getNewEpisodes(dayMoment){
        const { emitAPIRequest } = this.props;

        const startUnixTimestamp = dayMoment.hours(0).minutes(0).seconds(0).unix();
        const endUnixTimestamp = dayMoment.hours(23).minutes(59).seconds(59).unix();
        const params = {
            start_unix_timestamp: startUnixTimestamp,
            end_unix_timestamp: endUnixTimestamp
        };

        emitAPIRequest("shows.episodes.get_between_unix_timestamps", params, this._episodesReceived.bind(this, dayMoment), false);
    }

    _episodesReceived(dayMoment, newEpisodes){
        let { episodes } = this.state;

        episodes[dayMoment.unix()] = newEpisodes;

        this.setState({
            episodes
        });
    }

    _buildEpisodesList(){
        const { days, episodes } = this.state;

        let elements = [];
        days.forEach((dayMoment)=>{
            let unixDay = dayMoment.unix();
            const header = <h3>{dayMoment.format("dddd, MMMM Do YYYY")}</h3>;

            let epList = [];
            if(episodes.hasOwnProperty(unixDay)){
                episodes[unixDay].forEach((episode)=>{
                    const epEl = <div key={episode.id}
                                      className="ib-newepisode-container">
                                    <div className="ib-newepisode-img-box">
                                        <img
                                            className="ib-newepisode-img"
                                            src={"/images/shows/" + episode.show_info.image_filename}
                                        />
                                    </div>
                                    <div className="ib-newepisode-details-box">
                                        <div className="ib-newepisode-title">
                                            {episode.title}
                                        </div>
                                        Season {episode.season_number} - Episode {episode.episode_number}
                                        <br/>
                                        <a target="_blank" href={"https://www.1337x.to/search/" + encodeURIComponent(episode.show_info.title)+"/1/"}>1337x</a>
                                    </div>
                                </div>;
                    epList.push(epEl);
                });
            }
            const el = <Row key={unixDay}
                            className="ib-newepisode-section">
                            {header}
                            {epList}
                        </Row>;
            elements.push(el);
        });
        return elements;
    }

    render() {
        const episodesList = this._buildEpisodesList();
        return (
            <div>
                {episodesList}
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEpisodes);