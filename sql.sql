CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    event_no SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE invites (
    event_no INT NOT NULL,
    invitee VARCHAR NOT NULL,
    invited VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_no) REFERENCES events(event_no),
    FOREIGN KEY (invitee) REFERENCES users(user_id),
    FOREIGN KEY (invited) REFERENCES users(user_id)
);

CREATE TABLE token_store (
    user_id VARCHAR NOT NULL,
    token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);