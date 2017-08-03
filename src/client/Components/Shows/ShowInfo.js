import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Icon, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import EpisodesTable from './EpisodesTable';
import SeasonsBar from './SeasonsBar';

class ShowInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            activeSeasonNum: -1,
            isLoadingShow: true,
            show: {}
        };
    }

    componentWillMount(){
        this._getShowInfo();
        this._parseActiveSeason(this.props);
    }

    componentWillReceiveProps(nextProps){
        this._parseActiveSeason(nextProps);
    }

    _parseActiveSeason(props){
        const { match } = props;
        const { activeSeasonNum } = this.state;

        if(match.params.season_id !== undefined){
            if(match.params.season_id !== activeSeasonNum){
                this.setState({
                    activeSeasonNum: parseInt(match.params.season_id)
                });
            }
        }
    }

    _getShowInfo(){
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingShow: true
        })
        const params = {
            slug: this.props.match.params.slug
        };

        emitAPIRequest("shows.show.get_for_slug", params, this._showInfoReceived.bind(this), false);
    }

    _showInfoReceived(show){
        this.setState({
            isLoadingShow: false,
            show
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

    render() {
        const {
            activeSeasonNum,
            isLoadingShow,
            show
        } = this.state;

        const showInfo = this._buildShowInfo();
        
        let seasonsBar = "";
        let episodesTable = "";
        if (!isLoadingShow) {
            seasonsBar = <SeasonsBar activeSeasonNum={activeSeasonNum} show={show} />;
            episodesTable = <EpisodesTable activeSeasonNum={activeSeasonNum} show={show} />;
        }
        
        return (
            <div>
                <Row>
                    {showInfo}
                </Row>
                <Row>
                    {seasonsBar}
                </Row>
                <Row>
                    {episodesTable}
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