import React, { useEffect } from "react";
import "../style/ExportForm.css";
import "../style/ImportForm.css";
import "../style/Customer.css";
import Textfield from "@atlaskit/textfield";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { getExports, addExport } from "../services/phieuxuatService";
import { getDetailPX} from "../services/chitietPhieuXuatService";
import productService from '../services/productService';
import {getpbSP}  from "../services/phienbanSanPhamService";
import CustomerService from "../services/customerService";
import { FaTrash, FaCheck} from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const PhieuXuat = () => {
  const [dataExport, setDataExport] = useState([]);
  const [StartDatePX, setStartDatePX] = useState("");
  const [EndDatePX, setEndDatePX] = useState("");
  const [searchIDPX, setSearchIDPX] = useState("");
  const [GiaNhoPX, setGiaNhoPX] = useState("");
  const [GiaLonPX, setGiaLonPX] = useState("");
  const [filteredDataPX, setFilteredDataPX] = useState([]);
  //const [showdetail, setShowDetail] = useState();
  const [dataDetailPX, setDataDetailPX] = useState([]);
  const [showOVlay, setShowOVlay] = useState(false);

  const handleRowClick = (id) => {
    //setShowDetail(id);
    GETDATA(id);
    setShowOVlay(true)
  };
  const handleCancel = () => {
    //setShowDetail(null);
    setShowOVlay(false);
  }

  const GETDATA = async (id) => {
    const data = await getDetailPX(id);
    if (data) {
      setDataDetailPX(data);
    }
  };

  useEffect(() => {
    const fectchExport = async () => {
      const data = await getExports();
      const formattedData = data.map((item) => {
        const date = new Date(item.thoi_gian_xuat); // Chuyển đổi chuỗi ngày thành đối tượng Date
        // Định dạng lại ngày theo kiểu "DD/MM/YYYY"
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        return { ...item, thoi_gian_xuat: formattedDate }; // Trả về item với ngày đã được định dạng lại
      });
      setDataExport(formattedData);
      setFilteredDataPX(formattedData);
    };
    fectchExport();
    
  }, []);
  const SearchPX = () => {
    const resultsPX = dataExport.filter((item) => {
      const checkIDPX = item.ma_px.toString().includes(searchIDPX)// tìm có chứa kí tự
      //const checkIDPX = item.ma_px.toString() === searchIDPX.trim(); // tìm duy nhất
      const tempdatePX = item.thoi_gian_xuat.split("/"); // cắt chuỗi theo dấu "-"
      const itemDatePX = new Date(
        `${tempdatePX[1]}-${tempdatePX[0]}-${tempdatePX[2]}`
      ); // định dạng tháng/ngày/năm theo input
      const startPX = StartDatePX ? new Date(StartDatePX + "T00:00:00") : null; // đặt về 00h ngày hôm đó
      const endPX = EndDatePX ? new Date(EndDatePX + "T23:59:59") : null; // đặt về cuối ngày hôm đó
      const giaStartPX = Number(GiaNhoPX);
      const giaEndPX = Number(GiaLonPX);
      const checkGiaPX =
        (!giaStartPX || item.tong_tien >= giaStartPX) &&
        (!giaEndPX || item.tong_tien <= giaEndPX);
      const checkNgayPX =
        (!startPX || itemDatePX >= startPX) && (!endPX || itemDatePX <= endPX);
      return checkGiaPX && checkNgayPX && checkIDPX;
    });
    setFilteredDataPX(resultsPX);
  };
  return (
    <div>
      <div className="Title">Danh Sách Phiếu Xuất</div>
      <div className="boxFind">
        <p>Tìm kiếm</p>
        <div className="custom-ID">
          <p>ID phiếu xuất:</p>
          <Textfield
            className="TF"
            value={searchIDPX}
            onChange={(e) => setSearchIDPX(e.target.value)}
          ></Textfield>
        </div>
        <div className="custom-startDate">
          <p>Từ ngày:</p>
          <input
            type="date"
            value={StartDatePX}
            onChange={(e) => setStartDatePX(e.target.value)}
          />
        </div>
        <div className="custom-endDate">
          <p>Đến ngày:</p>
          <input
            type="date"
            value={EndDatePX}
            onChange={(e) => setEndDatePX(e.target.value)}
          />
        </div>
        <div className="custom-SoTien">
          <p>Phân khúc tổng tiền:</p>
          <input
            type="text"
            value={GiaNhoPX}
            onChange={(e) => setGiaNhoPX(e.target.value)}
          />
          <span>-</span>
          <input
            type="text"
            value={GiaLonPX}
            onChange={(e) => setGiaLonPX(e.target.value)}
          />
        </div>
        <div className="custom-icSearch">
          <FaSearch className="icSearch" onClick={SearchPX} />
        </div>
      </div>
      <div className="listPX">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Mã phiếu xuất</th>
              <th style={{ width: "20%" }}>Mã nhân viên</th>
              <th style={{ width: "20%" }}>Mã khách hàng</th>
              <th style={{ width: "20%" }}>Thời gian xuất</th>
              <th style={{ width: "30%" }}>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataPX.map((datatable) => (
              <tr key={datatable.ma_px} onClick={()=>handleRowClick(datatable.ma_px)}>
                <td >{datatable.ma_px}</td>
                <td >{datatable.ma_nv}</td>
                <td >{datatable.ma_kh}</td>
                <td >{datatable.thoi_gian_xuat}</td>
                <td >{datatable.tong_tien.toLocaleString("vi-VN")} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showOVlay && (
        <div>
          <div className="overlay" onClick={handleCancel}></div>
          <DetailPX data={dataDetailPX} handleCancel={handleCancel} />
        </div>
      )}
    </div>
  );
};
const DetailPX = ({data, handleCancel}) =>{
  if (!data || data.length === 0) {
    return null; // Hoặc hiển thị một thông báo lỗi phù hợp
  }
  const totalMoney = data.reduce((total, item) => {
    return total + item.so_luong * item.gia_xuat;
  }, 0);
  return(
    <div className="detailPX">
      <div className="boxCTPX">
        <h3>Chi tiết hóa đơn</h3>
        <h4>Mã hóa đơn: {data[0].ma_px}</h4>
        <div className="content_customer format_table_CTPX">
          <table>
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá bán</th>
              </tr>
            </thead>
            <tbody>
              {data.map((datatable)=>(
                <tr>
                  <td>{datatable.ma_phien_ban_sp}</td>
                  <td>{datatable.so_luong}</td>
                  <td>{datatable.gia_xuat.toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="totalMoney">Tổng Tiền: {totalMoney.toLocaleString("vi-VN")} VNĐ </div>
        <div className="btn-OK" onClick={handleCancel}>Đồng ý</div>
      </div>
    </div>
  )
}

const SoLuongGiaNhap = ({handleCancel,handleOK, soLuong, setSoluong, error}) =>{
  return (
    <div className="ctn">
      <div className="custom-SL-GN">
        <div className="custom-SL">
          <p>Nhập số lượng:</p>
          <input type="text" className="ipSL" placeholder="Nhập số lượng"
            value={soLuong}
            onChange={(e)=>setSoluong(e.target.value)}
          />
          {error && <p className="err">{error}</p>} {/* Hiển thị lỗi */}
        </div>
        {/* <div className="custom-GN">
          <p>Giá nhập vào:</p>
          <input type="text" className="ipGN" placeholder="Giá muốn nhập vào"
           value={giaNhap}
           onChange={(e)=>setGiaNhap(e.target.value)}
           />
        </div> */}
        <div className="custom-btyn">
          <button className="bty" onClick={handleOK}>Đồng ý</button>
          <button className="btn" onClick={handleCancel}>Hủy</button>
        </div>
      </div>
    </div>
  )
}


const XuatHang = () => {
  const [dataProduct, setDataProduct] = useState([])
  const [dataPBSanPham, setdataPBSanPham] = useState([])
  const [queueData, setQueuedata] = useState([])
  const [soLuong, setSoluong] = useState("")
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState("")
  const [selectedKH, setSelectedKH] = useState(1);
  const [dataKH, setdataKH] = useState([])
  const [showNotification, setShowNotification] = useState();
  const [Rom, setRom] = useState([])
  const [Ram, setRam] = useState([])
  const [Color, setColor] = useState([])

  useEffect (() => {
    const fetchProducts = async () => {
      const ram = await axios.get("http://localhost:5000/api/ram");
      setRam(ram.data)
      const color = await axios.get("http://localhost:5000/api/color");
      setColor(color.data);
      const rom = await axios.get("http://localhost:5000/api/rom");
      setRom(rom.data);
      const dataProd = await productService.getAllProducts(); // sản phẩm
      setDataProduct(dataProd.data);
      const dataPB = await getpbSP();// phiên bản sp
      setdataPBSanPham(dataPB)
      const dataCustom = await CustomerService.getAllCustom();
      setdataKH(dataCustom.filter((item) => item.trang_thai === 1))
    }; 
    fetchProducts();
  },[])
   useEffect(()=>{
     if(!(queueData?.[0])){
       setQueuedata(JSON.parse(localStorage.getItem("queueDataX")))
     }
   },[])

  const findNameProd = (ma_sp) => {
    const product = dataProduct.find((item) => item.ma_sp === ma_sp);
    return product ? product.ten_sp : "";
  };
  const findNameRam = (ma_ram) => {
    const ram = Ram.find((item) => item.ma_ram === ma_ram);
    return ram ? ram.kich_thuoc_ram : "";
  };
  const findNameRom = (ma_rom) => {
    const rom = Rom.find((item) => item.ma_rom === ma_rom);
    return rom ? rom.kich_thuoc_rom : "";
  };
  const findNameColor = (ma_mau) => {
    const color = Color.find((item) => item.ma_mau === ma_mau);
    return color ? color.ten_mau : "";
  };

  const handleToggleNotification = (ma_phien_ban_sp) => {
    setShowNotification(ma_phien_ban_sp);
    setShowOverlay(true);
  };
  const handleCancel = () => {
    setError("")
    setShowNotification(null);
    setShowOverlay(false);
    setSoluong("")
  };

  const handleOK = (showNotification) => {
     const checkNguyenDuong = () => {
        let queueTemp = queueData || [];
       if( !soLuong || !soLuong.match(/^(?!0)\d+$/))
       {
         setError("Số lượng phải là số nguyên dương và lớn hơn 0")
         return;
       }
       else{
         setError("")
         const data = dataPBSanPham?.find((item)=>item.ma_phien_ban_sp === showNotification)
         const newData ={
           ma_sp : data.ma_sp,
           ma_phien_ban_sp: data.ma_phien_ban_sp,
           ten_sp : dataProduct.find((item) => item.ma_sp === data.ma_sp)?.ten_sp,
           so_luong: parseInt(soLuong),
           gia_xuat: data.gia_xuat,
           tong_tien: parseInt(soLuong) * parseInt(data.gia_xuat)
         };
          const dataSL = queueTemp?.find((item)=>item.ma_phien_ban_sp === newData.ma_phien_ban_sp)
          if(parseInt(soLuong) > data.ton_kho){
            setError("Không đủ số lượng")
            return;
          }
          else if(dataSL)
           {
            if(parseInt(dataSL.so_luong) + parseInt(soLuong) > data.ton_kho){
              setError("Tổng số lượng xuất phải bé hơn số lượng tồn kho")
              return;
            }
            else{
              const updatedQueue = queueTemp.map((item) =>
                item.ma_phien_ban_sp === data.ma_phien_ban_sp ?
                {
                  ...item,
                  so_luong: parseInt(item.so_luong) + parseInt(soLuong),
                  tong_tien: (parseInt(item.so_luong) + parseInt(soLuong)) * parseInt(item.gia_xuat),
                } : item
              )
              queueTemp =updatedQueue;
              handleCancel();
            }
           }
          else
           {
            queueTemp.push(newData)
            handleCancel();
           }
         }
         setQueuedata(queueTemp)
      localStorage.setItem("queueDataX", JSON.stringify(queueTemp));
       }
     checkNguyenDuong()
   }
    

  const deleteIQueue = (ma_phien_ban_sp) => {
    const updatedData = queueData.filter((item) => item.ma_phien_ban_sp !== ma_phien_ban_sp);
    setQueuedata(updatedData);
    localStorage.setItem("queueDataX", JSON.stringify(updatedData));
  };

  if(!dataPBSanPham || dataPBSanPham.length === 0)
    {
      return null;
    }

    if(!dataKH || dataKH.length === 0)
    {
        return null;
    }
    const deleteAll = () =>{
      localStorage.setItem("queueDataX", JSON.stringify([]));
      setQueuedata([])
    }
    const DuyetPN = () => {
      if(queueData.length !== 0)
      {
        const newD = new Date();
        const totalTien = queueData.reduce((total, item) => total + item.tong_tien, 0);
        const newPX = {
          ma_nv: localStorage.getItem("ma_nv"),
          ma_kh: selectedKH,
          thoi_gian_xuat: newD,
          tong_tien: totalTien,
          chi_tiet_phieu_xuat: queueData,
        }
        console.log(newPX)
        addExport(newPX)

        queueData?.forEach((itemQE) => {
          dataPBSanPham?.forEach((itemSP) => {
            if(itemSP.ma_phien_ban_sp === itemQE.ma_phien_ban_sp)
            {
              itemSP.ton_kho = (itemSP.ton_kho || 0) - itemQE.so_luong 
            }
            }
          )
        })

        setQueuedata([])
        localStorage.setItem("queueDataX", JSON.stringify([]));
        alert("Duyệt đơn xuất thành công")
      }
      else{
        alert("Vui lòng thêm sản phẩm vào hàng chờ")
      }
    }

    return (
      <div className="cardNhapHang">
        <div className="custom-listSP">
          <p>Danh sách sản phẩm</p>
          <div className="listSP">
            <table>  
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Mã phiên bản</th>
                  <th>Tên sản phẩm</th>
                  <th>Ram</th>
                  <th>Rom</th>
                  <th>Màu sắc</th>
                  <th>Giá nhập</th>
                  <th>Giá xuất</th>
                  <th>tồn kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
                <tbody>
                {dataPBSanPham.map((datatable) => (
                  <tr key={datatable.ma_phien_ban_sp}>
                    <td style={{ width: "5%" }}>{datatable.ma_sp}</td>
                    <td style={{ width: "5%" }}>{datatable.ma_phien_ban_sp}</td>
                    <td style={{ width: "18%" }}>{findNameProd(datatable.ma_sp)}</td>
                    <td style={{ width: "5%" }}>
                    {findNameRam(datatable.ma_ram)}GB
                    </td>
                    <td style={{ width: "5%" }}>
                    {findNameRom(datatable.ma_rom)}GB
                    </td>
                    <td style={{ width: "7%" }}>
                   {findNameColor(datatable.ma_mau)}
                    </td>
                    <td style={{ width: "15%" }}>{datatable.gia_nhap.toLocaleString("vi-VN")} VNĐ</td>
                    <td style={{ width: "15%" }}>{datatable.gia_xuat.toLocaleString("vi-VN")} VNĐ</td>
                    <td style={{ width: "15%" }}>{datatable.ton_kho}</td>
                    <td style={{ width: "10%" }}>
                      <div className="custom-icAdd">
                        <FaPlus className="iconAdd" onClick={() => handleToggleNotification(datatable.ma_phien_ban_sp)}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            { showOverlay && (<div>
              <div className="overlay" onClick={handleCancel}></div>
                <SoLuongGiaNhap handleCancel={handleCancel} 
                handleOK={()=>handleOK(showNotification)} 
                soLuong={soLuong} 
                setSoluong={setSoluong} 
                error={error}
                />
              </div>)
            }
          </div>
        </div>
            
        <div className="custom-queue">
          <p>Hàng chờ xuất</p>
          <div className="custom-tb-evtb">
          <div className="queue">
            <table style={{ width: "100%"}}>
              <thead>
                <tr>
                  <th style={{width: "10%"}}>Mã sản phẩm</th>
                  <th style={{width: "10%"}}>Mã phiên bản</th>
                  <th style={{width: "20%"}}>Tên sản phẩm</th>
                  <th style={{width: "15%"}}>Đơn giá xuất</th>
                  <th style={{width: "10%"}}>Số lượng</th>
                  <th style={{width: "20%"}}>Tổng tiền (VND)</th>
                  <th style={{width: "15%"}}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {
                  queueData?.map((dataQueue)=>
                  (
                    <tr key={dataQueue.masp}>
                      <td style={{width: "10%"}}>{dataQueue.ma_sp}</td>
                      <td style={{width: "10%"}}>{dataQueue.ma_phien_ban_sp}</td>
                      <td style={{width: "20%"}}>{dataQueue.ten_sp}</td>
                      <td style={{width: "15%"}}>{dataQueue.gia_xuat.toLocaleString("vi-VN")} VNĐ</td>
                      <td style={{width: "10%"}}>{dataQueue.so_luong}</td>
                      <td style={{width: "20%"}}>{dataQueue.tong_tien.toLocaleString("vi-VN")} VNĐ</td>
                      <td style={{width: "15%"}}>
                        <div className="custom-icon">
                          <FaTrash className="icDelete"
                          onClick={() => deleteIQueue(dataQueue.ma_phien_ban_sp)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="ev">
            <button className="evAll1" onClick={deleteAll}>
              <FaTrash className="icAll"/>
              <p>Xóa tất cả</p>
            </button>
            <select className="supplier" value={selectedKH} onChange={(e)=>setSelectedKH(e.target.value)}>
                {dataKH.map((supplier) => (
                <option key={supplier.ma_ncc} value={supplier.ma_ncc}>
                {supplier.ma_kh}. {supplier.ten_kh}
            </option>
            ))}
            </select>
            <button className="evAll3" onClick={DuyetPN}>
              <FaCheck className="icAll"/>
              <p>Duyệt</p>
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  };







const ExportForm = () => {
  const [activeTab, setActiveTab] = useState("xuathang")
  const handleTab = (tabName) =>
  {
    setActiveTab(tabName)
  }
  return (
    <div>
      <div className="title-Selection">
        <p className={`titleNH ${activeTab === "xuathang" ? "selectTab" : ""}`}
        onClick={() => handleTab("xuathang")}
        >Xuất hàng</p>
        <p className={`titlePN ${activeTab === "phieuxuat" ? "selectTab" : ""}`}
        onClick={() => handleTab("phieuxuat")}
        >Phiếu Xuất</p>
      </div>
      { activeTab === "xuathang" ? <XuatHang/> : <PhieuXuat/>}
    </div>
  )
}

export default ExportForm;
