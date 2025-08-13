import React,{useEffect, useRef, useState} from "react";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import thongkeService from "../../services/thongkeService";
const DateToDate = ()=>{
 const [data,setData]= useState([]);
 const [toDate,setToDate] = useState("");
 const [fromDate,setFromDate] = useState('');
 const fromDateRef = useRef(null);
 const toDateRef = useRef(null);
 const fetchData= async (params={}) =>{
    const data= await thongkeService.getThongKeNgayDenNgay(params);
    setData(data);
    // Gán ngày mặc định từ API
    if (data.length > 0) {
      const defaultDate = data[0].ngay; 
      const endDefaultDate = data[data.length -1].ngay;
      setFromDate(defaultDate);
      setToDate(endDefaultDate);
    }
 }
 useEffect(()=>{
    fetchData();
 },[]);
 // Hàm format giá tiền
 const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
const handleStatistic =()=>{
  const start = new Date(fromDate);
  const end = new Date(toDate);
  if(start > end){
    toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
    fromDateRef.current.focus();
      return;
  }
  else if(start > new Date()){
    toast.error("Ngày bắt đầu không được lớn hơn ngày hiện tại");
    fromDateRef.current.focus();
    return;
  }
  fetchData({start: start,end: end});
};
const handleExportExcel = () =>{
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeDoanhThu_TuNgayDenNgay");
    // 3. Xuất tệp Excel
    XLSX.writeFile(workbook, "ThongKeDoanhThu_TuNgayDenNgay.xlsx");
}
const handleReset = () =>{
  fetchData();
  toast.success("Dữ liệu đã được làm mới."); 
}
// Chuẩn bị dữ liệu cho biểu đồ
const labels = data.map((item) => item.ngay);
const chartData = {
    labels,
    datasets: [
        {
            label: 'Vốn',
            data: data.map((item) => item.chiphi),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
        },
        {
            label: 'Doanh thu',
            data: data.map((item) => item.doanhthu),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
        },
        {
            label: 'Lợi nhuận',
            data: data.map((item) => item.loi_nhuan),
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
            tension: 0.4,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Giá trị (VNĐ)',
            },
        },
        x: {
            title: {
                display: true,
                text: 'Ngày',
            },
        },
    },
    plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: `Thống kê doanh thu từ ${fromDate} đến ${toDate}`,
        }
      }
};
 return(
    <div className="Chart-page">
      <div className="Filter-container">
        <input
          type="date"
          placeholder="Từ ngày"
            value={fromDate}
            onChange={(e)=> setFromDate(e.target.value)}
            ref={fromDateRef}
        />
        <input
          type="date"
          placeholder="Đến ngày"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          ref={toDateRef}
        />
        <button onClick={handleStatistic}>Thống kê</button>
        <button onClick={handleReset}>Làm mới</button>
        <button onClick={handleExportExcel}>Xuất excel</button>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <div className="table-chart-container">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Vốn</th>
              <th>Doanh thu</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ngay}</td>
                <td>{formatCurrency(item.chiphi)}</td>
                <td>{formatCurrency(item.doanhthu)}</td>
                <td>{formatCurrency(item.loi_nhuan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000} // Tự động đóng sau 5 giây
        hideProgressBar={true} // Ẩn thanh tiến trình
        newestOnTop={true} // Hiển thị thông báo mới nhất trên cùng
        closeButton={false} // Tắt nút đóng
      />
    </div>
 );
}
export default DateToDate;