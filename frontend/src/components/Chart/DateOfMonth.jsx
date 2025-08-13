import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Chart/Chart.css';
import * as XLSX from 'xlsx'
import thongkeService from '../../services/thongkeService';


const sumDataInGroups = (data) => {
  const result = [];
  const groupSize=3;
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize);
    const summedGroup = group.reduce(
      (acc, day) => ({
        chiphi: acc.chiphi + day.chiphi,
        doanhthu: acc.doanhthu + day.doanhthu,
        loi_nhuan: acc.loi_nhuan + day.loi_nhuan,
      }),
      { chiphi: 0, doanhthu: 0, loi_nhuan: 0 }
    );
    result.push(summedGroup);
  }
  if(data.length % groupSize !==0 ){
    const lastGroup =result.pop();
    const secondLastGroup =result.pop();
      result.push({
        chiphi: secondLastGroup.chiphi + lastGroup.chiphi,
        doanhthu: secondLastGroup.doanhthu + lastGroup.doanhthu,
        loi_nhuan: secondLastGroup.loi_nhuan + lastGroup.loi_nhuan,
      })
  }
  return result;
};
const DateOfMonth = () =>{
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);
    const [selectedYear, setSelectedYear] = useState(2024);
    const [data,setData] = useState([]);
     // Hàm format giá tiền
     const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const fetchDataDataOfMonth = async (params={}) =>{
      
      const data = await thongkeService.getThongKeTheoNgay({year:selectedYear, month:selectedMonth});
      setData(data);
    }
    useEffect(()=>{
      fetchDataDataOfMonth();
    },[selectedYear, selectedMonth]);

    const handleChangeyear=(e)=>{
        setSelectedYear(parseInt(e.target.value))
    }
    
    const handleChangeMonth =(e) => setSelectedMonth(e.target.value);

    const handleExportExcel = () =>{
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeDoanhThuNgayCuaThang");
      // 3. Xuất tệp Excel
      XLSX.writeFile(workbook, "ThongKeDoanhThuNgayCuaThang.xlsx");
  }
  const groupedData = sumDataInGroups(data);
  const chartData ={
        labels : groupedData.map((_, index) =>{
          const startDay = index * 3 + 1;
          let endDay = (index + 1) * 3;

        // Nếu đây là nhóm cuối cùng và số ngày cuối không chia hết cho 3
        if (index === groupedData.length - 1 && data.length % 3 !== 0) {
            endDay = data.length;
        }
          return `Ngày ${startDay}-${endDay}`;
        }),
        datasets :[
            {
                label:'Vốn',
                data:groupedData.map((group) => group.chiphi),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label : 'Doanh thu',
                data:groupedData.map((group) => group.doanhthu),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              },
              {
                label: 'Lợi nhuận',
                data:groupedData.map((group) => group.loi_nhuan),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
              },
        ] 
        
    };
    const allValues = [
      ...data.map(item => item.chiphi),
      ...data.map(item => item.doanhthu),
      ...data.map(item => item.loi_nhuan),
    ];

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero:false,
            min: minValue - (Math.abs(minValue) * 0.3),
            max: maxValue + (Math.abs(maxValue) * 0.3),
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
            text: `Thống kê vốn, doanh thu, và lợi nhuận tháng ${selectedMonth} năm ${selectedYear}`
          }
        }
    };

      return(
<div className="Chart-page">
          <div className="Filter-container">
            <label >Chọn tháng</label>
            <select value={selectedMonth} onChange={handleChangeMonth}>
            {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
            </select>
            <label>Chọn năm:</label>
            <select value={selectedYear} onChange={handleChangeyear}>
            {[2021, 2022, 2023, 2024].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
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
            <th>Ngày</th>
            <th>Chi Phí</th>
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
  </div>
      );
    
};
export default DateOfMonth;