const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const formatDate = require("../src/app/helper/formatDate");
const generateString = require("../src/app/helper/generateString");
const methodOverride = require("method-override");
const session = require("express-session");
const route = require("./routes");
const db = require("./config/db");
//Connect
db.connect();

const app = express();
const port = 9000;

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(methodOverride("_method"));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      formatDate: formatDate,
      generateString: generateString,
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resource", "views"));

//Route init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
