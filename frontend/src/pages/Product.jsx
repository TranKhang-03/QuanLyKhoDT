import React, { useEffect, useState } from "react";
import "../style/product.css";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import AddProductModal from "../components/Product/AddProductModal";
import DetailProductModal from "../components/Product/DetailProductModal";
import UpdateProduct from "../components/Product/UpdateProduct";
import AddConfig from "../components/Product/AddConfig";
import productService from "../services/productService";

const Product = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Dữ liệu sản phẩm đã lọc
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [searchBy, setSearchBy] = useState("name"); // Tiêu chí tìm kiếm (tên sản phẩm, thương hiệu, xuất xứ)
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddConfig, setShowAddConfig] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };
  ////
  const handleViewUpdate = (product) => {
    setSelectedProduct(product); // Sửa ở đây
    setShowUpdateModal(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateModal(false);
  };
  ////
  const handleViewAddConfig = (product) => {
    setSelectedProduct(product);
    setShowAddConfig(true);
  };
  const handleCloseAddConfig = () => {
    setShowAddConfig(false);
  };

  useEffect(() => {
    // Lấy dữ liệu từ backend
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.data);
        setFilteredProducts(data.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Lọc sản phẩm theo tiêu chí
    const filtered = products.filter((product) => {
      if (searchBy === "name") {
        return product.ten_sp?.toLowerCase().includes(query);
      } else if (searchBy === "brand") {
        return product.brand?.ten_thuong_hieu?.toLowerCase().includes(query);
      } else if (searchBy === "origin") {
        return product.origin?.ten_xuat_xu?.toLowerCase().includes(query);
      }
      return false;
    });

    setFilteredProducts(filtered);
  };

  // Hàm thay đổi tiêu chí tìm kiếm
  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleDeleteProduct = async (productId) => {
    // Hiển thị thông báo xác nhận trước khi xóa sản phẩm
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm này không?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await productService.deleteProduct(productId);
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.ma_sp === productId
              ? { ...product, trang_thai: 0 }
              : product
          )
        );

        setFilteredProducts((prevFiltered) =>
          prevFiltered.filter(
            (product) => product.ma_sp !== productId || product.trang_thai !== 0
          )
        );
      }

      alert("Xóa sản phẩm thành công");
    } catch (err) {
      console.error("Lỗi khi ẩn sản phẩm:", err);
      alert("Có lỗi xảy ra khi ẩn sản phẩm.");
    }
  };

  return (
    <div className="product-list">
      <h2>Danh Sách Sản Phẩm</h2>
      <div className="toolbar">
        <div className="product-actions">
          <button onClick={handleAddProduct} className="btn-add-product">
            <FaPlus /> Thêm
          </button>
        </div>
        <div className="search-filter">
          <select
            name="searchBy"
            value={searchBy}
            onChange={handleSearchByChange}
          >
            <option value="name">Tên sản phẩm</option>
            <option value="origin">Xuất xứ</option>
            <option value="brand">Thương hiệu</option>
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="table-products">
        <table>
          <thead className="rows">
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng tồn</th>
              <th>Thương hiệu</th>
              <th>Hệ điều hành</th>
              <th>Kích thước màn</th>
              <th>Chip xử lý</th>
              <th>Dung lượng pin</th>
              <th>Xuất xứ</th>
              <th>Khu vực kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts
              .filter((product) => product.trang_thai !== 0)
              .map((product) => (
                <tr key={product.ma_sp}>
                  <td>{product.ma_sp}</td>
                  <td>{product.ten_sp}</td>
                  <td>{product.so_luong_ton}</td>
                  <td>{product.brand?.ten_thuong_hieu}</td>
                  <td>{product.operatingSystem?.ten_hdh}</td>
                  <td>
                    {product.kich_thuoc_man
                      ? `${product.kich_thuoc_man} inch`
                      : "Không có thông tin"}
                  </td>
                  <td>{product.chip_xu_ly}</td>
                  <td>
                    {product.dung_luong_pin
                      ? `${product.dung_luong_pin} mAh`
                      : "Không có thông tin"}
                  </td>
                  <td>{product.origin?.ten_xuat_xu}</td>
                  <td>{product.storageArea?.ten_kho}</td>
                  <td>
                    <div className="action-button">
                      <button
                        className="btn-product-detail"
                        onClick={() => handleViewDetail(product)}
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        className="btn-btn-add"
                        onClick={() => handleViewAddConfig(product)}
                      >
                        <IoIosAddCircle />
                      </button>
                      <button
                        className="btn-product-edit"
                        onClick={() => handleViewUpdate(product)} // Thêm hành động sửa
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-product-delete"
                        onClick={() => handleDeleteProduct(product.ma_sp)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <AddProductModal show={showModal} onClose={handleCloseModal} />
      <DetailProductModal
        show={showDetailModal}
        onClose={handleCloseDetailModal}
        product={selectedProduct}
      />
      <UpdateProduct
        show={showUpdateModal}
        onClose={handleCloseUpdate}
        product={selectedProduct}
      />
      <AddConfig
        show={showAddConfig}
        onClose={handleCloseAddConfig}
        product={selectedProduct}
      />
    </div>
  );
};

export default Product;
