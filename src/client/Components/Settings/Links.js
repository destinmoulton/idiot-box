import React from "react";

import { connect } from "react-redux";
import LinkTable from "./Links/LinkTable";
import HelpTable from "./Links/HelpTable";

import { deleteSetting, saveSetting } from "../../actions/settings.actions";
import { callAPI } from "../../actions/api.actions";

const TYPES_OF_LINKS = [
    { name: "Episode", id: "link_for_episode" },
    { name: "Show", id: "link_for_show" },
    { name: "Movie", id: "link_for_movie" },
];
class Links extends React.Component {
    _handleSaveLink(linkset) {
        this.props.saveSetting(
            parseInt(linkset.id),
            "links",
            linkset.key,
            linkset.value
        );
    }
    _handleClickDelete(settingID) {
        this.props.deleteSetting(parseInt(settingID), "links");
    }
    render() {
        const { links } = this.props;
        return (
            <div>
                <LinkTable
                    links={links}
                    saveLink={(linkset) => this._handleSaveLink(linkset)}
                    onDelete={(settingID) => this._handleClickDelete(settingID)}
                    linkTypes={TYPES_OF_LINKS}
                />
                <HelpTable />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        serverInfo: state.server.serverInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch)),
        saveSetting: (settingID, category, key, value) =>
            dispatch(saveSetting(settingID, category, key, value)),
        deleteSetting: (settingID, category) =>
            dispatch(deleteSetting(settingID, category)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
