import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Col, Modal, Row } from "antd";

import StatusTagIcons from "./StatusTagIcons";

import { emitAPIRequest } from "../../actions/api.actions";
class MovieInfoModal extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        movie: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        onClickToggleStatusTag: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this._handleCancelClose = this._handleCancelClose.bind(this);
        this._handleClickDelete = this._handleClickDelete.bind(this);
    }

    _handleCancelClose() {
        this.props.onClose(false);
    }

    _handleClickDelete() {
        this.props.onClickDelete(this.props.movie);
    }

    render() {
        const {
            onClickDelete,
            onClickToggleStatusTag,
            isVisible,
            movie
        } = this.props;
        return (
            <Modal
                title="Movie Info"
                visible={isVisible}
                onCancel={this._handleCancelClose}
                footer={[
                    <Button
                        key="close"
                        size="small"
                        onClick={this._handleCancelClose}
                    >
                        Close
                    </Button>
                ]}
                width={700}
            >
                <Row>
                    <Col span={5}>
                        <div className="ib-movies-thumbnail-box">
                            <img
                                className="ib-movies-thumbnail"
                                src={"/images/movies/" + movie.image_filename}
                            />
                        </div>
                    </Col>
                    <Col span={18} offset={1}>
                        <h3 dangerouslySetInnerHTML={{ __html: movie.title }} />
                        <h4>
                            {movie.year}&nbsp;|&nbsp;
                            <a
                                href={"http://imdb.com/title/" + movie.imdb_id}
                                target="_blank"
                            >
                                IMDB
                            </a>&nbsp;
                            <StatusTagIcons
                                movie={movie}
                                onClickToggleStatusTag={onClickToggleStatusTag}
                            />
                            <Button
                                onClick={this._handleClickDelete}
                                type="danger"
                                size="small"
                            >
                                Delete
                            </Button>
                        </h4>

                        <p>{movie.overview}</p>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch) =>
            dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieInfoModal);
