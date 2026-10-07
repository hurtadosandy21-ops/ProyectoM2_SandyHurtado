INSERT INTO authors (name, email, bio) VALUES
    ('Sandy Hurtado', 'sandy@example.com', 'Desarrolladora Full Stack'),
    ('Carlos Pérez',  'carlos@example.com', 'Backend developer apasionado por PostgreSQL'),
    ('Lucía Gómez',   'lucia@example.com',  NULL)
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (author_id, title, content, published)
SELECT a.id, p.title, p.content, p.published
FROM (VALUES
    ('sandy@example.com',  'Mi primer post en MiniBlog', 'Bienvenidos a mi blog sobre desarrollo web.', TRUE),
    ('sandy@example.com',  'Express + PostgreSQL',       'Cómo conectar Express con PostgreSQL usando Pool.', FALSE),
    ('carlos@example.com', 'Constraints en SQL',         'PK, FK, UNIQUE y NOT NULL explicados con ejemplos.', TRUE)
) AS p(email, title, content, published)
JOIN authors a ON a.email = p.email
WHERE NOT EXISTS (
    SELECT 1 FROM posts x WHERE x.author_id = a.id AND x.title = p.title
);
