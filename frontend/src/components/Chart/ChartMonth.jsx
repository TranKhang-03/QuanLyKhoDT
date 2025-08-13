import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Chart/Chart.css';
import * as XLSX from 'xlsx';
import thongkeService from '../../services/thongkeService';

const ChartMonth =()=>{
    const [selectedYear ,setSelectedYear] =useState(2024);
    const [data,setData] = useState([]);
      // Hàm format giá tiền
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const fetchDataMonth = async (params={}) =>{
      const data = await thongkeService.getThongKeTheoThang(params);
      setData(data);
    };
    useEffect(()=>{
      fetchDataMonth({year: selectedYear});
    },[selectedYear])
    const handleExportExcel = () =>{
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeDoanhThuTheothang");
      // 3. Xuất tệp Excel
      XLSX.writeFile(workbook, "ThongKeDoanhThuTheothang.xlsx");
    } 
    
    const handleChangeyear =(e) =>{
      const year = parseInt(e.target.value);
      setSelectedYear(year);
      fetchDataMonth({ year:year});
    }
    const filteredData = data.filter(item => item.nam === selectedYear);
    const chartData = {
      labels : filteredData.map(item => item.thang),
      datasets : [
        {
          label :'Vốn',
          data: filteredData.map(item =>item.chiphi),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label : 'Doanh thu',
          data:filteredData.map(item => item.doanhthu),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Lợi nhuận',
          data: filteredData.map(item => item.loi_nhuan),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        },
      ],

    } ;
    const allValues = [
      ...filteredData.map(item => item.chiphi),
      ...filteredData.map(item => item.doanhthu),
      ...filteredData.map(item => item.loi_nhuan),
    ];
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero:false,
            suggestedMin: minValue - (Math.abs(minValue) * 0.1),
            suggestedMax: maxValue + (Math.abs(maxValue) * 0.1), 
            ticks: {
              callback: function (value) {
                return `${formatCurrency(value)}`;
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
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: `Thống kê vốn, doanh thu, và lợi nhuận năm ${selectedYear}`
          }
        }
      };
  return (
    <div className="Chart-page">
          <div className="Filter-container">
            <label>Chọn năm thống kê:</label>
            <select value={selectedYear} onChange={handleChangeyear}>
              <option selected value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
            <button onClick={handleExportExcel}>Xuất excel</button>
          </div>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        

    <div className="table-chart-container">
      <table>
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Vốn</th>
            <th>Doanh thu</th>
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.thang}</td>
              <td>{formatCurrency(item.chiphi)}</td>
              <td>{formatCurrency(item.doanhthu)}</td>
              <td>{formatCurrency(item.loi_nhuan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default ChartMonth;