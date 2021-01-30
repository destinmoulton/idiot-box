import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Col, Spin } from "antd";

import { callAPI } from "../../actions/api.actions";

const MAX_IMAGE_RETRIES = 2;

class MediaItemSearchDetails extends Component {
    static propTypes = {
        onSelectItem: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            imageURL: "",
            imageRetryCount: 0,
            imageStatus: "loading",
        };
    }

    componentWillMount() {
        this._getImageFromServer();
    }

    _getImageFromServer() {
        const { callAPI, item } = this.props;

        if (item.ids.imdb === null) {
            this.setState({
                imageStatus: "no_imdb_page",
            });

            return;
        }

        const options = {
            imdb_id: item.ids.imdb,
        };

        setTimeout(() => {
            // Get images staggered so the first
            // item gets the image quicker
            callAPI(
                "imdb.image.get",
                options,
                this._imageReceived.bind(this),
                false
            );
        }, 500 * this.props.resultNumber);
    }

    _handleSelectMovie(item) {
        const { onSelectItem } = this.props;
        const { imageURL } = this.state;

        onSelectItem(item, imageURL);
    }

    _imageReceived(responseObj) {
        const { imageRetryCount } = this.state;
        if (
            responseObj.imageURL === undefined &&
            imageRetryCount < MAX_IMAGE_RETRIES
        ) {
            this.setState({
                imageRetryCount: imageRetryCount + 1,
            });

            //Retry getting image
            this._getImageFromServer();
        } else if (responseObj.imageURL === undefined) {
            this.setState({
                imageStatus: "no_imdb_image",
            });
        } else {
            this.setState({
                imageStatus: "found",
                imageURL: responseObj.imageURL,
            });
        }
    }

    render() {
        const { imageStatus, imageURL } = this.state;
        const { item, onSelectItem } = this.props;

        let image = <Spin />;
        if (imageStatus === "found") {
            image = (
                <img
                    src={imageURL}
                    className={"ib-idmodal-item-search-details-img"}
                />
            );
        } else if (imageStatus === "no_imdb_image") {
            image = <span>No IMDB image available.</span>;
        } else if (imageStatus === "no_imdb_page") {
            image = <span>No IMDB page.</span>;
        }

        let itemTitle = { __html: item.title };
        return (
            <Col
                span={5}
                key={item.ids.trakt}
                className="ib-idmodal-item-search-details-box"
            >
                <Button
                    type="primary"
                    icon="check"
                    onClick={this._handleSelectMovie.bind(this, item)}
                >
                    This Is It
                </Button>
                <div className="ib-idmodal-item-search-details-img-box">
                    {image}
                </div>
                <div>
                    <b>
                        <span dangerouslySetInnerHTML={itemTitle} />
                    </b>
                    <br />
                    {item.year} -{" "}
                    <a
                        href={"http://imdb.com/title/" + item.ids.imdb}
                        target="_blank"
                    >
                        IMDB
                    </a>
                    <br />
                </div>
            </Col>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaItemSearchDetails);
