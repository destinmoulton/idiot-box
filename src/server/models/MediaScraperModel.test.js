import logger from '../logger';
import Trakt from 'trakt.tv';
import traktConfig from '../config/trakt.config';
import MediaScraperModel from './MediaScraperModel';

describe("MediaScrapeModel", ()=>{
    let traktInstance = {};
    let mediaScraper = {};
    beforeEach(()=>{
        traktInstance = new Trakt(traktConfig);
        mediaScraper = new MediaScraperModel(traktInstance);
    });
    test("finds movies", ()=>{
        expect.assertions(2);
        return mediaScraper.searchMovies('tron')
            .then((res)=>{
                expect(res[1].type).toBe('movie');
                expect(res[1].movie.title).toBe('TRON: Legacy');
            });
    });

    test("finds tv shows", ()=>{
        expect.assertions(2);
        return mediaScraper.searchShows('days')
            .then((res)=>{
                expect(res[1].type).toBe('show');
                expect(res[1].show.title).toBe('Day Break');
            });
    });

    test("get a summary of a show's seasons", ()=>{
        expect.assertions(1);
        return mediaScraper.getShowSeasonsList(107460)
            .then((res)=>{
                expect(res[2].ids.trakt).toBe(137165);
            })
    });

    test("get the episodes for a season", ()=>{
        expect.assertions(3);
        return mediaScraper.getEpisodesForSeason(107460, 1)
            .then((res)=>{
                expect(res.length).toBe(24);
                expect(res[9].number).toBe(10);
                expect(res[9].ids.trakt).toBe(2323304);
            });
    });
});