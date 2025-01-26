import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";

import courseRoutes from "./routes/courseRoutes"
import userClerkRoutes from "./routes/userClerkRoutes"
import { createClerkClient } from "@clerk/express";
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

export const clerkClient = createClerkClient({
  secretKey:process.env.CLERK_SECRET_KEY,
})

if(!isProduction){
    dynamoose.aws.ddb.local();
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors());


/* ROUTES */
app.get("/", (req, res) => {
    res.send("Hello World");
  });
app.use("/courses",courseRoutes);
app.use("/users/clerk",userClerkRoutes);
const port = process.env.PORT || 3000;
  if (!isProduction) {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
}