## NOTE

This was originally hosted on a private repo on bitbucket. I had to obfuscate some things, search for `REMOVED`.

## 3rd party stuff:

- https://github.com/zweicoder/react-redux-express-boilerplate (Boilerplate)
- https://github.com/JedWatson/classnames
- https://github.com/facebook/react
- https://github.com/reduxjs/redux
- https://github.com/reduxjs/redux-thunk
- https://github.com/axios/axios
- https://github.com/kelektiv/node.bcrypt.js/
- https://github.com/sequelize/sequelize
- https://github.com/expressjs/express
- https://github.com/babel/babel
- https://github.com/kelektiv/node-uuid
- https://github.com/motdotla/dotenv
- https://github.com/mpneuried/nodecache
- https://github.com/newrelic/node-newrelic
- https://github.com/richardgirges/express-fileupload
- https://github.com/expressjs/session
- https://github.com/react-dropzone/react-dropzone 
- https://fontawesome.com/
- https://fonts.google.com/specimen/Nunito
- https://reactstrap.github.io
- https://ipstack.com/
- https://www.bingmapsportal.com/
- https://console.cloud.google.com/google/maps-apis/overview/
- https://material-ui.com

## Data structures

### Choices

```
{
    id: 1,
    description: "Get High",
    followUpQuestionId: 2,
    questionId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
},
```

### Questions

```
{
    id: 1,
    question: "Get High or Get Relief?",
    finalQuestion: false,
    createdAt: new Date(),
    updatedAt: new Date()
},
```

### Strains

```
{
    id: 1,
    name: "Cinex",
    type: "Hybrid",
    description:
    "A hybrid of Cinderella 99 and Vortex, Cinex smells of sweet citrus, and earthy skunk with a clear-headed and uplifting effect. Great for building a positive mindset and stimulating creative energy.",
    imgSrc: "images/cannabis.jpg",
    choices: [1, 3, 15, 18],
    createdAt: new Date(),
    updatedAt: new Date()
}
```

# Dispensaries

We use Google maps to find the nearest dispensary, then marshal the details of that dispensary into the following format:

```
{
    id: 0,
    place_id: "ChIJQ-2n9UinlVQRtok7iWEbk7o",
    name: "Bloom Dispensary - Portland",
    address: "2637 NE Martin Luther King Jr Blvd, Portland, OR 97212, USA",
    zip: "97212",
    lat: 45.541476,
    lng: -122.661936,
    accountId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
}
```

# Accounts

```
{
    id: 2,
    email: "fakedispensary@highhelper.com",
    password: "some hash created by bcrypt",
    pending: false,
    isDispensary: true,
    isAdmin: false,
    token: '3e11a971-fee4-42fa-93d8-d6268bb74a30',
    tokenExpiration: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
}
```

### Age Verification

```
{
    id: 1
    isover21: true,
    zip: "97071",
    ip: "127.0.0.1",
    createdAt: new Date(),
    updatedAt: new Date()
}
```

Note: Zip is a string!

## Getting started

1. Pull down the code.
   `git clone https://github.com/daffinito/dmh.git`

2. cd to the dir git created
   `cd dmh`

3. Install deps
   `yarn install-dev`

4. Get the `.env` file from David
   This project requires a .env file to run locally. 

5. Start dev server
   `yarn dev`

6. Then you can visit http://localhost:3000. And any changes to the code you make to the code will get hot-reloaded,

**Running the docker container**

1. cd to the highhelper directory

2. Build the docker image. There is a "." at the end of this command, make sure to include it.
   `docker build -t dmh .`

3. Run the docker image
   `docker run --rm -p 5000:5000 -it dmh`

4. Check out the app on http://localhost:5000

_You might be wondering, why is it port 3000 for dev but 5000 for docker? The truth is, both are used in both cases. Port 3000 is actually the react app, and port 5000 is the backend app. In Dev, we connect to the react app and it proxies requests to the backend (look in /client/package.json for the "proxy" field). However, for production, we are compiling the react app to static, optimized files, so we can serve them up from the backend (see backend/server.js), which is much quicker. (If we ever decouple the backend from the frontend, we could just use something like nginx to serve the production build instead.)_

## Deploy

**Any updates to the master branch will automatically trigger the BitBucket pipeline to push a new build to AWS.**

Manual instructions:

### AWS

To configure AWS CLI and SDK (need to do this for dynamodb access if running locally, this configures your shared cred file):

- `aws configure`
- Access key: `REMOVED`
- Secret access key: `REMOVED`
- Default region: `us-west-2`

To deploy image to ECR:

- `aws ecr get-login --no-include-email --region us-west-2`
- Copy and run the docker login command produced and run that
- `/scripts/build.sh`
- `docker tag dmh:latest REMOVED.dkr.ecr.us-west-2.amazonaws.com/dmh:latest`
- `docker push REMOVED.dkr.ecr.us-west-2.amazonaws.com/dmh:latest`
- `aws ecs update-service --force-new-deployment --cluster dmh-cluster --service dmh-service`

## DB stuff

# Dev

```
DB_HOST=REMOVED.us-west-2.rds.amazonaws.com
DB_PORT=REMOVED
DB_USER=REMOVED
DB_PASSWORD=REMOVED
DB_NAME=REMOVED
```

# PROD

```
DB_HOST=REMOVED.us-west-2.rds.amazonaws.com
DB_PORT=REMOVED
DB_USER=REMOVED
DB_PASSWORD=REMOVED
DB_NAME=REMOVED
```