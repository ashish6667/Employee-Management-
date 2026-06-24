import Employee from "../models/Employee.js";

// GET all employees + search by name
export const getEmployees = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          name: {
            $regex: search,
            $options: "i",
          },
        }
      : {};

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// GET one employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// CREATE employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, salary } = req.body;

    if (!name || !email || !phone || !department || !position || salary === "") {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee with this email already exists",
      });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      phone,
      department,
      position,
      salary: Number(salary),
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add employee",
      error: error.message,
    });
  }
};

// UPDATE employee
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, salary } = req.body;

    if (!name || !email || !phone || !department || !position || salary === "") {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.params.id },
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Another employee already uses this email",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email: email.toLowerCase(),
        phone,
        department,
        position,
        salary: Number(salary),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// DELETE employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};