import React,{useEffect, useState} from "react";
import '../statisticsChild/statisticChild.css';
import thongkeService from "../../services/thongkeService";
import * as XLSX from 'xlsx'
const KhachHang = ()=> {
    const [text, setText] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [data, setData] = useState([]);
     // Hàm format giá tiền
     const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    // fetch data khách hàng
    const fetchKhachHang = async (params={}) =>{
        const data = await thongkeService.getThongKeKhachHang(params);
        setData(data);
    };
    useEffect(() =>{
        fetchKhachHang();
    },[])
    const handleExportExcel = () =>{
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeKhachHang");
        // 3. Xuất tệp Excel
        XLSX.writeFile(workbook, "ThongKeKhachHang.xlsx");
    }
    const handleSearch = () =>{
        const formattedTimeStart = timeStart ? new Date(timeStart).toISOString().split('T')[0] : '';
        const formattedTimeEnd = timeEnd ? new Date(timeEnd).toISOString().split('T')[0] : '';
        fetchKhachHang({text, timeStart: formattedTimeStart , timeEnd: formattedTimeEnd})
    }
    const handleReset = () => {
        setText('');
        setTimeStart('');
        setTimeEnd('');
        setData([]);
        fetchKhachHang();
      };
    return (
        <div className="statistics-page">
            <div className="filters-container">
                <label>Tìm kiếm khách hàng</label>
                <input type="text" 
                    values={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <label >Từ Ngày</label>
                <input type="date"  value={timeStart} onChange={(e) => setTimeStart(e.target.value)}/>
                <label >Đến Ngày</label>
                <input type="date" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)}/>
                <div className="buttons-container">
                    <button onClick={handleSearch}>Tìm kiếm</button>
                    <button onClick={handleReset}>Làm mới</button>
                    <button onClick={handleExportExcel}>Xuất Excel</button>
                </div>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã khách hàng</th>
                            <th>Tên khách hàng</th>
                            <th>Số lượng phiếu</th>
                            <th>Tổng số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length >0 ? (
                                data.map((item,index)=>(
                                    <tr key={item.ma_kh}>
                                        <td>{index+1}</td>
                                        <td>{item.ma_kh}</td>
                                        <td>{item.ten_kh}</td>
                                        <td>{item.SoLuong}</td>
                                        <td>{formatCurrency(item.total)}</td>
                                        
                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td colSpan={5}>Không có dữ liệu</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default KhachHang;