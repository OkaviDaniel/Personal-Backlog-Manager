import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import {router as productRoutes} from "./routes/products-routes.js";

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
// app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static("uploads"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // this will control which HTTP methods may be used in the frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});


app.use('/api/products', productRoutes);

app.get("/", (req, res, next) => {
  res.send("<h1>Hello world</h1>"); // keep it for fun
});


app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});


app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if(res.headerSent){
    return next(error);
  }

  res.status(error.code || 500).json({message: error.message || "An unknown error!"});
});

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
