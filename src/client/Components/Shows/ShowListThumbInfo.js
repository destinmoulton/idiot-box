import React from "react";

import { Link } from "react-router-dom";

import { Col, Icon, Tag } from "antd";

export default props => {
    const { show } = props;
    const showTitle = {
        __html: show.title
    };
    return (
        <div>
            <Link to={"/show/" + show.slug}>
                <div className="ib-showlist-infobox-thumb-container">
                    <img
                        className="ib-showlist-infobox-thumb"
                        src={"/images/shows/" + show.image_filename}
                    />
                    <div className="ib-showlist-infobox-tags">
                        <Tag>
                            {show.num_seasons_locked}&nbsp;<Icon type="lock" />
                        </Tag>
                        <Tag>
                            {show.num_seasons_unlocked}&nbsp;<Icon type="unlock" />
                        </Tag>
                    </div>
                </div>
                <div className="ib-showlist-infobox-title">
                    <span dangerouslySetInnerHTML={showTitle} />
                </div>
            </Link>
        </div>
    );
};
