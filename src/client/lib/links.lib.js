function linksReplaceCodesForEpisode(link, epInfo, showInfo) {
    let newLink = link;

    newLink = newLink.replace(
        "{SHOW_TITLE}",
        encodeURIComponent(showInfo.title)
    );

    if (newLink.includes("{SEASON_##}")) {
        let sNum =
            epInfo.season_number < 10
                ? "0" + epInfo.season_number
                : epInfo.season_number;
        newLink = newLink.replace("{SEASON_##}", encodeURIComponent(sNum));
    }

    if (newLink.includes("{EPISODE_##}")) {
        let eNum =
            epInfo.episode_number < 10
                ? "0" + epInfo.episode_number
                : epInfo.episode_number;
        newLink = newLink.replace("{EPISODE_##}", encodeURIComponent(eNum));
    }

    return newLink;
}

export { linksReplaceCodesForEpisode };
