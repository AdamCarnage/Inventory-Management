const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { Pool } = require("pg");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "css")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventory",
  password: "victorjr",
  port: 8080,
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/loged-in", (req, res) => {
  res.render("loged-in");
});

app.get("/register", (req, res) => {
  res.render("regin.ejs");
});

app.post("/home", (req, res) => {
  const { email, name, pass } = req.body;

  const checkUserQuery =
    'SELECT * FROM "user" WHERE email = $1 AND password = $2 AND username = $3';
  const values = [email, pass, name];

  pool.query(checkUserQuery, values, (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.send("Error occurred during login.");
    } else {
      if (result.rows.length > 0) {
        res.send(` <script>
                alert('Welcome, ${name}!');
                window.location.href = '/logedIn'; 
                </script>`);
      } else {
        res.send(`<script>
                alert('Invalid credentials. Please try again.');
                window.location.href = '/'; 
                </script>`);
      }
    }
  });
});

app.post("/regin", (req, res) => {
  const { name, f_name, l_name, email, pass } = req.body;

  const insertQuery =
    'INSERT INTO "user" (username, email, password, f_name, l_name) VALUES ($1, $2, $3, $4, $5)';
  const values = [name, email, pass, f_name, l_name];

  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.send(
        '<script>alert("There was an error in submitting"); window.location.href = "/register"; </script>'
      );
    } else {
      res.send(
        '<script>alert("Your successful registered as new Admin"); window.location.href = "/home"; </script>'
      );
    }
  });
});

app.post("/loged-in", (req, res) => {
  const { item, Qty, category, cost, exp, id } = req.body;

  const insertQuery =
    "INSERT INTO new_items (item_name, item_qty, item_category, item_price, exp_date, id) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [item, Qty, category, cost, exp, id];

  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.send(
        '<script>alert("There was an error in submitting"); window.location.href = "/loged-in"; </script>'
      );
    } else {
      res.redirect("/logedIn");
    }
  });
});

app.get("/logedIn", (req, res) => {
  pool.query("SELECT * FROM new_items", (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.status(500).send("Error occurred while fetching data.");
    } else {
      const data = result.rows;
      res.render("loged-in.ejs", { data: data });
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const itemId = req.params.id;

  pool.query(
    "DELETE FROM new_items WHERE id = $1",
    [itemId],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Error occurred while deleting data." });
      } else {
        res.json({ message: "Data deleted successfully" });
      }
    }
  );
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const itemId = req.params.id;

  pool.query(
    "SELECT * FROM new_items WHERE id = $1",
    [itemId],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Error occurred while fetching data.");
      } else {
        const item = result.rows[0];

        res.render("update.ejs", { item });
      }
    }
  );
});

app.post("/edit/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedItemDetails = req.body;

  const updateQuery =
    "UPDATE new_items SET item_name = $1, item_qty = $2, item_category = $3, item_price = $4, exp_date = $5 WHERE id = $6";
  const values = [
    updatedItemDetails.item,
    updatedItemDetails.Qty,
    updatedItemDetails.category,
    updatedItemDetails.cost,
    updatedItemDetails.exp,
    itemId,
  ];

  pool.query(updateQuery, values, (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.send(
        '<script>alert("There was an error in updating"); window.location.href = "/logedIn"; </script>'
      );
    } else {
      res.send(
        '<script>alert("The product details were updated successfuly"); window.location.href = "/logedIn"; </script>'
      );
    }
  });
});

app.listen(3000, (req, res) => {
  console.log("App on Port 3000 Active");
});
