require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/mongoDb");
const userRout = require("./routes/userManagement/userRoutes");
const taskRoute = require("./routes/taskManagement/taskRoutes");
const taskCategory = require("./routes/taskOrganazation/taskCategoriesRoute");
const taskColabAndCommRoute = require("./routes/taskColabAndComm/taskColabAndCommRoute");
const reportRoute = require("./routes/DashboardReport/reportRoute");
const publicAPIsRoute = require("./routes/publicAPIs/publicAPIsRoute");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

//Connect to MongoDB
connectDB();
//Middlewares
const app = express();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
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
