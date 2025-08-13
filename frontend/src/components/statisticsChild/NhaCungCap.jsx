import React,{useEffect, useState} from "react";
import '../statisticsChild/statisticChild.css';
import thongkeService from "../../services/thongkeService";
import * as XLSX from 'xlsx'
const NhaCungCap = ()=> {
    const [text, setText] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [data, setData] = useState([]);
     // Hàm format giá tiền
     const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const fetchProvider = async (params={}) =>{
        const data = await thongkeService.getThongKeProvider(params);
        setData(data);
    };
    useEffect(()=>{
        fetchProvider();
    },[]);
    const handleExportExcel = () =>{
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeNhaCungCap");
        // 3. Xuất tệp Excel
        XLSX.writeFile(workbook, "ThongKeNhaCungCap.xlsx");
    }
    const handleReset = () =>{
        setText('');
        setTimeStart('');
        setTimeEnd('');
        setData([]);
  
        fetchProvider();
    }
    const handleSearch = () =>{
        const formattedTimeStart = timeStart ? new Date(timeStart).toISOString().split('T')[0] : '';
        const formattedTimeEnd = timeEnd ? new Date(timeEnd).toISOString().split('T')[0] : '';
        fetchProvider({text, timeStart:formattedTimeStart , timeEnd : formattedTimeEnd});
        console.log(text)
    };
    return (
        <div className="statistics-page">
            <div className="filters-container">
                <label>Tìm kiếm nhà cung cấp</label>
                <input type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <label >Từ Ngày</label>
                <input type="date" 
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                />
                <label >Đến Ngày</label>
                <input type="date" 
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                />
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
                            <th>Mã nhà cung cấp</th>
                            <th>Tên nhà cung cấp</th>
                            <th>Số lượng Phiếu nhập</th>
                            <th>Tổng số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.length > 0 ? (
                            data.map((item,index)=>(
                                <tr key={item.ma_ncc}>
                                    <td>{index+1}</td>
                                    <td>{item.ma_ncc}</td>
                                    <td>{item.ten_ncc}</td>
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
export default NhaCungCap;