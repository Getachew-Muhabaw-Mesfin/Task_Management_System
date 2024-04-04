const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// const generateTaskCompletionReport = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const pendingTasks = await Task.countDocuments({
//       createdBy: userId,
//       status: "pending",
//     });
//     const assignedTasks = await Task.countDocuments({
//       createdBy: userId,
//       status: "assigned",
//     });
//     const reviewTasks = await Task.countDocuments({
//       createdBy: userId,
//       status: "review",
//     });
//     const completedTasks = await Task.countDocuments({
//       createdBy: userId,
//       status: "completed",
//     });
//     const overdueTasks = await Task.countDocuments({
//       createdBy: userId,
//       status: "overdue",
//     });

//     // Calculate completion rates for each status
//     const totalTasks =
//       pendingTasks +
//       assignedTasks +
//       reviewTasks +
//       completedTasks +
//       overdueTasks;
//     const completionRates = {
//       pending: (pendingTasks / totalTasks) * 100,
//       assigned: (assignedTasks / totalTasks) * 100,
//       review: (reviewTasks / totalTasks) * 100,
//       completed: (completedTasks / totalTasks) * 100,
//       overdue: (overdueTasks / totalTasks) * 100,
//     };

//     // Prepare report data
//     const reportData = {
//       totalTasks,
//       completionRates,
//     };

//     res.status(StatusCodes.OK).json({
//       status: "success",
//       msg: "Task completion report generated successfully",
//       reportData,
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       status: "fail",
//       msg: "Failed to generate task completion report",
//       error: error.message,
//     });
//   }
// };

const generateTaskCompletionReport = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const pendingTasks = await Task.countDocuments({
    createdBy: userId,
    status: "pending",
  });
  const assignedTasks = await Task.countDocuments({
    createdBy: userId,
    status: "assigned",
  });
  const reviewTasks = await Task.countDocuments({
    createdBy: userId,
    status: "review",
  });
  const completedTasks = await Task.countDocuments({
    createdBy: userId,
    status: "completed",
  });
  const overdueTasks = await Task.countDocuments({
    createdBy: userId,
    status: "overdue",
  });

  //Calculate completion rates for each status
  const totalTasks =
    pendingTasks + assignedTasks + reviewTasks + completedTasks + overdueTasks;
  const completionRates = {
    pending: (pendingTasks / totalTasks) * 100,
    assigned: (assignedTasks / totalTasks) * 100,
    review: (reviewTasks / totalTasks) * 100,
    completed: (completedTasks / totalTasks) * 100,
    overdue: (overdueTasks / totalTasks) * 100,
  };

  // Prepare report data
  const reportData = {
    totalTasks,
    completionRates,
  };
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task completion report generated successfully",
    reportData,
  });
});

// const getUserTasks = async (req, res) => {
//   try {
//     // Get user's tasks
//     const tasks = await Task.find({ createdBy: req.user._id }).populate(
//       "category"
//     );

//     // Filter tasks with upcoming deadlines
//     const today = new Date();
//     const upcomingTasks = tasks.filter((task) => task.dueDate > today);

//     res.status(StatusCodes.OK).json({
//       status: "success",
//       msg: "User dashboard data retrieved successfully",
//       tasks: upcomingTasks,
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       status: "fail",
//       msg: "Failed to retrieve user dashboard data",
//       error: error.message,
//     });
//   }
// };

const getUserTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user._id }).populate(
    "category"
  );
  const today = new Date();
  const upcomingTasks = tasks.filter((task) => task.dueDate > today);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User dashboard data retrieved successfully",
    tasks: upcomingTasks,
  });
});

const sendReportByEmail = async (req, res) => {
  try {
    // Get user email from request
    const userEmail = req.user.email;

    // Generate the task completion report
    const report = await generateTaskCompletionReport();

    // Prepare the report data in JSON format
    const reportData = {
      totalTasks: report.reportData.totalTasks,
      completionRates: {
        pending: report.reportData.completionRates.pending,
        assigned: report.reportData.completionRates.assigned,
        review: report.reportData.completionRates.review,
        completed: report.reportData.completionRates.completed,
        overdue: report.reportData.completionRates.overdue,
      },
      tasks: report.tasks, // Include list of tasks
    };

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your.email@gmail.com", // Your email address
        pass: "yourpassword", // Your email password or app password
      },
    });

    // Define email options
    const mailOptions = {
      from: "your.email@gmail.com", // Sender email address
      to: userEmail, // Recipient email address
      subject: "Task Completion Report", // Email subject
      text: JSON.stringify(reportData, null, 2), // JSON representation of report data
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Report sent via email successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Failed to send report via email",
      error: error.message,
    });
  }
};
module.exports = {
  generateTaskCompletionReport,
  getUserTasks,
  sendReportByEmail,
};
