const { Sequelize } = require("sequelize");

// Kết nối MySQL với Sequelize
const sequelize = new Sequelize('quanlikhohang', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Kết nối đến cơ sở dữ liệu thành công");
  } catch (error) {
    console.error("Kết nối đến cơ sở dữ liệu thất bại:", error);
  }
}
// Gọi hàm testConnection và syncModels
testConnection();


// Xuất đối tượng `sequelize` để sử dụng trong các model
module.exports = sequelize;
