const logger = require("../logger");

import FilesModel from "./db/FilesModel";
import FilesystemModel from "./FilesystemModel";
import FileToEpisodeModel from "./db/FileToEpisodeModel";
import FileToMovieModel from "./db/FileToMovieModel";
import MediaScraperModel from "./MediaScraperModel";
import MoviesModel from "./db/MoviesModel";
import SettingsModel from "./db/SettingsModel";
import ShowsModel from "./db/ShowsModel";
import ShowSeasonEpisodesModel from "./db/ShowSeasonEpisodesModel";
import ShowSeasonsModel from "./db/ShowSeasonsModel";
export default class IDModel {
    _filesModel: FilesModel;
    _filesystemModel: FilesystemModel;
    _fileToEpisodeModel: FileToEpisodeModel;
    _fileToMovieModel: FileToMovieModel;
    _mediaScraperModel: MediaScraperModel;
    _moviesModel: MoviesModel;
    _settingsModel: SettingsModel;
    _showsModel: ShowsModel;
    _showSeasonsModel: ShowSeasonsModel;
    _showSeasonEpisodesModel: ShowSeasonEpisodesModel;
    constructor(models) {
        this._filesystemModel = models.filesystemModel;
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }

    async idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo) {
        const imageFilename = this._buildThumbFilename(movieInfo);
        await this._filesystemModel.moveInSetDir(
            sourceInfo,
            destInfo,
            "Movies"
        );

        let newFilename = "";
        if (imageURL !== "") {
            newFilename = await this._mediaScraperModel.downloadThumbnail(
                "movies",
                imageURL,
                imageFilename
            );
        }
        const movieRow = await this._moviesModel.addMovie(
            movieInfo,
            newFilename
        );
        return await this._addMovieFileAssociations(movieRow, destInfo);
    }

    /**
     * Add the file info to the db and the movie-to-file
     * association using that info.
     *
     * @param Movie movie
     * @param object destInfo
     */
    async _addMovieFileAssociations(movie, destInfo) {
        const destSetting = await this._settingsModel.getSingle(
            "directories",
            "Movies"
        );

        const possibleExisting = await this._fileToMovieModel.getSingleForMovie(
            movie.id
        );

        if ("file_id" in possibleExisting) {
            // Remove the current file association
            if (possibleExisting.file_id !== null) {
                await this._filesModel.deleteSingle(possibleExisting.file_id);
            }

            await this._fileToMovieModel.deleteSingle(
                possibleExisting.file_id,
                movie.id
            );
        }

        const fileRow = await this._filesModel.addFile(
            destSetting.id,
            destInfo.subpath,
            destInfo.filename,
            "movie"
        );
        return await this._fileToMovieModel.add(fileRow.id, movie.id);
    }

    async idAndArchiveEpisode(epInfo, sourceInfo, destInfo) {
        // Setup the directory
        await this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Shows");
        const destSetting = await this._settingsModel.getSingle(
            "directories",
            "Shows"
        );

        // Remove possible existing files and associations
        await this._removeExistingEpisodeAssoc(
            epInfo.episode_id,
            destSetting.id,
            destInfo.subpath,
            destInfo.filename
        );

        // Add the new file
        const fileRow = await this._filesModel.addFile(
            destSetting.id,
            destInfo.subpath,
            destInfo.filename,
            "show"
        );
        // Create the new association
        return await this._fileToEpisodeModel.add(
            fileRow.id,
            epInfo.show_id,
            epInfo.season_id,
            epInfo.episode_id
        );
    }

    async idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo) {
        const episodesToMove = idInfo.episodes;
        const filenames = Object.keys(episodesToMove);

        let res = [];
        for (const filename of filenames) {
            const episode = episodesToMove[filename];
            const dest = {
                filename: episode.newFilename,
                subpath: destSubpath,
            };

            const source = {
                setting_id: sourcePathInfo.setting_id,
                subpath: sourcePathInfo.subpath,
                filename,
            };

            const epInfo = {
                show_id: idInfo.show_id,
                season_id: idInfo.season_id,
                episode_id: episode.selectedEpisodeID,
            };

            res.push(await this.idAndArchiveEpisode(epInfo, source, dest));
        }
        return res;
    }

    async removeMultipleIDs(itemsToRemove) {
        let res = [];
        for (const item of itemsToRemove) {
            res.push(await this.removeSingleID(item.assocData));
        }
        return res;
    }

    async removeSingleID(idInfo) {
        if (idInfo.type === "movie") {
            return await this._removeMovie(idInfo);
        } else if (idInfo.type === "show") {
            return await this._removeEpisodeFileAssociations(idInfo);
        }
    }

    /**
     * Remove any existing file-to-episodes and files
     * for an episode.
     *
     * @param episode_id
     * @param dest_setting_id
     * @param dest_subpath
     * @param dest_filename
     */
    async _removeExistingEpisodeAssoc(
        episode_id,
        dest_setting_id,
        dest_subpath,
        dest_filename
    ) {
        // Check if the episode is already associated
        const possibleLinks = await this._fileToEpisodeModel.getAllForEpisode(
            episode_id
        );

        // Remove the file and episode association if it exists

        for (const link of possibleLinks) {
            if (link.file_id !== null) {
                await this._filesModel.deleteSingle(link.file_id);
            }
            await this._fileToEpisodeModel.deleteSingleForEpisode(
                link.episode_id
            );
        }

        const possibleFiles = await this._filesModel.getAllForDirectoryAndFilename(
            dest_setting_id,
            dest_subpath,
            dest_filename
        );

        for (const file of possibleFiles) {
            await this._fileToEpisodeModel.deleteSingleByFileID(file.id);
            await this._filesModel.deleteSingle(file.id);
        }
    }

    /**
     * Remove a movie and the file-to-movie associated with it.
     *
     * The movie is deleted because movies are 1:1 with files.
     *
     * @param object idInfo
     */
    async _removeMovie(idInfo) {
        await this._filesModel.deleteSingle(idInfo.file_id);
        await this._fileToMovieModel.deleteSingle(
            idInfo.file_id,
            idInfo.movie_id
        );
        return await this._moviesModel.deleteSingle(idInfo.movie_id);
    }

    /**
     * Remove the file and file-to-episode associating for a show episode.
     *
     * This does not remove the show as Shows are not directly tied to episodes.
     *
     * @param object idInfo
     */
    async _removeEpisodeFileAssociations(idInfo) {
        await this._filesModel.deleteSingle(idInfo.file_id);
        return await this._fileToEpisodeModel.deleteSingle(
            idInfo.file_id,
            idInfo.episode_id
        );
    }

    async addShow(showInfo, imageInfo) {
        const imageFilename = this._buildThumbFilename(showInfo);
        const newFilename = await this._mediaScraperModel.downloadThumbnail(
            "shows",
            imageInfo.url,
            imageFilename
        );
        const show = await this._showsModel.addShow(showInfo, newFilename);
        return await this._scrapeAndAddSeasonsForShow(show);
    }

    _buildThumbFilename(mediaInfo) {
        return mediaInfo.title + "." + mediaInfo.year;
    }

    /**
     * Scrape and add the seasons (and episodes)
     * for a show.
     *
     * @param Show show
     */
    async _scrapeAndAddSeasonsForShow(show) {
        const seasons = await this._mediaScraperModel.getShowSeasonsList(
            show.trakt_id
        );
        const addedSeasons = await this._showSeasonsModel.addArrayOfSeasons(
            seasons,
            show.id
        );
        return await this._scrapeAndAddEpisodesForSeasons(show, addedSeasons);
    }

    /**
     * Scrape the episodes for an array of seasons and
     * add them to the db.
     *
     * @param Show show
     * @param ShowSeasons seasons for a show
     */
    async _scrapeAndAddEpisodesForSeasons(show, seasons) {
        for (const season of seasons) {
            try {
                const episodesArr = await this._mediaScraperModel.getEpisodesForSeason(
                    show.trakt_id,
                    season.season_number
                );
                await this._showSeasonEpisodesModel.addArrEpisodes(
                    show.id,
                    season.id,
                    episodesArr
                );
            } catch (err) {
                throw new Error(
                    "IDModel :: _scrapeAndAddEpisodesForSeasons + " + err
                );
            }
        }
    }
}
