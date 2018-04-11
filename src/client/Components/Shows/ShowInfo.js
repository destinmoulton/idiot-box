import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Card, Col, Icon, Row, Spin } from "antd";

import { callAPI } from "../../actions/api.actions";

import SeasonTabs from "./SeasonTabs";

class ShowInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingShow: true,
            show: {}
        };
    }

    componentWillMount() {
        this._getShowInfo();
    }

    _getShowInfo() {
        const { callAPI } = this.props;

        this.setState({
            isLoadingShow: true
        });
        const params = {
            slug: this.props.match.params.slug
        };

        callAPI(
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
        const { callAPI } = this.props;
        const { show } = this.state;

        const params = {
            show_id: show.id
        };

        callAPI(
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
        const { isLoadingShow, show } = this.state;

        const showInfo = this._buildShowInfo();

        let seasonsBar = "";
        let episodesTable = "";
        if (!isLoadingShow) {
            seasonsBar = (
                <SeasonTabs
                    show={show}
                    history={this.props.history}
                    match={this.props.match}
                />
            );
        }

        return (
            <div>
                <Row>{showInfo}</Row>
                <Row>{seasonsBar}</Row>
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
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo);
