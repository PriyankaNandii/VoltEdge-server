const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://assignment-12-newspaper.web.app",
    "https://assignment-12-newspaper.firebaseapp.com",
  ],
  credentials: true,
  optionSuccessStatus: 200,
}));

app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.yh51je0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const productsCollection = client.db("VoltEdge").collection("products");

    app.get("/products", async (req, res) => {
        try {

          const result = await productsCollection.find().toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Server error" });
        }
      });


//    pagination
          
app.get("/all-products", async (req, res) => {
    try {
      const size = parseInt(req.query.size) || 10; // Default to 10 if not provided
      const page = parseInt(req.query.page) - 1 || 0; // Default to 0 if not provided
      const filter = req.query.filter;
      const sort = req.query.sort;
      const search = req.query.search || "";
      const sortNew = req.query.sortNew;
      const brandFilter = req.query.brandFilter;
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  
      let query = {
        productName: { $regex: search, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice }
      };
  
      if (filter) {
        query.category = filter;
      }
      if (brandFilter) {
        query.brandName = brandFilter;
      }
  
      let sortOptions = {};
      if (sort) {
        sortOptions.price = sort === 'asc' ? 1 : -1;
      }
  
      if (sortNew) {
        sortOptions.productCreationDate = sortNew === 'dsc' ? -1 : 1;
      }
  
      const result = await productsCollection
        .find(query)
        .sort(sortOptions)
        .skip(page * size)
        .limit(size)
        .toArray();
  
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  });
  
  app.get("/products-count", async (req, res) => {
    try {
      const filter = req.query.filter;
      const brandFilter = req.query.brandFilter;
      const search = req.query.search || "";
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  
      let query = {
        productName: { $regex: search, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice }
      };
  
      if (filter) {
        query.category = filter;
      }
      if (brandFilter) {
        query.brandName = brandFilter;
      }
  
      const count = await productsCollection.countDocuments(query);
      res.send({ count });
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  });
  
  

  
  

    

   

  } finally {
    // Do not close the client connection in a long-running server
  }
}


// export const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);



run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


