import path from 'path';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import GenresModel from './GenresModel';

describe("GenresModel", ()=>{
    let genresModel = {};
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
            });
    });

    afterEach(()=>{
        ibdb.close();
    });

    it("adds a genre", ()=>{
        expect.assertions(2);

        return genresModel.addGenre("testone")
            .then((row)=>{
                expect(row.slug).toBe('testone');
                expect(row.name).toBe('Testone');
            });
    });

    it("can add multiple genres and get multiple", ()=>{
        expect.assertions(6);

        return genresModel.addGenre("testone") 
            .then((row)=>{
                expect(row.slug).toBe('testone');
                expect(row.name).toBe('Testone');
                return genresModel.addGenre("testtwo");
            })
            .then((row)=>{
                expect(row.slug).toBe('testtwo');
                expect(row.name).toBe('Testtwo');
                return genresModel.getAll();
            })
            .then((rows)=>{
                expect(rows.length).toBe(2);
                expect(rows[1].slug).toBe('testtwo');
            });
    });

    it("adds unique genres", ()=>{
        return genresModel.addGenreIfDoesntExist('testone')
                    .then((row)=>{
                        logger.debug("genretest", row.length);
                    })
    });
});