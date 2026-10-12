
const axios = require("axios");
const express = require("express");
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get all books
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});

// Get book details by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book);
});

// Get books by author
public_users.get("/author/:author", (req, res) => {
    const result = {};

    for (const isbn in books) {
        if (books[isbn].author === req.params.author) {
            result[isbn] = books[isbn];
        }
    }

    return res.status(200).json(result);
});

// Get books by title
public_users.get("/title/:title", (req, res) => {
    const result = {};

    for (const isbn in books) {
        if (books[isbn].title === req.params.title) {
            result[isbn] = books[isbn];
        }
    }

    return res.status(200).json(result);
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book.reviews);
});

// Task 10 - Get all books using Axios and async/await
async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Task 11 - Get book details by ISBN using Axios
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Task 12 - Get books by author using Axios
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Task 13 - Get books by title using Axios
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
