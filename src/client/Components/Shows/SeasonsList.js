import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Icon, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class SeasonsList extends Component {

    static propTypes = {
        show: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);

        this.state = {
            isLoadingSeasons: false,
            loadingEpisodes: [],
            episodes: {},
            seasons: [],
            visibleSeasons: []
        };
    }

    componentWillMount(){
        this._getSeasons();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.show.id !== this.props.show.id){
            this.setState({
                episodes: {},
                seasons: []
            });

            this._getSeasons();
        }
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
        const { emitAPIRequest, show } = this.props;
        const { episodes, loadingEpisodes, visibleSeasons } = this.state;

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
        const { show } = this.props;

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
                <Col span={8}>
                    <h3>{show.title}</h3>
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

        let episodeList = [];

        episodes[seasonID].forEach((episode)=>{
            const el = <div key={episode.id}
                            className="ib-shows-seasonlist-episode-row">
                            {episode.episode_number}. {episode.title}
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

export default connect(mapStateToProps, mapDispatchToProps)(SeasonsList);