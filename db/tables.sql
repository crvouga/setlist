CREATE TABLE accounts (
    account_id UUID PRIMARY KEY,
    account_email TEXT NOT NULL
)

CREATE TABLE passwords (
    password_id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    password_hash TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
)

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
)

CREATE TABLE setlists (
    setlist_id UUID PRIMARY KEY,
    owner_id UUID NOT NULL,
    setlist_name TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES accounts(account_id)
)

CREATE TABLE artists (
    artist_id UUID PRIMARY KEY,
    artist_name TEXT NOT NULL,
    creator_id UUID NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES accounts(account_id)
)

CREATE TABLE songs (
    song_id UUID PRIMARY KEY,
    song_name TEXT NOT NULL,
    creator_id UUID NOT NULL,
    artist_id UUID NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES accounts(account_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
)


CREATE TABLE setlist_items (
    setlist_item_id UUID PRIMARY KEY,
    setlist_id UUID NOT NULL,
    song_id UUID NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    ordering INT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs(song_id),
    FOREIGN KEY (setlist_id) REFERENCES setlists(setlist_id)
)


CREATE TABLE setlist_accounts (
    setlist_accounts_id UUID PRIMARY KEY,
    setlist_id UUID NOT NULL,
    account_id UUID NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (setlist_id) REFERENCES setlists(setlist_id)
)
