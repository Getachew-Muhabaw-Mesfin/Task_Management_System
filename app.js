require("dotenv").config();
//Packages Imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

//File Imports
const connectDB = require("./config/mongoDb");
const userRout = require("./routes/userManagement/userRoutes");
const taskRoute = require("./routes/taskManagement/taskRoutes");
const taskCategory = require("./routes/taskOrganazation/taskCategoriesRoute");
const taskColabAndCommRoute = require("./routes/taskColabAndComm/taskColabAndCommRoute");
const reportRoute = require("./routes/DashboardReport/reportRoute");
const publicAPIsRoute = require("./routes/publicAPIs/publicAPIsRoute");

// Global Error Handler
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

//Connect to MongoDB
connectDB();
//Middlewares
const app = express();
// Global Middlewares
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//To Prevent Denial of Service (DOS) attack
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
});
app.use("/api", limiter); // For all routes that start with /api

// Enable CORS
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
//Data sanitization against NoSQL query injection e.g { $gt: ""}
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["priority", "status", "category", "dueDate"],
  })
);

app.use(express.urlencoded({ extended: false }));

//API Routes
app.use("/api/v1/users", userRout);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/categories", taskCategory);
app.use("/api/v1/collaboration", taskColabAndCommRoute);
app.use("/api/v1/overview", reportRoute);
app.use("/api/v1/public", publicAPIsRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
//Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
