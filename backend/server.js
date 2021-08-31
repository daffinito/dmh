const newrelic = require("newrelic");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");
const cors = require("cors");
const api = require("./routes/api");
//const sessionSecret = `${uuid()}_${uuid()}_${uuid()}`;
const sessionSecret = `REMOVED`;
const secure = process.env.NODE_ENV === "development" ? false : true;
const cookieDomain = process.env.NODE_ENV === "development" ? null : ".dialmyhigh.com";
const app = express();
const corsOptions = {
  origin: "*"
};
const MemcachedStore = require("connect-memcached")(session);
const sessionStoreEndpoint = process.env.AWS_MEMCACHE_ENDPOINT; // use a local memcached instance for dev. no public access to aws endpoints
//const sessionStoreSecret = `${uuid()}_${uuid()}_${uuid()}`;
const sessionStoreSecret = `REMOVED`;
app.set("trust proxy", true); // requests are proxied through the frontend

app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(
  session({
    key: "user_sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 30 * 1000, // 1 month,
      secure: secure,
      domain: cookieDomain
    },
    store: new MemcachedStore({
      hosts: [sessionStoreEndpoint],
      secret: sessionStoreSecret,
      ttl: 60 * 60 * 24 * 30 // 1 month
    })
  })
);
app.use(cookieParser());

// This makes sure the session is still active. If not, it deletes the cookie
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// API route
app.use("/api", api);

// catch all
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`server listening on ${port}`); // eslint-disable-line no-console
