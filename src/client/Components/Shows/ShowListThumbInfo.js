import React from "react";

import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";

import { getCurrentBreakpoint } from "../../lib/breakpoints.lib";
export default (props) => {
    const { show } = props;
    const showTitle = {
        __html: show.title,
    };

    const breakpoint = getCurrentBreakpoint();
    const breakClass = "bpoint-" + breakpoint;
    return (
        <Grid
            item
            key={show.id}
            className={"ib-showlist-infobox " + breakClass}
            xs={4}
            md={2}
            sm={3}
            lg={2}
        >
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
        </Grid>
    );
};
