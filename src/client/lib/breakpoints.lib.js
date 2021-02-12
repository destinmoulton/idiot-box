/**
 * A list of the currently defined
 * breakpoints.
 */
const MEDIA_QUERY_BREAKPOINTS = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
};

function getCurrentBreakpoint() {
    const width = window.innerWidth;
    let activePoint = "";
    for (let brk in MEDIA_QUERY_BREAKPOINTS) {
        const pointPx = MEDIA_QUERY_BREAKPOINTS[brk];
        if (width >= pointPx) {
            activePoint = brk;
        }
    }
    return activePoint;
}

export { getCurrentBreakpoint };
