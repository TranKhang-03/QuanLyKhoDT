import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Chart/Chart.css';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import thongkeService from '../../services/thongkeService';

const Year = () => {
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [data, setData] = useState([]);
  // Tham chiếu đến các ô input
  const fromYearRef = useRef(null);
  const toYearRef = useRef(null);
    // Hàm format giá tiền
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const FetchStatisticYear = async (params={}) => {
    const data = await thongkeService.getThongKeTheoNam(params);
    setData(data);
  };
   useEffect(()=>{
    FetchStatisticYear();
   },[]);
  const handleReset = () => {
    setFromYear('');
    setToYear('');
    setData([]);
    FetchStatisticYear();
  };
  const handleStatistic = () =>{
    const yearStart = fromYear.trim();
    const yearEnd = toYear.trim();
    if(!yearStart&&!yearEnd){
      toast.error("Vui lòng chọn năm thống kê");
      fromYearRef.current.focus();
      return;
    } 
    if(yearEnd){
      if(yearStart > yearEnd){
        toast.error('ngày bắt đầu không được lớn hơn ngày kết thúc');
        fromYearRef.current.focus();
        return;
      }
      else{
        FetchStatisticYear({yearStart:yearStart,yearEnd:yearEnd});
        toast.success("thống kê thành công")
      }
    } 
  }
  const handleExportExcel = () =>{
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeDoanhThuTheoNam");
    // 3. Xuất tệp Excel
    XLSX.writeFile(workbook, "ThongKeDoanhThuTheoNam.xlsx");
}

  // Dữ liệu cho biểu đồ Bar Chart
  const chartData = {
    labels: data.map(item => item.nam),
    datasets: [
      {
        label: 'Vốn',
        data: data.map(item => item.chiphi),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Doanh thu',
        data: data.map(item => item.doanhthu),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Lợi nhuận',
        data: data.map(item => item.loi_nhuan),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}đ`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value.toLocaleString()}đ`;
          },
        },
      },
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        barThickness: 12,
      },
    },
  };

  return (
    <div className="Chart-page">
      <div className="Filter-container">
        <input
          type="text"
          placeholder="Từ năm"
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
          ref={fromYearRef}
        />
        <input
          type="text"
          placeholder="Đến năm"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          ref={toYearRef}
        />
        <button onClick={handleStatistic}>Thống kê</button>
        <button onClick={handleReset}>Làm mới</button>
        <button onClick={handleExportExcel}>Xuất excel</button>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="table-chart-container">
        <table>
          <thead>
            <tr>
              <th>Năm</th>
              <th>Vốn</th>
              <th>Doanh thu</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.nam}</td>
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
};

export default Year;
