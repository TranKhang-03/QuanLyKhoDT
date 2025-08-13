import React ,{useState} from 'react'
import '../style/Statistics.css';
import TabChilden from '../components/ChildTab';
import StatisticProvider from '../components/statisticsChild/NhaCungCap.jsx';
import StatisticCustommer from '../components/statisticsChild/KhachHang.jsx';
import StatisticStock from '../components/statisticsChild/NhapXuat.jsx';
import StatisticOverview from '../components/Chart/TongQuan.jsx'
const Statistics=()=>{
    const [activeTab, setActiveTab] = useState('TongQuan');

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
    return (
        <div className="tabs-container">
            <div className="tab-buttons">
                {/* tab 1 */}
                <button
                    className={activeTab === 'TongQuan' ? 'active' : ''}
                    onClick={() => handleTabClick('TongQuan')}
                >
                    Tổng quan
                </button>

                {/* tab 2 */}
                <button
                    className={activeTab === 'NhapXuat' ? 'active' : ''}
                    onClick={() => handleTabClick('NhapXuat')}
                >
                    Nhập xuất
                </button>

                {/* tab 3 */}
                <button
                    className={activeTab === 'DoanhThu' ? 'active' : ''}
                    onClick={() => handleTabClick('DoanhThu')}
                >
                    Doanh thu
                </button>

                {/* tab 4 */}
                <button className={activeTab === 'KhachHang' ? 'active' : ''}
                        onClick={() => handleTabClick('KhachHang')}
                >
                    Khách hàng
                </button>

                    {/* tab 5 */}
                <button className={activeTab === 'NhaCungCap' ? 'active' : ''}
                        onClick={() => handleTabClick('NhaCungCap')}
                >
                    Nhà cung cấp
                </button>
            </div>
  
            <div className="tab-content">
                {activeTab === 'TongQuan' && <div><StatisticOverview/></div>}
                {activeTab === 'NhapXuat' && <div><StatisticStock/></div>}
                {activeTab === 'DoanhThu' && <div><TabChilden/></div>}
                {activeTab === 'KhachHang' && <div><StatisticCustommer/></div>}
                {activeTab === 'NhaCungCap' && <div><StatisticProvider/></div>}
            </div>
      </div>
    );
};
export default Statistics;