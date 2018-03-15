import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Button, Col, Input, Row, Spin } from "antd";

import { emitAPIRequest } from "../../actions/api.actions";

import AddShowModal from "./AddShowModal";
import ShowListThumbInfo from "./ShowListThumbInfo";

class ShowsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: "",
            isLoadingShows: false,
            isAddShowModalVisible: false,
            shows: []
        };
    }

    componentWillMount() {
        this._getShows();
    }

    _getShows() {
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingShows: true
        });

        emitAPIRequest(
            "shows.shows.get_all_with_locked_info",
            {},
            this._showsReceived.bind(this),
            false
        );
    }

    _showsReceived(shows) {
        let newShows = [];
        shows.forEach(show => {
            show["is_visible"] = true;
            show["searchable_text"] = this._prepStringForFilter(show.title);
            newShows.push(show);
        });

        this.setState({
            isLoadingShows: false,
            shows: newShows
        });

        this._filterVisibleShows(this.state.currentSearchString);
    }

    _prepStringForFilter(title) {
        const lowerTitle = title.toLowerCase();
        return lowerTitle.replace(/[^a-z0-9]/g, "");
    }

    _handleChangeFilter(evt) {
        const currentSearchString = evt.currentTarget.value;

        this.setState({
            currentSearchString
        });

        this._filterVisibleShows(currentSearchString);
    }

    _filterVisibleShows(searchString) {
        const { shows } = this.state;
        const filterText = this._prepStringForFilter(searchString);
        let filteredShows = [];

        shows.forEach(show => {
            if (filterText === "") {
                show.is_visible = true;
            } else {
                show.is_visible = true;
                if (show.searchable_text.search(filterText) === -1) {
                    show.is_visible = false;
                }
            }
            filteredShows.push(show);
        });

        this.setState({
            shows: filteredShows
        });
    }

    _handleCheckPressEnter(e) {
        if (e.key === "Enter") {
            this._handleOpenAddShowModal();
        }
    }

    _handleOpenAddShowModal() {
        this.setState({
            isAddShowModalVisible: true
        });
    }

    _cancelAddShowModal() {
        this.setState({
            isAddShowModalVisible: false
        });
    }

    _addShowComplete() {
        this.setState({
            isAddShowModalVisible: false
        });

        this._getShows();
    }

    _buildShowList() {
        const { shows } = this.state;

        let showList = [];
        shows.forEach(show => {
            if (show.is_visible) {
                showList.push(
                    <Col key={show.id} className="ib-showlist-infobox" span={4}>
                        <ShowListThumbInfo show={show} />
                    </Col>
                );
            }
        });

        return showList;
    }

    render() {
        const {
            currentSearchString,
            isAddShowModalVisible,
            isLoadingShows,
            shows
        } = this.state;

        let content = "";
        if (isLoadingShows) {
            content = (
                <div className="ib-spinner-container">
                    <Spin />
                </div>
            );
        } else {
            content = this._buildShowList();
        }

        const filterPlaceholder = `Filter ${shows.length} shows...`;
        return (
            <div>
                <Row>
                    <h2>Shows</h2>
                </Row>
                <Row className="ib-showlist-searchbar">
                    <Input.Search
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        onKeyPress={this._handleCheckPressEnter.bind(this)}
                        style={{ width: 400 }}
                        placeholder={filterPlaceholder}
                    />
                    &nbsp;&nbsp;
                    <Button
                        className="ib-button-green"
                        onClick={this._handleOpenAddShowModal.bind(this)}
                    >
                        Add New Show
                    </Button>
                </Row>
                <Row>{content}</Row>
                <AddShowModal
                    isVisible={isAddShowModalVisible}
                    onCancel={this._cancelAddShowModal.bind(this)}
                    onAddShowComplete={this._addShowComplete.bind(this)}
                    currentSearchString={currentSearchString}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowsList);
