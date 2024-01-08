const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require("method-override");
const { Pool } = require("pg");
const { log } = require("console");
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "css")));
app.use("/css", express.static("public/css"));
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1200000 }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Inventory",
  password: "victor",
  port: 5432,
});

const requireLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/');
  }
};

app.get("/", (req,res) => {
  res.render("load.ejs")
})

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("regin.ejs");
});

app.get("/testrun", (req, res) => {
  res.render("test.ejs");
});

app.get("/barcode", (req, res) => {
  res.render("barcode.ejs");
});

app.get("/customerservice", (req, res) => {
  res.render("customer.ejs");
});

app.get("/logedout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
})


// I have defined saltRounds below in my code
const saltRounds = 10;

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    // Check if email is registered
    const checkEmailQuery = 'SELECT * FROM "user" WHERE email = $1';
    const emailResult = await pool.query(checkEmailQuery, [email]);

    if (emailResult.rows.length === 0) {
      return res.send('<script>alert("Email not registered"); window.location.href = "/"; </script>');
    }

    const user = emailResult.rows[0];

    // Compare the provided password with the stored hash
    bcrypt.compare(pass, user.pass, (err, passwordMatch) => {
      if (err || !passwordMatch) {
        console.error('Invalid password:', err);
        return res.send('<script>alert("Invalid email or password"); window.location.href = "/"; </script>');
      }

      // Set user information in session
      req.session.user = { name: user.username, email: user.email };

      res.send('<script>alert("Welcome, ' + user.u_name + '!"); window.location.href = "/home"; </script>');
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.send('<script>alert("Internal Server Error"); window.location.href = "/"; </script>');
  }
});



app.post("/register", async (req, res) => {
  const { name, f_name, l_name, email, pass } = req.body;

  try {
    // Check if email is already registered
    const checkEmailQuery = 'SELECT * FROM "user" WHERE email = $1';
    const emailResult = await pool.query(checkEmailQuery, [email]);

    if (emailResult.rows.length > 0) {
      return res.send('<script>alert("Email already registered"); window.location.href = "/register"; </script>');
    }

    // Hash the password
    const hash = await bcrypt.hash(pass, saltRounds);

    // Insert the user into the database
    const insertQuery =
      'INSERT INTO "user" (username, email, password, f_name, l_name) VALUES ($1, $2, $3, $4, $5)';
    const values = [name, email, hash, f_name, l_name];

    await pool.query(insertQuery, values);

    res.send('<script>alert("You are successfully registered as a new Admin"); window.location.href = "/"; </script>');
  } catch (error) {
    console.error('Error during registration:', error);
    res.send('<script>alert("Internal Server Error"); window.location.href = "/register"; </script>');
  }
});


app.post("/home", (req, res) => {
  const { item, Qty, category, cost, exp, id } = req.body;

  const expirationDate = new Date(exp);

  if (expirationDate <= new Date()) {
    res.send(
      '<script>alert("Expiration date has already passed. Please enter a valid date."); window.location.href = "/home"; </script>'
    );
    return;
  }

  const insertQuery =
    "INSERT INTO new_items (item_name, item_qty, item_category, item_price, exp_date, id) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [item, Qty, category, cost, exp, id];

  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.send(
        '<script>alert("There was an error in submitting"); window.location.href = "/home"; </script>'
      );
    } else {

    }
  });
  res.redirect("/home");
});


app.get("/home", async (req, res) => {
  try {
    const itemdata = await pool.query("SELECT * FROM new_items");
    const data = itemdata.rows;
    res.render("home.ejs", { data });
  } catch (error) {
    console.error("Error executing query", error);
    if (process.env.NODE_ENV === 'development') {
      res.status(500).send(`Error occurred while fetching data: ${error.message}`);
    } else {
      res.status(500).send("Error occurred while fetching data.");
    }
  }
});

app.get("/newproduct", (req, res) => {
  res.render("newproduct.ejs")
})

app.get("/newsale", (req, res) => {
  res.render("addsale.ejs")
})

app.get("/error", (req, res) => {
  res.render("error.ejs")
})

app.get("/invoice", (req, res) => {
  const invoiceexist = 'views/invoice.ejs';

  fs.access(invoiceexist, fs.constants.F_OK, (err) => {
    if (err) {
      res.redirect('/error');
    } else {
      res.redirect('/invoice');
    }
  })
})

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
        '<script>alert("There was an error in updating"); window.location.href = "/home"; </script>'
      );
    } else {
      res.send(
        '<script>alert("The product details were updated successfuly"); window.location.href = "/home"; </script>'
      );
    }
  });
});


