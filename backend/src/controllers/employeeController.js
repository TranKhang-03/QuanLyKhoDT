const Employee = require('../models/EmployeeModel'); // MySQL model

// Fetch all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải danh sách', error: error.message });
  }
};

// Get employee by ma_nv
const getEmployeeByMaNV = async (req, res) => {
  const { ma_nv } = req.params;
  try {
    const employee = await Employee.findByPk(ma_nv);
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin nhân viên', error: error.message });
  }
};

// Add a new employee
// Add a new employee
const addEmployee = async (req, res) => {
  const { ma_nv, ten_nv, gioi_tinh, sdt, email, mat_khau, ma_quyen, trang_thai } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!ten_nv || !gioi_tinh || !sdt || !email || !mat_khau || !ma_quyen || !trang_thai) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  try {
    // Thêm nhân viên mới
    const newEmployee = await Employee.create({
      ma_nv,
      ten_nv,
      gioi_tinh,
      sdt,
      email,
      mat_khau,
      ma_quyen,
      trang_thai
    });

    // Trả về nhân viên mới thêm
    res.status(201).json(newEmployee);
  } catch (error) {
    // Log lỗi và trả về lỗi chi tiết
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Lỗi khi thêm nhân viên', details: error.message });
  }
};




// Update an employee by ma_nv
const updateEmployee = async (req, res) => {
  const { ma_nv } = req.params;
  const { ten_nv, gioi_tinh, sdt, email, mat_khau } = req.body; // Các thuộc tính cần cập nhật
  try {
    const employee = await Employee.findByPk(ma_nv);
    if (!employee) return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    
    employee.ten_nv = ten_nv;
    employee.gioi_tinh = gioi_tinh;
    employee.sdt = sdt;
    employee.email = email;
    employee.mat_khau = mat_khau;
    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật nhân viên', details: error.message });
  }
};


// Delete an employee by ma_nv
const deleteEmployee = async (req, res) => {
  const { ma_nv } = req.params;
  try {
    const employee = await Employee.findByPk(ma_nv);
    if (!employee) return res.status(404).json({ error: 'Không tìm thấy nhân viên' });

    if(employee.trang_thai==1)
      employee.trang_thai=0;
    else
      employee.trang_thai=1;
    await employee.save();

    res.json({ message: 'Trạng thái nhân viên đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái nhân viên', details: error.message });
  }
};

const countEmployee = async (req, res) => {
    try {
      const employeeCount = await Employee.count();
      res.status(200).json({ count: employeeCount })
    } catch (error) {
      console.error('Error counting employees:', error);
      throw error;
    }
 };
module.exports = {
  getEmployees,
  getEmployeeByMaNV,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  countEmployee
};
