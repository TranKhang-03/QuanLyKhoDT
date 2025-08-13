import React ,{useState} from 'react';
import '../style/ChildTab.css';
import TheoNam from '../components/Chart/Year.jsx';
import './Chart/ChartMonth.jsx'
import ChartMonth from './Chart/ChartMonth.jsx';
import ChartDateOfMonth from '../components/Chart/DateOfMonth.jsx';
import DateToDate from './Chart/DateToDate.jsx';
const ChildTab = ()=>{
    const [activeTab, setActiveTab] = useState('TheoNam');

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    return (
        <div className='child-tabs-container'>
            <div className='tab-buttons'>
                <button className={activeTab ==='TheoNam' ? 'active' : ''}
                        onClick={()=> handleTabClick('TheoNam')}
                >
                    Doanh thu theo năm
                </button>
                <button className={activeTab ==='TheoThang' ? 'active' : ''}
                        onClick={()=> handleTabClick('TheoThang')}
                >
                    Doanh thu theo tháng trong năm
                </button>
                <button className={activeTab ==='TheoNgay' ? 'active' : ''}
                        onClick={()=> handleTabClick('TheoNgay')}
                >
                    Doanh thu theo ngày trong tháng
                </button>
                <button className={activeTab ==='NgayDenNgay' ? 'active' : ''}
                        onClick={()=> handleTabClick('NgayDenNgay')}
                >
                    Doanh thu từ ngày đến ngày
                </button>
            </div>
            <div className='tab-content'>
                {activeTab === 'TheoNam' && <div><TheoNam/></div>} 
                {activeTab === 'TheoThang' && <div><ChartMonth/></div>} 
                {activeTab === 'TheoNgay' && <div><ChartDateOfMonth/></div>} 
                {activeTab === 'NgayDenNgay' && <div><DateToDate/></div>}
            </div>
        </div>
    );

};
export default ChildTab;