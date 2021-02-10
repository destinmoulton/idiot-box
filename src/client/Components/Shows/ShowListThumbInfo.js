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
                <div className="showlist-infobox-thumb-container">
                    <img src={"/images/shows/" + show.image_filename} />
                    <div className="showlist-infobox-tags">
                        <span>
                            {show.num_seasons_locked}
                            <LockIcon />
                        </span>
                        <span>
                            {show.num_seasons_unlocked}
                            <LockOpenIcon />
                        </span>
                    </div>
                </div>
                <div className="showlist-infobox-title">
                    <span dangerouslySetInnerHTML={showTitle} />
                </div>
            </Link>
        </div>
    );
};
