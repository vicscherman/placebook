You will need to have a couple of credentials set up to use this app.

Here are links to some documentation

[AWS S3](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

[Google Maps API](https://developers.google.com/maps/documentation/places/web-service/overview)

Once you have the appropriate credentials, enter them in the .env file in the front end, and the nodemon.json file in the back end. You can then start the front and back end with npm start and view the working app @ localhost:3000

For deployment, you'll need to create a back end server with something like heroku, and deploy the front end to a separate host, like  heroku or netlify, for example. 