import React,{useEffect, useState} from "react";
import '../statisticsChild/statisticChild.css';
import thongkeService from "../../services/thongkeService";
import * as XLSX from 'xlsx'
const NhapXuat = ()=> {
    const [text, setText] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);

    const fetchTonKho = async (params={}) =>{
        const data = await thongkeService.getThongKeTonKho(params);
        setData(data);
        
    }
   // Gộp dữ liệu theo `ma_sp`
   const groupByMaSp = (data) => {
    const grouped = data.reduce((acc, item) => {
        const { ma_sp, ten_sp, so_luong_dau_ky, so_luong_nhap, so_luong_xuat, so_luong_cuoi_ky } = item;

        if (!acc[ma_sp]) {
            acc[ma_sp] = {
                ma_sp,
                ten_sp,
                so_luong_dau_ky: 0,
                so_luong_nhap: 0,
                so_luong_xuat: 0,
                so_luong_cuoi_ky: 0
            };
        }

        acc[ma_sp].so_luong_dau_ky += parseInt(so_luong_dau_ky, 10);
        acc[ma_sp].so_luong_nhap += parseInt(so_luong_nhap, 10);
        acc[ma_sp].so_luong_xuat += parseInt(so_luong_xuat, 10);
        acc[ma_sp].so_luong_cuoi_ky += parseInt(so_luong_cuoi_ky, 10);

        return acc;
    }, {});

    return Object.values(grouped);
    };
    useEffect(()=>{
        fetchTonKho();
    },[]);
    useEffect(() => {
        if (data.length > 0) {
            const grouped = groupByMaSp(data);
            setGroupedData(grouped);
        }
    }, [data]);
    const toggleRow = (ma_sp) => {
        setExpandedRows((prev) =>
            prev.includes(ma_sp) ? prev.filter((id) => id !== ma_sp) : [...prev, ma_sp]
        );
    };
    
    const handleExportExcel = () =>{
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeTonKho");
        // 3. Xuất tệp Excel
        XLSX.writeFile(workbook, "ThongKeTonKho.xlsx");
    }
    const handleReset = () =>{
        setText('');
        setTimeStart('');
        setTimeEnd('');
        setData([]);
        fetchTonKho();
    }
     const handleSearch = () =>{
        const formattedTimeStart = timeStart ? new Date(timeStart).toISOString().split('T')[0] : '';
        const formattedTimeEnd = timeEnd ? new Date(timeEnd).toISOString().split('T')[0] : '';
        fetchTonKho({text, timeStart:formattedTimeStart , timeEnd : formattedTimeEnd});

    };
    
    return (
        <div className="statistics-page">
            <div className="filters-container">
                <label>Tìm kiếm sản phẩm</label>
                <input type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                />
                <label >Từ Ngày</label>
                <input type="date" 
                        value={timeStart}
                        onChange={(e)=> setTimeStart(e.target.value)}
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
                            <th>Mã SP</th>
                            <th>Tên sản phẩm</th>
                            <th>Tồn đầu kỳ</th>
                            <th>Nhập trong kỳ</th>
                            <th>Xuất trong kỳ</th>
                            <th>Tồn cuối kỳ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            groupedData.length > 0 ? (
                                groupedData.map((item,index)=>(
                                    <React.Fragment key={item.ma_sp}>
                                        <tr onClick={()=> toggleRow(item.ma_sp)}>
                                        <td>{index+1}</td>
                                        <td>{item.ma_sp}</td>
                                        <td>{item.ten_sp}</td>
                                        <td>{item.so_luong_dau_ky}</td>
                                        <td>{item.so_luong_nhap}</td>
                                        <td>{item.so_luong_xuat}</td>
                                        <td>{item.so_luong_cuoi_ky}</td>
                                    </tr>
                                   
                                   {expandedRows.includes(item.ma_sp) && 
                                        data.filter((detail) => detail.ma_sp === item.ma_sp).map((detail,subIndex)=>(
                                            <tr key={`${item.ma_sp}-${subIndex}`} className="detail-row">
                                                <td></td>
                                                <td>{detail.ma_phien_ban_sp}</td>
                                                <td>{detail.ten_sp} ({detail.mauSac.ten_mau}, {detail.ram.kich_thuoc_ram}GB RAM, {detail.rom.kich_thuoc_rom}GB ROM)</td>
                                                <td>{detail.so_luong_dau_ky}</td>
                                                <td>{detail.so_luong_nhap}</td>
                                                <td>{detail.so_luong_xuat}</td>
                                                <td>{detail.so_luong_cuoi_ky}</td>
                                        </tr>
                                        ))}
                                    </React.Fragment>  
                                ))
                            ):(
                                <tr>
                                    <td colSpan={7}>Không có dữ liệu</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default NhapXuat;