CREATE TABLE books
(
    code   VARCHAR(50)  NOT NULL PRIMARY KEY,
    title  VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    stock  INT          NOT NULL
);

CREATE TABLE members
(
    code VARCHAR(50)  NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    end_penalty_at TIMESTAMP
);

CREATE TABLE book_member_borrows
(
    id          BIGINT      NOT NULL PRIMARY KEY AUTO_INCREMENT,
    book_code   VARCHAR(50) NOT NULL,
    member_code VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_member_book_code FOREIGN KEY (book_code) REFERENCES books (code) ON DELETE CASCADE,
    CONSTRAINT fk_book_member_member_code FOREIGN KEY (member_code) REFERENCES members (code) ON DELETE CASCADE
);
