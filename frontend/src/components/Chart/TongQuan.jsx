import React, { useEffect, useState }  from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Chart/Overview.css';
import thongkeService from '../../services/thongkeService';
import {getCountEmployee} from '../../services/EmployeeService';
import CustomerService from '../../services/customerService';
import productService from '../../services/productService';
import { FaMobileScreenButton,FaUser ,FaUserTie  } from "react-icons/fa6";
const TongQuan = () =>{
    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataCustomer,setDataCustomer] = useState([]);
    const [dataEmployee,setDataEmployee] = useState([]);
    const [dataProduct,setDataProduct] = useState([]);
    useEffect(() => {
        const fetchThongKeData = async () => {
            try {
                const result = await thongkeService.getThongKe7NgayGanNhat();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); 
            }
        };
        const fetchCustomer = async () => {
            try {
                const result = await CustomerService.getCountCustomer();
                setDataCustomer(result);
            } catch (error) {
                console.error("Error fetching data Customer:", error);
            }
        };
        const fetchEmployee = async () =>{
            try {
                const result = await getCountEmployee();
                setDataEmployee(result);
            } catch (error) {
                console.error("Error fetching data Employee:", error);
            }
        };
        const fetchProduct = async () =>{
            try {
                const result = await productService.getCountProduct();
                setDataProduct(result);
            } catch (error) {
                console.error("Error fetching data Product:", error);
            }
        };

        fetchThongKeData();
        fetchCustomer();
        fetchEmployee();
        fetchProduct();
    }, []); 
    // Hàm format giá tiền
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
      };
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
              text: `Thống kê doanh thu 8 ngày gần nhất`,
            }
          }
    };
    return (
        <div className='Overview-container'>
            <header className='overview-header'>
                <div className='statistic-item'>
                    <div className='stats-icon'><FaMobileScreenButton/></div>
                    <div className='stats-info'>
                        <h3>{dataProduct.countProduct}</h3>
                        <p>Sản phẩm hiện có trong kho</p>
                    </div>
                </div>
                <div className='statistic-item'>
                    <div className='stats-icon'><FaUserTie/></div>
                    <div className='stats-info'>
                        <h3>{dataCustomer.customerCount}</h3>
                        <p>Khách từ trước đến nay</p>
                    </div>
                </div>
                <div className='statistic-item'>
                    <div className='stats-icon'><FaUser/></div>
                    <div className='stats-info'>
                        <h3>{dataEmployee.count}</h3>
                        <p>Nhân viên đang hoạt động</p>
                    </div>
                </div>
            </header>
            <main className='overview-chart'>               
                <Line data={chartData} options={options} />     
            </main>
            <footer className="overview-table">
            
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
           
            </footer>
        </div>
    );
}
export default TongQuan;