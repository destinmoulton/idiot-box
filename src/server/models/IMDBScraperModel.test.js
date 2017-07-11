
import IMDBScraperModel from './IMDBScraperModel';

describe("IMDBScraperModel", ()=>{
    let imdbScraperModel = {};
    beforeEach(()=>{
        imdbScraperModel = new IMDBScraperModel();
    });

    it("gets the img src for a movie", ()=>{
        expect.assertions(2);
        return imdbScraperModel.getPosterURL('tt0116629')
            .then((url)=>{
                expect(url.startsWith('https')).toBe(true);
                expect(url.endsWith('jpg')).toBe(true);
            });
    })
});