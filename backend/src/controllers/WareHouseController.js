const Warehouse = require('../models/WareHouseModel')

const getAllWarehouse = async (req ,res) => {
    try {
        const warehouse =await Warehouse.findAll();
        res.json(warehouse);
    }
    catch (error) {
        res.status(500).json({ error: ' Lỗi khi lấy kho'})
    }
};


const getWarehouseByID = async (req,res) => {
    const {ma_kho} = req.params;
    try {
        const warehouse = await Warehouse.findByPk(ma_kho)
        if(!warehouse) return res.status(404).json({error: 'không tìm thấy kho'});
        res.json(warehouse)
    } catch (error) {
        res.status(500).json({error: 'Lỗi khi lấy kho'})
    }
};

const createWarehouse = async (req,res) => {
    const {ma_kho,ten_kho,chu_thich,trang_thai} = req.body;
    try {
        const newWarehouse = await Warehouse.create({
            ma_kho,
            ten_kho,
            chu_thich,
            trang_thai
        })
        res.status(201).json(newWarehouse);
    } catch (error) {
        res.status(500).json({error: 'Lỗi khi thêm sản phẩm'})
    }
}

const updateWarehouse = async (req,res) => {
    const {ten_kho,chu_thich,trang_thai} = req.body;
    const {ma_kho} = req.params;
    try {
        const warehouse = await Warehouse.findByPk(ma_kho);
        if(!warehouse) return res.status(404).json({error: 'Không tìm thấy kho'})
        
        warehouse.ten_kho=ten_kho;
        warehouse.chu_thich=chu_thich;
        warehouse.trang_thai=trang_thai;
        await warehouse.save();

        res.json(warehouse)
    } catch (error) {
        res.status(500).json({error: 'Lỗi khi sửa thông tin kho'})
    }
};

const deleteWarehouse = async(req,res) => {
    const {ma_kho} = req.params;
    try {
        console.log('ma kho can xoa trong control:'+ma_kho)
        const warehouse= await Warehouse.findByPk(ma_kho);
        console.log('tim kho can xoa trong control:'+warehouse)
        if(!warehouse) return res.status(404).json({error: 'Không tìm thấy kho'});

        warehouse.trang_thai = 0
        await warehouse.save();
        res.json({ message: 'Kho đã được xóa thành công'})
    } catch (error) {
        console.log("loi khi xoa kho:,",error)
        res.status(500).json({ error: 'Lỗi khi xóa kho', details: error.message });
    }
}

const restoreWarehouse = async (req, res) => {
    const { ma_kho } = req.params;
    try {
        const warehouse = await Warehouse.findByPk(ma_kho);
        if (!warehouse) return res.status(404).json({ error: 'Không tìm thấy kho' });

        if (warehouse.trang_thai === 0) {
            warehouse.trang_thai = 1;
            await warehouse.save();
            return res.json({ message: 'Kho đã được khôi phục thành công' });
        } else {
            return res.status(400).json({ error: 'Kho không cần khôi phục' });
        }
    } catch (error) {
        console.error('Lỗi khi khôi phục kho:', error);
        return res.status(500).json({ error: 'Lỗi khi khôi phục kho', details: error.message });
    }
};

module.exports = {
    getAllWarehouse,
    getWarehouseByID,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    restoreWarehouse
}