app.post('/sale', (req, res) => {
  const { item_id, item_name, Qty, category, cost } = req.body;

  // Step 1: Get item price from the database
  const getCostQuery = 'SELECT item_price FROM new_items WHERE id = $1';
  const getCostValues = [item_id];

  pool.query(getCostQuery, getCostValues, (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error occurred while fetching item cost.');
    } else {
      if (result.rows.length === 0) {
        res.send('<script>alert("No item with such ID!!!"); window.location.href = "/sale"; </script>');
        return;
      }

      const itemCost = result.rows[0].item_price;

      // Step 2: Check if the provided cost matches the item's price
      if (itemCost !== cost) {
        res.send('<script>alert("The provided price does not match the item\'s price."); window.location.href = "/sale"; </script>');
        return;
      }

      // Step 3: Get current quantity of the item
      const getQtyQuery = 'SELECT item_qty FROM new_items WHERE id = $1';
      const getQtyValues = [item_id];

      pool.query(getQtyQuery, getQtyValues, (error, result) => {
        if (error) {
          console.error('Error executing query', error);
          res.status(500).send('Error occurred while fetching item quantity.');
        } else {
          if (result.rows.length === 0) {
            res.send('<script>alert("No item with such ID!!!"); window.location.href = "/sale"; </script>');
            return;
          }

          const currentQty = result.rows[0].item_qty;

          // Step 4: Check if the quantity is sufficient for the sale
          if (currentQty >= Qty) {
            // Step 5: Calculate total cost
            const total_price = Qty * cost;

            // Step 6: Set the current date and time
            const currentDate = new Date().toISOString();

            // Step 7: Insert sale record into the database
            const insertSalesQuery = 'INSERT INTO sales (id, item_name, item_qty, item_category, item_price, total_price, sale_date) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            const salesValues = [item_id, item_name, Qty, category, cost, total_price, currentDate];

            pool.query(insertSalesQuery, salesValues, (error, result) => {
              if (error) {
                console.error('Error executing query', error);
                res.status(500).send('Error occurred while registering sale.');
              } else {
                // Step 8: Update item quantity in the database
                const updateQtyQuery = 'UPDATE new_items SET item_qty = item_qty - $1 WHERE id = $2';
                const updateValues = [Qty, item_id];

                pool.query(updateQtyQuery, updateValues, (error, result) => {
                  if (error) {
                    console.error('Error executing query', error);
                    res.status(500).send('Error occurred while updating quantity.');
                  } else {
                    console.log(currentQty);

                    // Step 9: Check if the quantity is zero and remove the item from the database
                    if (currentQty - Qty <= 0) {
                      const removeItemQuery = 'DELETE FROM new_items WHERE id = $1';
                      const removeItemValues = [item_id];

                      pool.query(removeItemQuery, removeItemValues, (error, result) => {
                        if (error) {
                          console.error('Error executing query', error);
                          res.status(500).send('Error occurred while removing item.');
                        } else {
                          res.send('<script>alert("The product sales were successful recorded!!!"); window.location.href = "/sale"; </script>');
                        }
                      });
                    } else {
                      res.send('<script>alert("The product sales were successful recorded!!!"); window.location.href = "/sale"; </script>');
                    }
                  }
                });
              }
            });
          } else {
            res.status(400).send('<script>alert("The product sales were not recorded!!!"); window.location.href = "/sale"; </script>');
          }
        }
      });
    }
  });
});


app.get('/sale', (req, res) => {

  const sessionData = req.session;

  const getSalesQuery = 'SELECT * FROM sales ORDER BY sale_date DESC';
  pool.query(getSalesQuery, (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error occurred while fetching sales details.');
    } else {
      const salesDetails = result.rows;
      const groupedSales = {};

      salesDetails.forEach(sale => {
        const saleDate = sale.sale_date ? sale.sale_date.toISOString().split('T')[0] : 'N/A';
        if (!groupedSales[saleDate]) {
          groupedSales[saleDate] = [];
        }
        groupedSales[saleDate].push(sale);
      });

      res.render('sales.ejs', { groupedSales });
    }
  });
});


//----------------------------------------code for barcode----------------------------------//
// const salesDatabase = [];

// app.use(bodyParser.json());

// app.post('/scan', (req, res) => {
//   const { barcode, quantity } = req.body;
//   const product = productsDatabase[barcode];

//   if(product) {
//     const totalPrice = product.price * quantity;

//     // Register the sale
//     const saleDetails = {
//       barcode,
//       productName: product.name,
//       quantity,
//       totalPrice,
//       timestamp: new Date(),
//     };

//     salesDatabase.push(saleDetails);

//     // Update inventory (in a real system, you might decrement the quantity)

//     res.json({ success: true, message: 'Sale registered successfully', saleDetails });
//   } else {
//     res.json({ success: false, message: 'Product not found' });
//   }
// });

// app.get('/sales', (req, res) => {
//   res.json(salesDatabase);
// });



app.listen(3000, (req, res) => {
  console.log("App on Port 3000 Active");
});
