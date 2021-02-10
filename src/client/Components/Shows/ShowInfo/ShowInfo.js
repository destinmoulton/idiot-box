import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";

import SeasonTabs from "./SeasonTabs";

class ShowInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingShow: true,
            show: {},
        };
    }

    componentDidMount() {
        this._getShowInfo();
    }

    _getShowInfo() {
        const { callAPI } = this.props;

        this.setState({
            isLoadingShow: true,
        });
        const params = {
            slug: this.props.match.params.slug,
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
            show,
        });
    }

    _deleteShow() {
        const { callAPI } = this.props;
        const { show } = this.state;

        const params = {
            show_id: show.id,
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
            pathname: "/shows",
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
            <Grid container>
                <Grid item xs={2}>
                    <div className="ib-show-info-thumbnail-box">
                        <img
                            className="ib-show-info-thumb"
                            src={"/images/shows/" + show.image_filename}
                        />
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <h3>{show.title}</h3>
                    <h4>
                        <a
                            href={"http://imdb.com/title/" + show.imdb_id}
                            target="_blank"
                        >
                            IMDB
                        </a>
                        &nbsp;|&nbsp;
                        {show.year}&nbsp;&nbsp;&nbsp;
                        <Button
                            type="danger"
                            onClick={this._handlePressDelete.bind(this)}
                            size="small"
                        >
                            <DeleteIcon />
                            Delete Show
                        </Button>
                    </h4>
                    <p>{show.overview}</p>
                </Grid>
            </Grid>
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
                    callAPI={this.props.callAPI}
                    settings={this.props.settings}
                    history={this.props.history}
                    match={this.props.match}
                />
            );
        }

        return (
            <Grid container>
                <Grid item xs={12}>
                    {showInfo}
                </Grid>
                <Grid item xs={12}>
                    {seasonsBar}
                </Grid>
            </Grid>
        );
    }
}

ShowInfo.propTypes = {
    callAPI: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
};

export default ShowInfo;
