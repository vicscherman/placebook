// const fs = require('fs');
// const path = require('path')

const express = require('express');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const fileDelete = require('./middleware/file-delete')

const url =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ci8ul.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
//for dealing with json data from front end
app.use(express.json());
//for serving static image files. Let's see what happens on deployment
// app.use('/uploads/images',express.static(path.join('uploads','images')))
// app.use(express.static(path.join('public')))


//to prevent CORS errors. All domains have access. Could also just use cors npm but at least this helps understand how to set things
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


//for bad routes
// app.use((req, res, next) => {
//   const error = new HttpError('Could Not find this route', 404);
//   throw error;
// });

//4 parameters, express treats it as an error handling middleware
app.use((error, req, res, next) => {
  
  if (req.file) {
    fileDelete(req.file.location)
    // fs.unlink(req.file.path, (err) => {
    //   console.log(err);
    // });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred' });
});

//prevents a couple deprecation warnings
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
