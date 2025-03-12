const bcrypt = require("bcrypt");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const SECRET_KEY = process.env.JWT_SECRET;

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());

// GET route - Allows to get all the items
// example: localhost:3000/clothes?page=0&perPage=2
app.get("/clothes", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const start = page * perPage;
    const end = start + perPage;
    // here you slice your json based on page perpage
    const result = jsonData.items.slice(start, end);

    res.status(200).json({
      items: result,
      total: jsonData.items.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.items.length / perPage),
    });
  });
});

// POST route - Allows to add a new item
// example: localhost:3000/clothes
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.post("/clothes", (req, res) => {
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );

    const newItem = {
      id: maxId + 1,
      image,
      name,
      price,
      rating,
    };

    jsonData.items.push(newItem);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

// PUT route - Allows to update an item
// example: localhost:3000/clothes/1
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.put("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items[index] = {
      id,
      image,
      name,
      price,
      rating,
    };

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json(jsonData.items[index]);
    });
  });
});

// DELETE route - Allows to delete an item
// example: localhost:3000/clothes/1
app.delete("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items.splice(index, 1);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(204).send();
    });
  });
});

app.post("/user-register", (req, res) => {
  console.log("Add user");
  const { name, email, password } = req.body;

  fs.readFile("user.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.users.reduce(
      (max, user) => Math.max(max, user.user_id),
      0
    );

    const newItem = {
      user_id: maxId + 1,
      name,
      email,
      password,
    };

    jsonData.users.push(newItem);

    fs.writeFile("user.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  //console.log(req.body)

  // Read users.json file
  fs.readFile("user.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const userData = JSON.parse(data);
    const users = userData.users;

    const user = users.find((user) => user.email === email);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== password) {
      console.log("Incorrect password");
      return res.status(401).json({ error: "Incorrect password" });
    }
    // Generate a JWT token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  });
});

const authenticateToken = (req, res, next) => {
  // next the callback function
  //const token = req.body.token || req.headers['authorization']
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.user = decoded; // Attach decoded data (e.g., email) to req for further use
    next(); // Proceed to the next middleware/route
  });
};

app.get("/getCart", authenticateToken, (req, res) => {
  const email = req.user.email;
  //console.log(email)
  fs.readFile("user.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Problem at accessing user.json at /getCart ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const usersData = JSON.parse(data);
    // usersData is an array so
    const users = usersData.users;

    const currUser = users.find((user) => user.email === email);

    if (!currUser) {
      return res
        .status(500)
        .json({ error: "Internal server error at /getCart" });
    }
    const userCart = currUser.cart;
    fs.readFile("db.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      try {
        const productData = JSON.parse(data);
        const products = productData.items;
        const cartProducts = products.filter((product) =>
          userCart.includes(product.id)
        );
        res.status(200).json({ cart: cartProducts });
      } catch (parseError) {
        res.status(500).json({ error: "Error parsing database file" });
      }
    });
    // TO DO maybe return the product object in place of array of id
    //res.status(200).json({ userCart });
  });
});

app.post("/addToCart", authenticateToken, (req, res) => {
  // Receiving: product name and user objecy
  const { productName, user } = req.body;

  fs.readFile("db.json", "utf-8", (err, data) => {
    // find product Id based on name
    if (err) return res.status(500).json({ err: "Internal Server Error" });

    const productData = JSON.parse(data);
    const products = productData.items;

    const productAdded = products.find(
      (productAdded) => productAdded.name === productName
    );

    // Find user
    fs.readFile("user.json", "utf-8", (err, data) => {
      if (err) return res.status(500).json({ err: "Internal Server Error" });

      const userData = JSON.parse(data);
      const users = userData.users;
      // finding current user
      const currUser = users.find((currUser) => currUser.email === user.email);

      if (!currUser) return res.status(404).json({ error: "User not found" });
      // for pushing product to cart[]
      currUser.cart.push(productAdded.id);
      // writing the changes in the file
      fs.writeFile(
        "user.json",
        JSON.stringify(userData, null, 2),
        (err, data) => {
          if (err)
            return res.status(500).json({ err: "Internal Server Error" });

          res
            .status(200)
            .json({ message: "Product added", cart: currUser.cart });
        }
      );
    });
  });
  // This will get a product to add to user cart
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
