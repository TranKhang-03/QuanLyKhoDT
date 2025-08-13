const Customer = require('../models/CustomerModel'); // MySQL model

// Fetch all Customer
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findAll();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải danh sách', error: error.message });
  }
};

// Get Customer by ma_kh
const getCustomerByMaKH = async (req, res) => {
  const { ma_kh } = req.params;
  try {
    const customer = await Customer.findByPk(ma_kh);
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin nhân viên', error: error.message });
  }
};

// Add a new Customer
const addCustomer = async (req, res) => {
  const { ma_kh,ten_kh,dia_chi_kh,sdt_kh } = req.body;
    try {
        const newCustomer = await Customer.create({
            ma_kh,
            ten_kh,
            dia_chi_kh,
            sdt_kh
        });
        return res.status(201).json({ message: 'Khách hàng đã được thêm' ,newCustomer});
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi khi thêm khách hàng' });
    }
};

// Update an Customer by ma_kh
const updateCustomer = async (req, res) => {
  const { ma_kh } = req.params;
  const { ten_kh, dia_chi_kh, sdt_kh } = req.body;
  try {
    const updatedCustomer = await Customer.findByPk(ma_kh);
    if (!updatedCustomer) return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        
    updatedCustomer.ten_kh = ten_kh;
    updatedCustomer.dia_chi_kh = dia_chi_kh;
    updatedCustomer.sdt_kh = sdt_kh;
        await updatedCustomer.save();

        return res.status(201).json({ message: 'Khách hàng đã được cập nhật thành công' ,updatedCustomer});
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng' });
    }
};

// Delete an Customer by ma_kh
const deleteCustomer = async (req, res) => {
  const { ma_kh } = req.params;
  try {
    const deletedCustomer = await Customer.findByPk(ma_kh);
    // if (!deletedCustomer) return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        
    //     await deletedCustomer.destroy();
    if(deletedCustomer.trang_thai==1)
      deletedCustomer.trang_thai=0;
    else
      deletedCustomer.trang_thai=1;
    await deletedCustomer.save();
        res.json({ message: 'Khách hàng đã được xóa' });
    } catch (error) {
      console.error('Lỗi khi xóa khách hàng:', error);  // In chi tiết lỗi ra console
      res.status(500).json({ error: `Lỗi không xóa được khách hàng: ${error.message}` });
    }
};
const getCountCustomer = async (req, res) => {
    try {
        const customerCount = await Customer.count();
        res.json({ customerCount: customerCount});
    } catch (error) {
      console.error("lỗi khi đếm số lượng",error);
    }
}
module.exports = {
  getCustomer,
  getCustomerByMaKH,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCountCustomer
};