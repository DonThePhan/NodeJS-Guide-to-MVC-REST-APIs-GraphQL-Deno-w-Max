/**
 *  1. Install "graphql" & "express-graphql"
 * 
 *  2.  CREATE a "graphql" folder and inside that create a "schema.js" & "resolvers.js":
 *        1.  QUERIES
 *        2.  MUTATIONS
 *
 *  3.  IMPORT graphql middleware (see code below)
 *
 *  4.  IMPORT schema & resolver we created (see code below)
 *
 *  5.  Impliment the graphql middleware w/ schema & resolver (see code below)
 *
 *  6.  TEST out GraphQL:
 * 
 *      a) via Postman - make post request to "http://localhost:<PORT#>/graphql" (in this case port was 8080)) for
 *        1. QUERY:
 *          - Body:
 *            - raw
 *            - JSON (change "Text" to JSON)
 *            - {
 *                "query": "{ hello {text views}}"
 *              }
 * 
 *        OR
 *
 *        b)  via GraphiQL:
 *            1.  add "graphiql: true" in graphqlHTTP (see code below)
 *            2.  Go to "http://localhost:<PORT#>/graphql" (in this case port was 8080)
 *            3.  QUERY: "query {hello {text views}}"
 *              
 *                OR
 * 
 *                MUTATION: 
 *                 "mutation {
 *                    createUser(userInput: {email:"test1@test.com", name: "Donny", password:"test"}) {
 *                      _id 
 *                      email 
 *                    }
 *                  }"
 *            4.  Hit the Play button to make the request
 * 
 *   7. Make it compatible with Front End - add "OPTIONS" code (see code below)
 */

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

/** 3. Import graphql */
const { graphqlHTTP } = require('express-graphql');

/** 4. Import schema & resolver we created earlier */
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  /**7. Make code Front End Compatible by adding this if statement */
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next();
});

/** 5. Impliment the graphql middleware w/ schema & resolver (note we use "use" vs "post") */
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,

    /** 6.b.1 this code (directly below) provides user interface via "http://localhost:8080/graphql". 8080 because that's what we specified as our port in this project */
    graphiql: true,
  }),
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    /** if we need a new access point, refer to Max's video #179 - Setting Up MongoDB */
    'mongodb+srv://donny:LetsLearn66@cluster0.p1fgwtk.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
