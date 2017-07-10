import path from 'path';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import MoviesModel from './MoviesModel';

describe("MoviesModel", ()=>{
    let moviesModel = {};
    beforeEach(() => {

        const dbConfig = {
            inMemory: true
        };

        const migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
        };

        return ibdb.connect(dbConfig)
            .then(() => {
                return ibdb._db.migrate(migConfig);
            })
            .then(()=>{
                moviesModel = new MoviesModel(ibdb);
            });
    });

    afterEach(()=>{
        ibdb.close();
    });

    it("adds a movie", ()=>{
        
        const [data, expected] = _getFirstTestData();
        const imagefilename = "independenceday.jpg";
        expect.assertions(2);
        return moviesModel.addMovie(data, imagefilename)
            .then((movie)=>{
                expect(movie).toMatchObject(expected);
                expect(movie.image_filename).toBe(imagefilename);
            });
    });

    it("adds multiple movies and gets them", ()=>{
        const [dataOne, expectedDataOne] = _getFirstTestData();
        const [dataTwo, expectedDataTwo] = _getSecondTestData();
        const imagefilenameOne = "independenceday.jpg";
        const imagefilenameSecond = "armageddon.jpg";
        expect.assertions(6);
        return moviesModel.addMovie(dataOne, imagefilenameOne)
            .then((movie)=>{
                expect(movie).toMatchObject(expectedDataOne);
                expect(movie.image_filename).toBe(imagefilenameOne);
                return moviesModel.addMovie(dataTwo, imagefilenameSecond);
            })
            .then((movieTwo)=>{
                expect(movieTwo).toMatchObject(expectedDataTwo);
                expect(movieTwo.image_filename).toBe(imagefilenameSecond);
                return moviesModel.getAll();
            })
            .then((movies)=>{
                expect(movies.length).toBe(2);
                expect(movies[1].image_filename).toBe(imagefilenameOne);
            });
    });
});

function _getFirstTestData(){
    const data = {
        title: "Independence Day",
        year: 1996,
        tagline: "Aliens don't use antivirus.",
        overview: "The aliens are coming!", 
        released: "1996-07-04",
        runtime: 145,
        rating: 9.9998,
        slug: "independence-day-1996",
        ids: {
            trakt: 123456,
            imdb: "imdbtest",
            tmdb: 98765,
        }
    };

    let expected = Object.assign({},data);
    delete expected.ids;
    expected.trakt_id = data.ids.trakt;
    expected.imdb_id = data.ids.imdb;
    expected.tmdb_id = data.ids.tmdb;
    return [data, expected];
}

function _getSecondTestData(){
    const data = {
        title: "Armageddon",
        year: 1998,
        tagline: "Astronauts can't mine.",
        overview: "The comet is coming!", 
        released: "1998-06-01",
        runtime: 130,
        rating: 8.231,
        slug: "armageddon-1998",
        ids: {
            trakt: 112233,
            imdb: "armaimdb",
            tmdb: 998877,
        }
    };

    let expected = Object.assign({},data);
    delete expected.ids;
    expected.trakt_id = data.ids.trakt;
    expected.imdb_id = data.ids.imdb;
    expected.tmdb_id = data.ids.tmdb;
    return [data, expected];
}
