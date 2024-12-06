CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    top_contributor BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(100),
    featured_date DATE
);

--Trigger to update top_contributor column in users table
CREATE OR REPLACE FUNCTION update_top_contributor() RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET top_contributor = (
        SELECT COUNT(*) >= 3
        FROM comments
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_top_contributor
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION update_top_contributor();

