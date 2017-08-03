import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Button, Icon, Row, Spin, Table } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import PlayButton from '../PlayButton';

class EpisodesTable extends Component {
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
            selectedEpisodeKeys: []
        }
    }

    componentWillMount(){
        this._shouldGetEpisodes(this.props);
    }

    componentWillReceiveProps(nextProps){
        this._shouldGetEpisodes(nextProps);
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

    _changeSelectedEpisodesWatchedStatus(newWatchedStatus){
        const { selectedEpisodeKeys } = this.state;
        const { activeSeasonNum, emitAPIRequest } = this.props;

        const params = {
            episode_ids: selectedEpisodeKeys,
            watched_status: newWatchedStatus
        };
        emitAPIRequest("shows.episodes.toggle_watched", params, this._getEpisodes.bind(this, activeSeasonNum), false);
    }

    _handleSelectEpisodeTableRow(selectedEpisodeKeys){
        this.setState({
            selectedEpisodeKeys
        });
    }

    _buildEpisodesTable(){
        const { episodes, selectedEpisodeKeys } = this.state;
        const { directories } = this.props;

        let columns = this._episodeTableColumns();

        let rowSelection = {
            selectedEpisodeKeys,
            onChange: this._handleSelectEpisodeTableRow.bind(this)
        };

        const locale = {
            emptyText: "No episodes found."
        }

        
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

    _episodeTableColumns(){
        const { directories } = this.props;

        return [
            {
                title: "Num",
                dataIndex: "episode_number"
            },
            {
                title: <Icon type="check"/>,
                render: (text, record) =>{
                    let iconType = "";
                    if(record.watched === 1){
                        iconType = "check";
                    } else {
                        iconType = "minus";
                    }
                    return <Icon type={iconType} />
                }

            },
            {
                title: "Name",
                dataIndex: "title"
            },
            {
                title: <Icon type="play-circle" className="ib-playbutton-icon"/>,
                render: (text, record) => {
                    if(record.file_info.hasOwnProperty('id')){
                        const fullPath = directories.Shows + "/" + record.file_info.subpath;
                        return <PlayButton filename={record.file_info.filename} fullPath={fullPath} />;
                    }
                }
            }
        ];
    }

    _buildEpisodesList(){
        const { episodes } = this.state;
        const { directories } = this.props;

        let episodeList = [];

        episodes.forEach((episode)=>{
            let playButton = "";

            
            const el = <div key={episode.id}
                            className="ib-shows-seasonlist-episode-row">
                            {playButton}{episode.episode_number}. {episode.title}
                        </div>;
            episodeList.push(el);
        });
        return episodeList;
    }

    _buildButtons(){

        return (
            <div>
                <Button.Group>
                    <Button onClick={this._changeSelectedEpisodesWatchedStatus.bind(this, 1)}>
                        Toggle to Watched
                    </Button>
                    <Button onClick={this._changeSelectedEpisodesWatchedStatus.bind(this, 0)}>
                        Toggle to UnWatched
                    </Button>
                </Button.Group>
            </div>
        );
    }

    render() {
        const { activeSeasonNum } = this.props;
        const {
            selectedSeasonNum,
            isLoadingEpisodes,
        } = this.state;

        let episodeList = "";
        if(selectedSeasonNum > -1){
            if(isLoadingEpisodes){
                episodeList = <Spin />;
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

export default connect(mapStateToProps, mapDispatchToProps)(EpisodesTable);