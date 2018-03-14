import React from "react";

import { Link } from "react-router-dom";

import { Col, Icon, Tag } from "antd";

export default props => {
    const { show } = props;
    const showTitle = {
        __html: _.truncate(show.title, { length: 18 })
    };
    return (
        <div>
            <Link to={"/show/" + show.slug}>
                <img
                    className="ib-shows-thumbnail"
                    src={"/images/shows/" + show.image_filename}
                />
                <span dangerouslySetInnerHTML={showTitle} />
                <br />
                <Tag>
                    {show.num_seasons_locked}&nbsp;<Icon type="lock" />
                </Tag>
                <Tag>
                    {show.num_seasons_unlocked}&nbsp;<Icon type="unlock" />
                </Tag>
            </Link>
        </div>
    );
};
