import express from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "./middleware/logger.js";
import { Logger } from "./utils/Logger.js";

const app = express();
app.use(express.json());

// In-memory array to store books
let books = [];

// attach a request ID with every request
// in the http req context
app.use((req, res, next) => {
  req.reqId = uuidv4();
  next();
});

// attach a user ID with every request
// in the http req context
app.use((req, res, next) => {
  // will get the user ID from the JWT
  req.userId = req.body.userId;
  next();
});

// add the logger middleware to log every request
app.use(logger);

// Get all books
app.get("/books", (req, res) => {
  Logger.debug(
    `User: ${req.userId} - requested list of books, RequestId: ${req.reqId}`
  );
  res.json(books);
});

// Get a specific book by ID
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);
  if (book) {
    Logger.debug(`User: ${req.userId} - requested book #${bookId}`);
    res.json(book);
  } else {
    Logger.error(`User: ${req.userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  }
});

// Create a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  Logger.debug(`User: ${req.userId} - created book #${newBook.id}`);
  res.status(201).json(newBook);
});

// Update a book
app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  let updatedBook = false;
  books = books.map((book) => {
    if (book.id === bookId) {
      updatedBook = true;
      return { id: book.id, title, author };
    }
    return book;
  });
  if (updatedBook) {
    Logger.debug(`User: ${req.userId} - updated book #${bookId}`);
    res.json({ message: "Book updated successfully" });
  } else {
    Logger.error(`User: ${req.userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const initialLength = books.length;
  books = books.filter((book) => book.id !== bookId);
  if (books.length === initialLength) {
    Logger.error(`User: ${req.userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  } else {
    Logger.debug(`User: ${req.userId} - deleted book #${bookId}`);
    res.json({ message: "Book deleted successfully" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
