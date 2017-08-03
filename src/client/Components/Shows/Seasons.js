import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Icon, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import PlayButton from '../PlayButton';

class Seasons extends Component {
    static propTypes = {
        activeSeasonNum: PropTypes.number.isRequired,
        show: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            selectedSeasonNum: -1,
            episodes: [],
            isLoadingEpisodes: false,
            isLoadingSeasons: false,
            seasons: []
        }
    }

    componentWillMount(){
        this._getSeasons();
        this._shouldGetEpisodes(this.props);
    }

    componentWillReceiveProps(nextProps){
        this._shouldGetEpisodes(nextProps);
    }

    _getSeasons(){
        const { emitAPIRequest, show } = this.props;

        this.setState({
            isLoadingSeasons: true
        });

        const options = {
            show_id: show.id
        }

        emitAPIRequest("shows.seasons.get", options, this._seasonsReceived.bind(this), false);
    }

    _seasonsReceived(seasons){
        this.setState({
            isLoadingSeasons: false,
            seasons
        });
    }

    _shouldGetEpisodes(props){
        if(props.activeSeasonNum !== this.state.selectedSeasonNum){
            this._getEpisodes(props.activeSeasonNum);
        }
    }

    _getEpisodes(seasonNum){
        const { emitAPIRequest, show } = this.props;

        this.setState({
            isLoadingEpisodes: true
        });

        const options = {
            show_id: show.id,
            season_number: seasonNum
        };

        emitAPIRequest("shows.episodes.get_all_with_file_info", options, this._episodesReceived.bind(this, seasonNum), false);
    }

    _episodesReceived(seasonNum, episodes){
        this.setState({
            selectedSeasonNum: seasonNum,
            episodes,
            isLoadingEpisodes: false
        });
    }

    _buildSeasonBar(){
        const { seasons, selectedSeasonNum } = this.state;
        const { show } = this.props;

        let seasonList = [];
        seasons.forEach((season)=>{
            let boxClass = "ib-show-seasonlist-season-box";
            let seasonNumEl = "";
            if(season.season_number === selectedSeasonNum){
                boxClass += " ib-show-seasonlist-season-box-active";
                seasonNumEl = season.season_number;
            } else {
                seasonNumEl = <Link to={"/show/" + show.slug + "/" + season.season_number}>
                                  {season.season_number}
                              </Link>;
            }

            
            const el =  <div key={season.season_number}
                            className={boxClass}>
                            {seasonNumEl}
                        </div>;

            seasonList.push(el);
        });

        return seasonList;
    }

    _buildEpisodesList(){
        const { episodes } = this.state;
        const { directories } = this.props;

        let episodeList = [];

        episodes.forEach((episode)=>{
            let playButton = "";

            if(episode.file_info.hasOwnProperty('id')){
                const fullPath = directories.Shows + "/" + episode.file_info.subpath;
                playButton = <PlayButton filename={episode.file_info.filename} fullPath={fullPath} />;
            }
            const el = <div key={episode.id}
                            className="ib-shows-seasonlist-episode-row">
                            {playButton}{episode.episode_number}. {episode.title}
                        </div>;
            episodeList.push(el);
        });
        return episodeList;
    }

    render() {
        const { 
            selectedSeasonNum,
            isLoadingEpisodes,
            isLoadingSeasons
        } = this.state;

        let seasonBar = "";
        if(isLoadingSeasons){
            seasonBar = <Spin />;
        } else {
            seasonBar = this._buildSeasonBar();
        }

        let episodeList = "";
        if(selectedSeasonNum > -1){
            if(isLoadingEpisodes){
                episodeList = <Spin />;
            } else {
                episodeList = this._buildEpisodesList();
            }
        }

        return (
            <div>
                <Row>
                    {seasonBar}
                </Row>
                <Row>
                    <div className="ib-show-seasonlist-episodes-container">
                        {episodeList}
                    </div>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { settings } = state;
    return {
        directories: settings.settings.directories
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Seasons);