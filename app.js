import dotenv from "dotenv"
import express, {json, urlencoded} from "express"
import mongoose from "mongoose"
dotenv.config()
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(json());
app.use(urlencoded({extended: false}))

app.use("/api/v1", urlRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, async() => {   
    console.log(`Server is running on port ${PORT}`);
});

export default app;


