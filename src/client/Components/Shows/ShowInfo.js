import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Icon, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import PlayButton from '../PlayButton';

class ShowInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoadingSeasons: false,
            loadingEpisodes: [],
            episodes: {},
            seasons: [],
            show: {},
            visibleSeasons: []
        };
    }

    componentWillMount(){
        this._getShowInfo();
    }

    _getShowInfo(){
        const { emitAPIRequest } = this.props;

        const params = {
            slug: this.props.match.params.slug
        };

        emitAPIRequest("shows.show.get_for_slug", params, this._showInfoReceived.bind(this), false);
    }

    _showInfoReceived(show){
        this.setState({
            episodes: {},
            seasons: [],
            show,
            visibleSeasons: []
        });

        this._getSeasons();
    }

    _getSeasons(){
        const { emitAPIRequest } = this.props;
        const { show } = this.state;

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

    _handleClickSeason(seasonID){
        const { episodes, loadingEpisodes } = this.state;
        
        if(episodes.hasOwnProperty(seasonID)){
            this._toggleVisibleSeason(seasonID);
            return;
        }

        this._getEpisodes(seasonID);
    }

    _toggleVisibleSeason(seasonID){
        const { visibleSeasons } = this.state;
        const possibleIndex = visibleSeasons.indexOf(seasonID);
        if(possibleIndex > -1){
            visibleSeasons.splice(possibleIndex, 1);
        } else {
            visibleSeasons.push(seasonID);
        }
        this.setState({
            visibleSeasons
        });
    }

    _getEpisodes(seasonID){
        const { emitAPIRequest } = this.props;
        const { 
            episodes,
            loadingEpisodes,
            show,
            visibleSeasons
        } = this.state;

        loadingEpisodes.push(seasonID);

        this.setState({
            loadingEpisodes,
            visibleSeasons
        });

        const options = {
            show_id: show.id,
            season_id: seasonID
        };

        emitAPIRequest("shows.episodes.get_all_with_file_info", options, this._episodesReceived.bind(this, seasonID), false);
    }

    _episodesReceived(seasonID, episodeList){
        const { episodes, loadingEpisodes, visibleSeasons } = this.state;

        loadingEpisodes.splice(loadingEpisodes.indexOf(seasonID), 1);

        episodes[seasonID] = episodeList;
        visibleSeasons.push(seasonID);

        this.setState({
            episodes,
            loadingEpisodes,
            visibleSeasons
        });
    }

    _buildShowInfo(){
        const { show } = this.state;

        return (
            <div>
                <Col span={4}>
                    <div className="ib-shows-thumbnail-box">
                        <img
                            className="ib-shows-thumbnail" 
                            src={"/images/shows/" + show.image_filename}
                        />
                    </div>
                </Col>
                <Col span={14} offset={1}>
                    <h3>{show.title}</h3>
                    <h4>{show.year}</h4>
                    <a href={"http://imdb.com/title/" + show.imdb_id} target="_blank">IMDB</a>
                    <br/><br/>
                    <p>{show.overview}</p>
                </Col>
            </div>
        );
    }

    _buildSeasonsList(){
        const { episodes, loadingEpisodes, seasons, visibleSeasons } = this.state;

        let seasonsList = [];
        seasons.forEach((season)=>{
            let contents = "";
            let iconType = "plus-circle";
            if(loadingEpisodes.indexOf(season.id) > -1){
                contents = <Spin />;
            } 
            if(visibleSeasons.indexOf(season.id) > -1){
                contents = this._buildEpisodesList(season.id);
                iconType = "minus-circle";
            }

            const el = <div key={season.season_number} className="ib-shows-seasonlist-row">
                            <div className="ib-shows-seasonlist-seasontitle">
                                <a href="javascript:void(0);"
                                    onClick={this._handleClickSeason.bind(this, season.id)}>
                                    <Icon type={iconType}/>&nbsp;Season {season.season_number}
                                </a>
                            </div>
                            <div>
                                {contents}
                            </div>
                        </div>;
            seasonsList.push(el);
        });

        return seasonsList;
    }

    _buildEpisodesList(seasonID){
        const { episodes } = this.state;
        const { directories } = this.props;

        let episodeList = [];

        episodes[seasonID].forEach((episode)=>{
            let playButton = "";

            if(episode.file_info.hasOwnProperty('id')){
                const fullPath = directories.Shows + "/" + episode.file_info.subpath;
                playButton = <PlayButton filename={episode.file_info.filename} fullPath={fullPath} />;
            }
            const el = <div key={episode.id}
                            className="ib-shows-seasonlist-episode-row">
                            {episode.episode_number}. {playButton}{episode.title}
                        </div>;
            episodeList.push(el);
        });
        return episodeList;
    }

    render() {
        const { isLoadingSeasons } = this.state;

        const showInfo = this._buildShowInfo();
        const contents = ( isLoadingSeasons ) ? <Spin /> : this._buildSeasonsList();
        
        return (
            <div>
                <Row>
                    {showInfo}
                </Row>
                <Row>
                    {contents}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo);