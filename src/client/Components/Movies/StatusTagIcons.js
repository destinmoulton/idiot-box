import PropTypes from "prop-types";
import React from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import { StatusTagsLib, STATUS_TAGS } from "../../lib/StatusTags.lib";

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

            const tagIcon = isTagEnabled
                ? tag.icons.active
                : tag.icons.inactive;

            const tagClass = isTagEnabled ? "active" : "inactive";
            return (
                <Button
                    key={tagIndex}
                    size="small"
                    className={"movie-tag-" + tag.tag + " " + tagClass}
                    onClick={() => this._handleToggleStatusTag(tag.tag)}
                >
                    {tagIcon}
                </Button>
            );
        });

        return <ButtonGroup size="small">{tagList}</ButtonGroup>;
    }
}

export default StatusTagIcons;
