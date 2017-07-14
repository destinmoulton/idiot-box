-- Up
CREATE TABLE settings (
    id INTEGER PRIMARY KEY, 
    category TEXT, 
    key TEXT, 
    value TEXT
);

INSERT INTO settings (category, key, value) VALUES ("directories", "downloads", "");
INSERT INTO settings (category, key, value) VALUES ("directories", "movies", "");
INSERT INTO settings (category, key, value) VALUES ("directories", "shows", "");
INSERT INTO settings (category, key, value) VALUES ("directories", "trash", "");
INSERT INTO settings (category, key, value) VALUES ("directories", "youtube", "");

CREATE TABLE genres (
    id INTEGER PRIMARY KEY,
    slug TEXT,
    name TEXT
);

CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    year INTEGER,
    tagline TEXT,
    overview TEXT,
    released TEXT,
    runtime INTEGER,
    rating REAL,
    slug TEXT,
    trakt_id INTEGER,
    imdb_id TEXT,
    tmdb_id INTEGER,
    image_filename TEXT,
    has_watched INTEGER
);

CREATE TABLE movie_to_genre (
    genre_id INTEGER,
    movie_id INTEGER,
    FOREIGN KEY(genre_id) REFERENCES genres(id) ON DELETE CASCADE,
    FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE shows (
    id INTEGER PRIMARY KEY,
    title TEXT,
    year INTEGER,
    overview TEXT,
    first_aired INTEGER,
    runtime INTEGER,
    network TEXT,
    status TEXT,
    rating REAL,
    updated_at INTEGER,
    slug TEXT,
    trakt_id INTEGER,
    tvdb_id INTEGER,
    imdb_id TEXT,
    tmdb_id INTEGER,
    tvrage_id INTEGER,
    image_filename TEXT
);

CREATE TABLE show_seasons (
    id INTEGER PRIMARY KEY,
    show_id INTEGER,
    season_number INTEGER,
    rating REAL,
    episode_count INTEGER,
    aired_episodes INTEGER,
    title TEXT,
    overview TEXT,
    first_aired INTEGER,
    trakt_id INTEGER,
    tvdb_id INTEGER,
    tmdb_id INTEGER,
    tvrage_id INTEGER,
    FOREIGN KEY(show_id) REFERENCES shows(id) ON DELETE CASCADE
);

CREATE TABLE show_season_episodes (
    id INTEGER PRIMARY KEY,
    show_id INTEGER,
    season_id INTEGER,
    season_number INTEGER,
    episode_number INTEGER,
    title TEXT,
    overview TEXT,
    rating REAL,
    first_aired INTEGER,
    updated_at INTEGER,
    runtime INTEGER,
    trakt_id INTEGER,
    tvdb_id INTEGER,
    imdb_id TEXT,
    tmdb_id INTEGER,
    tvrage_id INTEGER,
    has_watched INTEGER,
    FOREIGN KEY(show_id) REFERENCES shows(id) ON DELETE CASCADE,
    FOREIGN KEY(season_id) REFERENCES show_seasons(id) ON DELETE CASCADE
);

CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    directory_setting_id INTEGER,
    subpath TEXT,
    filename TEXT,
    mediatype TEXT,
    FOREIGN KEY(directory_setting_id) REFERENCES settings(id) ON DELETE CASCADE
);

CREATE TABLE file_to_episode (
    file_id INTEGER,
    show_id INTEGER,
    season_id INTEGER,
    episode_id INTEGER,
    FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
    FOREIGN KEY(show_id) REFERENCES shows(id) ON DELETE CASCADE,
    FOREIGN KEY(season_id) REFERENCES show_seasons(id) ON DELETE CASCADE,
    FOREIGN KEY(episode_id) REFERENCES show_season_episodes(id) ON DELETE CASCADE
);

CREATE TABLE file_to_movie (
    file_id INTEGER,
    movie_id INTEGER,
    FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
    FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Down
