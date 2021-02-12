import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import AddShowModal from "./AddShowModal/AddShowModal";
import ShowListThumbInfo from "./ShowListThumbInfo";

class ShowsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: "",
            isLoadingShows: false,
            isAddShowModalVisible: false,
            shows: [],
        };
    }

    componentDidMount() {
        this._getShows();
    }

    _getShows() {
        const { callAPI } = this.props;

        this.setState({
            isLoadingShows: true,
        });

        callAPI(
            "shows.shows.get_all_with_locked_info",
            {},
            this._showsReceived.bind(this),
            false
        );
    }

    _showsReceived(shows) {
        let newShows = [];
        shows.forEach((show) => {
            show["is_visible"] = true;
            show["searchable_text"] = this._prepStringForFilter(show.title);
            newShows.push(show);
        });

        this.setState({
            isLoadingShows: false,
            shows: newShows,
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
            currentSearchString,
        });

        this._filterVisibleShows(currentSearchString);
    }

    _filterVisibleShows(searchString) {
        const { shows } = this.state;
        const filterText = this._prepStringForFilter(searchString);
        let filteredShows = [];

        shows.forEach((show) => {
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
            shows: filteredShows,
        });
    }

    _handleCheckPressEnter(e) {
        if (e.key === "Enter") {
            this._handleOpenAddShowModal();
        }
    }

    _handleOpenAddShowModal() {
        this.setState({
            isAddShowModalVisible: true,
        });
    }

    _cancelAddShowModal() {
        this.setState({
            isAddShowModalVisible: false,
        });
    }

    _addShowComplete() {
        this.setState({
            isAddShowModalVisible: false,
        });

        this._getShows();
    }

    _buildShowList() {
        const { shows } = this.state;

        let showList = [];
        shows.forEach((show) => {
            if (show.is_visible) {
                showList.push(<ShowListThumbInfo key={show.id} show={show} />);
            }
        });

        return showList;
    }

    render() {
        const {
            currentSearchString,
            isAddShowModalVisible,
            isLoadingShows,
            shows,
        } = this.state;

        let content = "";
        if (isLoadingShows) {
            content = (
                <div className="ib-spinner-container">
                    <CircularProgress />
                </div>
            );
        } else {
            content = this._buildShowList();
        }

        const filterPlaceholder = `Filter ${shows.length} shows...`;
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2>Shows</h2>
                </Grid>
                <Grid item xs={12} className="ib-showlist-searchbar">
                    <TextField
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        onKeyPress={this._handleCheckPressEnter.bind(this)}
                        style={{ width: 250 }}
                        placeholder={filterPlaceholder}
                    />
                    &nbsp;&nbsp;
                    <Button
                        className="ib-button-green"
                        onClick={this._handleOpenAddShowModal.bind(this)}
                    >
                        Add New Show
                    </Button>
                </Grid>
                <Grid item container xs={12}>
                    {content}
                </Grid>
                <AddShowModal
                    callAPI={this.props.callAPI}
                    isVisible={isAddShowModalVisible}
                    onCancel={this._cancelAddShowModal.bind(this)}
                    onAddShowComplete={this._addShowComplete.bind(this)}
                    currentSearchString={currentSearchString}
                />
            </Grid>
        );
    }
}

ShowsList.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default ShowsList;
