import logger from '../logger';
import Trakt from 'trakt.tv';
import traktConfig from '../config/trakt.config';
import MediaScraperModel from './MediaScraperModel';

jest.autoMockOff(); 

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
                expect(res[1].ids.trakt).toBe(12601);
                expect(res[1].title).toBe('TRON: Legacy');
            });
    });

    test("finds tv shows", ()=>{
        expect.assertions(3);
        return mediaScraper.searchShows('days')
            .then((res)=>{
                expect(res[1].ids.trakt).toBe(4594);
                expect(res[1].title).toBe('Day Break');
                expect(res[1].status).toBe('ended');
            });
    });

    test("get a list of a show's seasons", ()=>{
        expect.assertions(2);
        return mediaScraper.getShowSeasonsList(107460)
            .then((res)=>{
                expect(res[2].ids.trakt).toBe(137165);
                expect(res[2].episode_count).toBe(1);
            })
    });

    test("get the episodes for a season", ()=>{
        expect.assertions(4);
        return mediaScraper.getEpisodesForSeason(107460, 1)
            .then((res)=>{
                expect(res.length).toBe(24);
                expect(res[9].number).toBe(10);
                expect(res[9].ids.trakt).toBe(2323304);
                expect(res[9].first_aired).toBe("2016-09-03T17:58:00.000Z");
            });
    });
});