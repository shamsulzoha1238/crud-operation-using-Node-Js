const mongoose = require("mongoose");
require("./employee.model");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/EmployeeDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connection Succeeded.");
  } catch (err) {
    console.error("Error in DB connection: " + err);
  }
}

connectDB();
