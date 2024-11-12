const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");

router.get("/", (req, res) => {
  res.render("employee/addOrEdit", {
    viewTitle: "Insert Employee",
  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

async function insertRecord(req, res) {
  var employee = new Employee();
  employee.yullName = req.body.fullName;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;

  try {
    await employee.save(); // Using async/await instead of a callback
    res.redirect("employee/list");
  } catch (err) {
    if (err.name === "ValidationError") {
      handleValidationError(err, req.body);
      res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee",
        employee: req.body,
      });
    } else {
      console.log("Error during record insertion: " + err);
    }
  }
}

async function updateRecord(req, res) {
  try {
    const doc = await Employee.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    console.log("============== doc =========> ", doc);
    res.redirect("employee/list");
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, req.body);
      res.render("employee/addOrEdit", {
        viewTitle: "Update Employee",
        employee: req.body,
      });
    } else {
      console.log("Error during record update: " + err);
    }
  }
}

router.get("/list", async (req, res) => {
  try {
    const docs = await Employee.find();
    res.render("employee/list", {
      list: docs,
    });
  } catch (err) {
    console.log("Error in retrieving employee list: " + err);
  }
});

function handleValidationError(err, body) {
  for (let field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", async (req, res) => {
  try {
    const doc = await Employee.findById(req.params.id);
    res.render("employee/addOrEdit", {
      viewTitle: "Update Employee",
      employee: doc,
    });
  } catch (err) {
    console.log("Error in retrieving employee: " + err);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id); // Replaced `findByIdAndRemove` with `findByIdAndDelete`
    res.redirect("/employee/list");
  } catch (err) {
    console.log("Error in employee delete: " + err);
  }
});

module.exports = router;
