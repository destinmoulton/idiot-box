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
});