const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require('jsonwebtoken')

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    authorsCount: () => Author.collection.countDocuments(),
    booksCount: () => Book.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      let books;
      const author = await Author.find({ name: args.author });

      if (args.author && args.genre) {
        books = await Book.find({ author, genres: args.genre }).populate(
          "author"
        );
      } else if (args.author) {
        books = await Book.find({ author }).populate("author");
      } else if (args.genre) {
        books = await Book.find({ genres: args.genre }).populate("author");
      } else {
        books = await Book.find({}).populate("author");
      }
      return books;
    },

    findAuthor: async (root, args) => await Author.findOne({ name: args.name }),

    me: (root, args, context) => context.currentUser,
  },

  /*
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => root.born,
    bookCount: 0,
  },

  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: (root) => authors.find((person) => person.name === root.author),
    id: (root) => root.id,
    genres: (root) => root.genres,
  },
  */

  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author });

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!author) {
        author = new Author({ name: args.author, bookCount: 1 });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving new Author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      } else {
        author.bookCount += 1;
        await author.save();
      }

      let book = new Book({ ...args, author: author });
      try {
        await book.save();
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Saving Book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const person = await Author.findOne({ name: args.name });
      person.born = args.setBornTo;
      try {
        person.save();
      } catch (error) {
        throw new GraphQLError("Saving born year failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong Credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
