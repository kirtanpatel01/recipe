import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import recipeRoutes from "./routes/recipe.route.js";
import userRoutes from './routes/user.route.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from "./utils/ApiError.js";

config();

const app = express();
const PORT = process.env.PORT || "8000";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());
app.use(cookieParser());

connectDB(MONGODB_URL);

app.use("/api/recipes", recipeRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
