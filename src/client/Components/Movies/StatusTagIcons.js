import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { StatusTagsLib, STATUS_TAGS } from "../../lib/StatusTags.lib";
import { callAPI } from "../../actions/api.actions";

class StatusTagIcons extends React.Component {
    static propTypes = {
        movie: PropTypes.object.isRequired,
        onClickToggleStatusTag: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    _handleToggleStatusTag(tagName) {
        this.props.onClickToggleStatusTag(this.props.movie, tagName);
    }

    render() {
        const { movie } = this.props;

        const statusTagsLib = new StatusTagsLib();

        const tagList = STATUS_TAGS.map((tag, tagIndex) => {
            const isTagEnabled = statusTagsLib.isTagEnabled(
                movie.status_tags,
                tag.tag
            );

            const tagType = isTagEnabled
                ? tag.icons.active
                : tag.icons.inactive;

            const tagClass = isTagEnabled
                ? tag.classes.active
                : tag.classes.inactive;
            return (
                <Tooltip key={tagIndex} title={tag.title}>
                    {/* <Icon
                        type={tagType}
                        size="large"
                        className={tagClass}
                        onClick={this._handleToggleStatusTag.bind(
                            this,
                            tag.tag
                        )}
                    /> */}
                </Tooltip>
            );
        });

        return <span>{tagList}</span>;
    }
}

export default StatusTagIcons;
