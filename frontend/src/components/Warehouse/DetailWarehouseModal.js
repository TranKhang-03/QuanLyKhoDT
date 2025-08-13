import React, { useState } from 'react';
import { FaExchangeAlt } from "react-icons/fa";
import productService from '../../services/productService';
const DetailWarehouseModal = ({filterDataDetailWarehouse,setShowDetailWarehouse,warehouses,fetchProducts}) => {
    const [showChangeWarehouseForm, setShowChangeWarehouseForm]=useState(false);
    const [currentProduct, setCurrentProduct]= useState({idProduct:'',nameWarehouse:''})
    const [selectedWarehouse, setSelectedWarehouse]= useState('')
    const [updatedProductList, setUpdatedProductList] = useState(filterDataDetailWarehouse);
    const showChangeWarehouse = (product) => {
        console.log("danh sach kho",warehouses)
        setShowChangeWarehouseForm(true);        
        setCurrentProduct({idProduct: product.ma_sp,nameWarehouse:product.storageArea.ten_kho})
    }

    const handleChangeSelectWarehouse = (e) =>{
        setSelectedWarehouse(parseInt(e.target.value))
    } 
    const handleChangeWarehouse = async () => {
        if(selectedWarehouse!= null){
            try {
                await productService.updateWarehouse(currentProduct.idProduct,selectedWarehouse)
                alert('cập nhật kho thành công')
                setShowChangeWarehouseForm(false)
                // fetchProducts()
                // Update the product list to remove the product from the current warehouse
                const updatedProducts = updatedProductList.filter(product => product.ma_sp !== currentProduct.idProduct);
                setUpdatedProductList(updatedProducts);

                // Optionally, call fetchProducts to refresh the entire product list from the server
                fetchProducts();

            } catch (error) {
                alert('sửa kho thất bại')
                console.log('lỗi sửa kho:',error)
            }
        }
    }
    return (
        <div className='overlay'>
            <div className='warehouse-area__detail'>
                <div className='warehouse-area__detail-content'>
                <table className='warehouse-area__container__table'>
                    <thead>
                        <tr>
                            <th className='warehouse-area__header-cell'>Tên sản phẩm</th>
                            <th className='warehouse-area__header-cell'>Số lượng tồn</th>
                            <th className='warehouse-area__header-cell'>Chuyển kho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedProductList.map(product=>(
                            <tr key={product.ma_sp}>
                                <td className='warehouse-area__data-cell'>{product.ten_sp}</td>
                                <td className='warehouse-area__data-cell'>{product.so_luong_ton}</td>
                                <td className='warehouse-area__data-cell' onClick={()=>{showChangeWarehouse(product)}}><FaExchangeAlt /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div className='warehouse-area__form-buttons'>
                <button className='warehouse-button exit' onClick={()=>{setShowDetailWarehouse(false)}}>Thoát</button>
                </div>
            </div>
            {showChangeWarehouseForm && (
                <div className='overlay'>
                    <div className='warehouse-area__change-warehouse--form'>
                        <p className='warehouse-area__current'>Kho hiện tại: {currentProduct.nameWarehouse}</p>
                            <select className='warehouse-area__select' value={selectedWarehouse} onChange={handleChangeSelectWarehouse}>
                                <option value="">Chọn kho mới</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse.ma_kho} value={warehouse.ma_kho}>
                                        {warehouse.ten_kho}
                                    </option>
                                ))}
                            </select>
                        <div className='warehouse-area__form-buttons'>
                            <button className='warehouse-button confirm' onClick={handleChangeWarehouse}>Lưu</button>
                            <button className='warehouse-button exit' onClick={() => {setShowDetailWarehouse(true); setShowChangeWarehouseForm(false)}}>Thoát</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailWarehouseModal;