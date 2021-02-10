import React from "react";

import { Link } from "react-router-dom";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";

export default (props) => {
    const { show } = props;
    const showTitle = {
        __html: show.title,
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
                        <span>
                            {show.num_seasons_locked}&nbsp;
                            <LockIcon />
                        </span>
                        <span>
                            {show.num_seasons_unlocked}&nbsp;
                            <LockOpenIcon />
                        </span>
                    </div>
                </div>
                <div className="ib-showlist-infobox-title">
                    <span dangerouslySetInnerHTML={showTitle} />
                </div>
            </Link>
        </div>
    );
};
