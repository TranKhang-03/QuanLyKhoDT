const {Provider,sequelize} = require('../models/Relationship'); // MySQL model

const getProvider = async (req, res) => {
  try { 
    const provider = await Provider.findAll();
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải danh sách', error: error.message });
  }
};


const getProviderByMaNCC = async (req, res) => {
  const { ma_ncc } = req.params;
  try {
    const provider = await Provider.findByPk(ma_ncc);
    if (!provider) {
      return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin nhà cung cấp', error: error.message });
  }
};


const addProvider = async (req, res) => {
  const { ma_ncc,ten_ncc,dia_chi,email_ncc,sdt_ncc } = req.body;
    try {
        const newProvider = await Provider.create({
            ma_ncc,
            ten_ncc,
            dia_chi,
            email_ncc,
            sdt_ncc
        });
        return res.status(201).json({message: 'Nhà cung cấp đã được thêm',newProvider});
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi khi thêm Nhà cung cấp' });
    }
};


const updateProvider = async (req, res) => {
  const { ma_ncc } = req.params;
  const { ten_ncc,dia_chi,email_ncc,sdt_ncc } = req.body;
  try {
    const updatedProvider = await Provider.findByPk(ma_ncc);
    if (!updatedProvider) return res.status(404).json({ error: 'Không tìm thấy Nhà cung cấp' });
        
    updatedProvider.ten_ncc = ten_ncc;
    updatedProvider.dia_chi = dia_chi;
    updatedProvider.email_ncc = email_ncc;
    updatedProvider.sdt_ncc = sdt_ncc;
        await updatedProvider.save();

        return res.status(201).json({message: 'Nhà cung cấp đã được câp nhật',updatedProvider});
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi khi cập nhật Nhà cung cấp' });
    }
};


const deleteProvider = async (req, res) => {
  const { ma_ncc } = req.params;
  try {
    const deleteProvider = await Provider.findByPk(ma_ncc);
    // if (!deleteProvider) return res.status(404).json({ error: 'Không tìm thấy Nhà cung cấp' });
        
    //     await deleteProvider.destroy();
    if(deleteProvider.trang_thai==1)
      deleteProvider.trang_thai=0;
    else
      deleteProvider.trang_thai=1;
    await deleteProvider.save();
    return res.json({ message: 'Nhà cung cấp đã được xóa' });
  } catch (error) {
      console.error('Lỗi khi xóa Nhà cung cấp:', error);  // In chi tiết lỗi ra console
      return res.status(500).json({ error: `Lỗi không xóa được Nhà cung cấp: ${error.message}` });
    }
};

module.exports = {
  getProvider,
  getProviderByMaNCC,
  addProvider,
  updateProvider,
  deleteProvider,
};