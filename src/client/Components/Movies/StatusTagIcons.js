import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { Icon, Tooltip } from "antd";

import StatusTagsLib from "../../lib/StatusTags.lib";
import { emitAPIRequest } from "../../actions/api.actions";

const STATUS_TAGS = [
    {
        title: "Watch List",
        tag: "towatch",
        icons: {
            active: "eye",
            inactive: "eye-o"
        },
        classes: {
            active: "ib-movies-statustag-towatch-active",
            inactive: "ib-movies-statustag-towatch-inactive"
        }
    },
    {
        title: "Favorite",
        tag: "favorite",
        icons: {
            active: "star",
            inactive: "star-o"
        },
        classes: {
            active: "ib-movies-statustag-favorite-active",
            inactive: "ib-movies-statustag-favorite-inactive"
        }
    }
];

class StatusTagIcons extends React.Component {
    static propTypes = {
        movie: PropTypes.object.isRequired,
        onClickToggleStatusTag: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleToggleStatusTag(tagName) {
        this.props.onClickToggleStatusTag(this.props.movie, tagName);
    }

    render() {
        const { movie } = this.props;

        const tagList = STATUS_TAGS.map((tag, tagIndex) => {
            let tagType = tag.icons.inactive;

            return (
                <Tooltip key={tagIndex} title={tag.title}>
                    <Icon
                        type={tagType}
                        size="large"
                        onClick={this._handleToggleStatusTag.bind(
                            this,
                            tag.tag
                        )}
                    />
                </Tooltip>
            );
        });

        return <div className="">{tagList}</div>;
    }
}

export default StatusTagIcons;
