import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Card, Col, Icon, Row, Spin } from "antd";

import { emitAPIRequest } from "../../actions/api.actions";

import EpisodesTable from "./EpisodesTable";
import SeasonTabs from "./SeasonTabs";

class ShowInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSeasonNum: -1,
            isLoadingShow: true,
            show: {}
        };
    }

    componentWillMount() {
        this._getShowInfo();
        this._parseActiveSeason(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._parseActiveSeason(nextProps);
    }

    _parseActiveSeason(props) {
        const { match } = props;
        const { activeSeasonNum } = this.state;

        if (match.params.season_id !== undefined) {
            if (match.params.season_id !== activeSeasonNum) {
                this.setState({
                    activeSeasonNum: parseInt(match.params.season_id)
                });
            }
        }
    }

    _getShowInfo() {
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingShow: true
        });
        const params = {
            slug: this.props.match.params.slug
        };

        emitAPIRequest(
            "shows.show.get_for_slug",
            params,
            this._showInfoReceived.bind(this),
            false
        );
    }

    _showInfoReceived(show) {
        this.setState({
            isLoadingShow: false,
            show
        });
    }

    _deleteShow() {
        const { emitAPIRequest } = this.props;
        const { show } = this.state;

        const params = {
            show_id: show.id
        };

        emitAPIRequest(
            "shows.show.delete",
            params,
            this._showDeleted.bind(this),
            false
        );
    }

    _showDeleted() {
        // The subpath has changed so go there
        const location = {
            pathname: "/shows"
        };
        this.props.history.push(location);
    }

    _handlePressDelete() {
        const { show } = this.state;

        if (confirm(`Really delete ${show.title}`)) {
            this._deleteShow();
        }
    }

    _buildShowInfo() {
        const { show } = this.state;

        return (
            <div>
                <Col span={4}>
                    <div className="ib-show-info-thumbnail-box">
                        <img
                            className="ib-show-info-thumb"
                            src={"/images/shows/" + show.image_filename}
                        />
                    </div>
                </Col>
                <Col span={14} offset={1}>
                    <h3>{show.title}</h3>
                    <h4>
                        <a
                            href={"http://imdb.com/title/" + show.imdb_id}
                            target="_blank"
                        >
                            IMDB
                        </a>&nbsp;|&nbsp;
                        {show.year}&nbsp;&nbsp;&nbsp;
                        <Button
                            type="danger"
                            onClick={this._handlePressDelete.bind(this)}
                            size="small"
                        >
                            <Icon type="delete" />Delete Show
                        </Button>
                    </h4>
                    <p>{show.overview}</p>
                </Col>
            </div>
        );
    }

    render() {
        const { activeSeasonNum, isLoadingShow, show } = this.state;

        const showInfo = this._buildShowInfo();

        let seasonsBar = "";
        let episodesTable = "";
        if (!isLoadingShow) {
            seasonsBar = (
                <SeasonTabs
                    activeSeasonNum={activeSeasonNum}
                    show={show}
                    history={this.props.history}
                />
            );
            if (activeSeasonNum > -1) {
                episodesTable = (
                    <EpisodesTable
                        activeSeasonNum={activeSeasonNum}
                        show={show}
                    />
                );
            }
        }

        return (
            <div>
                <Row>{showInfo}</Row>
                <Row>
                    <Card title="Seasons">
                        {seasonsBar}
                        {episodesTable}
                    </Card>
                </Row>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo);
