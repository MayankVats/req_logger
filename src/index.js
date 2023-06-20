import express from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "./middleware/logger.js";
import { Logger } from "./utils/Logger.js";
import httpContext from "express-http-context";

const app = express();
app.use(express.json());

// In-memory array to store books
let books = [];

app.use(httpContext.middleware);

// set reqId in http context
app.use((req, res, next) => {
  httpContext.set("reqId", uuidv4());
  next();
});

// set userId in http context
app.use((req, res, next) => {
  // will get the user ID from the JWT
  httpContext.set("userId", req.body.userId);
  next();
});

// add the logger middleware to log every request
app.use(logger);

// Get all books
app.get("/books", (req, res) => {
  const userId = httpContext.get("userId");
  const reqId = httpContext.get("reqId");

  Logger.debug(
    `User: ${userId} - requested list of books, RequestId: ${reqId}`
  );
  res.json(books);
});

// Get a specific book by ID
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);
  const userId = httpContext.get("userId");
  if (book) {
    Logger.debug(`User: ${userId} - requested book #${bookId}`);
    res.json(book);
  } else {
    Logger.error(`User: ${userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  }
});

// Create a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  const userId = httpContext.get("userId");
  books.push(newBook);
  Logger.debug(`User: ${userId} - created book #${newBook.id}`);
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

  const userId = httpContext.get("userId");
  if (updatedBook) {
    Logger.debug(`User: ${userId} - updated book #${bookId}`);
    res.json({ message: "Book updated successfully" });
  } else {
    Logger.error(`User: ${userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const initialLength = books.length;
  const userId = httpContext.get("userId");

  books = books.filter((book) => book.id !== bookId);

  if (books.length === initialLength) {
    Logger.error(`User: ${userId} - book #${bookId} not found`);
    res.status(404).json({ error: "Book not found" });
  } else {
    Logger.debug(`User: ${userId} - deleted book #${bookId}`);
    res.json({ message: "Book deleted successfully" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
