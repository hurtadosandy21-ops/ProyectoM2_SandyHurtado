CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS authors (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) > 0),
    email      VARCHAR(100) NOT NULL UNIQUE,
    bio        TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id  UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    title      VARCHAR(200) NOT NULL CHECK (char_length(trim(title)) > 0),
    content    TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
    published  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts ALTER COLUMN author_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
