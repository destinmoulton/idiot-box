import path from 'path';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import GenresModel from './GenresModel';
import MoviesModel from './MoviesModel';
import MovieToGenreModel from './MovieToGenreModel';

describe("MoviesModel", ()=>{
    let genresModel = {};
    let moviesModel = {};
    let movieToGenreModel = {};
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
                genresModel = new GenresModel(ibdb);
                movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
                moviesModel = new MoviesModel(ibdb, movieToGenreModel);
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

    it("adds multiple movies; verifies random fields and genres", ()=>{
        const [dataOne, expectedDataOne] = _getFirstTestData();
        const [dataTwo, expectedDataTwo] = _getSecondTestData();
        const imagefilenameOne = "independenceday.jpg";
        const imagefilenameSecond = "armageddon.jpg";
        expect.assertions(9);
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
                // Check a random field
                expect(movies[1].image_filename).toBe(imagefilenameOne);

                // Get the genres for the first movie
                return movieToGenreModel.getAllGenresForMovie(movies[0].id);
            })
            .then((genres)=>{
                expect(genres.length).toBe(3);
                expect(genres[2].slug).toBe('scifi');

                // Get all the genres
                return genresModel.getAll();
            })
            .then((genres)=>{
                expect(genres.length).toBe(4);
            })
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
        },
        genres: ['action', 'scifi', 'comedy']
    };

    let expected = Object.assign({},data);
    delete expected.genres;
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
        },
        genres: ['action', 'scifi', 'documentary']
    };

    let expected = Object.assign({},data);
    delete expected.ids;
    delete expected.genres;
    expected.trakt_id = data.ids.trakt;
    expected.imdb_id = data.ids.imdb;
    expected.tmdb_id = data.ids.tmdb;
    return [data, expected];
}
