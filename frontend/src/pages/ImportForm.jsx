import React, { useEffect } from "react";
import "../style/ImportForm.css";
import "../style/ExportForm.css";
import Textfield from "@atlaskit/textfield";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { FaTrash, FaCheck} from "react-icons/fa";
import productService from "../services/productService";
import { getpbSP} from "../services/phienbanSanPhamService";
import { getAllprovider } from "../services/providerService";
import { getImports, addImport } from "../services/importService";
import { getDetailPN } from "../services/detailImportService";

import axios from "axios";

const SoLuongGiaNhap = ({
  handleCancel,
  handleOK,
  soLuong,
  setSoluong,
  giaNhap,
  setGiaNhap,
  error,
}) => {
  return (
    <div className="ctn">
      <div className="custom-SL-GN">
        <div className="custom-SL">
          <p>Nhập số lượng:</p>
          <input
            type="text"
            className="ipSL"
            placeholder="Nhập số lượng"
            value={soLuong}
            onChange={(e) => setSoluong(e.target.value)}
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
          <button className="bty" onClick={handleOK}>
            Đồng ý
          </button>
          <button className="btn" onClick={handleCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
const NhapHang = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [dataPBSanPham, setdataPBSanPham] = useState([]);
  const [queueData, setQueuedata] = useState([]);
  const [soLuong, setSoluong] = useState("");
  const [giaNhap, setGiaNhap] = useState("");
  const [showNotification, setShowNotification] = useState();
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(1);
  const [dataProvider, setdataProvider] = useState([]);
  const [Rom, setRom] = useState([])
  const [Ram, setRam] = useState([])
  const [Color, setColor] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const ram = await axios.get("http://localhost:5000/api/ram");
      setRam(ram.data)
      const color = await axios.get("http://localhost:5000/api/color");
      setColor(color.data);
      const rom = await axios.get("http://localhost:5000/api/rom");
      setRom(rom.data);
      const dataProd = await productService.getAllProducts(); // sản phẩm
      setDataProduct(dataProd.data);
      const dataPB = await getpbSP(); // phiên bản sp
      setdataPBSanPham(dataPB);
      const dataPV = await getAllprovider(); // nhà cung cấp
      setdataProvider(dataPV.filter((item) => item.trang_thai === 1));
    };
    fetchProducts();
  }, []);
  // useEffect(() => {
  //   if(queueData?.[0]){
  //     localStorage.setItem("queueDataN", JSON.stringify(queueData));
  //   }
  //   else{
  //     localStorage.setItem("queueDataN", JSON.stringify([]));
  //   }
  // }, [queueData]);
  useEffect(()=>{
    if(!(queueData?.[0])){
      setQueuedata(JSON.parse(localStorage.getItem("queueDataN")))
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
    setError("");
    setShowNotification(null);
    setShowOverlay(false);
    setGiaNhap("");
    setSoluong("");
  };

  const handleOK = (showNotification) => {
    const checkNguyenDuong = () => {
      let queueTemp = queueData || [];
      if (!soLuong || !soLuong.match(/^(?!0)\d+$/)) {
        setError("Số lượng phải là số nguyên dương và lớn hơn 0");
        return;
      } else {
        setError("");
        const data = dataPBSanPham?.find(
          (item) => item.ma_phien_ban_sp === showNotification
        );
        const newData = {
          ma_sp: data.ma_sp,
          ma_phien_ban_sp: data.ma_phien_ban_sp,
          ten_sp: dataProduct?.find((item) => item.ma_sp === data.ma_sp)?.ten_sp,
          so_luong: parseInt(soLuong),
          gia_nhap: data.gia_nhap,
          tong_tien: parseInt(soLuong) * parseInt(data.gia_nhap),
        };
        if (
          queueTemp?.find(
            (item) => item.ma_phien_ban_sp === newData.ma_phien_ban_sp
          )
        ) {
          const updatedQueue = queueTemp?.map((item) =>
            item.ma_phien_ban_sp === data.ma_phien_ban_sp
              ? {
                  ...item,
                  so_luong: parseInt(item.so_luong) + parseInt(soLuong),
                  tong_tien:
                    (parseInt(item.so_luong) + parseInt(soLuong)) *
                    parseInt(item.gia_nhap),
                }
              : item
          );
          queueTemp = updatedQueue;
        } else {
          queueTemp.push(newData);
        }
        handleCancel();
      }
      setQueuedata(queueTemp)
      localStorage.setItem("queueDataN", JSON.stringify(queueTemp));
    };
    checkNguyenDuong();
  };

  const deleteIQueue = (ma_phien_ban_sp) => {
    const updatedData = queueData.filter(
      (item) => item.ma_phien_ban_sp !== ma_phien_ban_sp
    );
    setQueuedata(updatedData);
    localStorage.setItem("queueDataN", JSON.stringify(updatedData));

  };
  if (!dataPBSanPham || dataPBSanPham.length === 0) {
    return null;
  }

  if (!dataProvider || dataProvider.length === 0) {
    return null;
  }
  const deleteAll = () => {
    setQueuedata([]);
    localStorage.setItem("queueDataN", JSON.stringify([]));
  };

  const DuyetPN = () => {
    console.log("test", queueData);
    if (queueData.length !== 0) {
      const newD = new Date();
      const totalTien = queueData.reduce(
        (total, item) => total + item.tong_tien,
        0
      );
      const newPN = {
        ma_nv: localStorage.getItem("ma_nv"),
        ma_ncc: selectedSupplier,
        thoi_gian_nhap: newD,
        tong_tien: totalTien,
        chi_tiet_phieu_nhap: queueData,
      };
      addImport(newPN);
      localStorage.setItem("queueDataN", JSON.stringify([]));
      alert("Duyệt đơn nhập thành công");

      queueData?.forEach((itemQE) => {
        dataPBSanPham?.forEach((itemSP) => {
          if(itemSP.ma_phien_ban_sp === itemQE.ma_phien_ban_sp)
          {
            itemSP.ton_kho = (itemSP.ton_kho || 0) + itemQE.so_luong 
          }
          }
        )
      })

      setQueuedata([]);
    } else {
      alert("Vui lòng thêm sản phẩm vào hàng chờ");
    }
    
  };

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
                  <td style={{ width: "18%" }}>
                    {findNameProd(datatable.ma_sp)}
                  </td>
                  <td style={{ width: "5%" }}>
                  {findNameRam(datatable.ma_ram)}GB
                  </td>
                  <td style={{ width: "5%" }}>
                  {findNameRom(datatable.ma_rom)}GB
                  </td>
                  <td style={{ width: "7%" }}>
                  {findNameColor(datatable.ma_mau)}
                  </td>
                  <td style={{ width: "15%" }}>
                    {datatable.gia_nhap.toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td style={{ width: "15%" }}>
                    {datatable.gia_xuat.toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td style={{ width: "15%" }}>{datatable.ton_kho}</td>
                  <td style={{ width: "10%" }}>
                    <div className="custom-icAdd">
                      <FaPlus
                        className="iconAdd"
                        onClick={() =>
                          handleToggleNotification(datatable.ma_phien_ban_sp)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showOverlay && (
            <div>
              <div className="overlay" onClick={handleCancel}></div>
              <SoLuongGiaNhap
                handleCancel={handleCancel}
                handleOK={() => handleOK(showNotification)}
                soLuong={soLuong}
                setSoluong={setSoluong}
                giaNhap={giaNhap}
                setGiaNhap={setGiaNhap}
                error={error}
              />
            </div>
          )}
        </div>
      </div>

      <div className="custom-queue">
        <p>Hàng chờ nhập</p>
        <div className="custom-tb-evtb">
          <div className="queue">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Mã sản phẩm</th>
                  <th style={{ width: "10%" }}>Mã phiên bản</th>
                  <th style={{ width: "20%" }}>Tên sản phẩm</th>
                  <th style={{ width: "15%" }}>Đơn giá nhập</th>
                  <th style={{ width: "10%" }}>Số lượng</th>
                  <th style={{ width: "20%" }}>Tổng tiền (VND)</th>
                  <th style={{ width: "15%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {queueData?.map((dataQueue) => (
                  <tr key={dataQueue.masp}>
                    <td style={{ width: "10%" }}>{dataQueue.ma_sp}</td>
                    <td style={{ width: "10%" }}>
                      {dataQueue.ma_phien_ban_sp}
                    </td>
                    <td style={{ width: "20%" }}>{dataQueue.ten_sp}</td>
                    <td style={{ width: "15%" }}>
                      {dataQueue.gia_nhap.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td style={{ width: "10%" }}>{dataQueue.so_luong}</td>
                    <td style={{ width: "20%" }}>
                      {dataQueue.tong_tien.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td style={{ width: "15%" }}>
                      <div className="custom-icon">
                        <FaTrash
                          className="icDelete"
                          onClick={() =>
                            deleteIQueue(dataQueue.ma_phien_ban_sp)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ev">
            {/* <button className="evAll0">
            <NewReleasesIcon style={{ color: 'red' }} className="icAll" />
            <p>Nhập SP mới</p> 
          </button> */}
            <button className="evAll1" onClick={deleteAll}>
              <FaTrash className="icAll" />
              <p>Xóa tất cả</p>
            </button>
            <select
              className="supplier"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              {dataProvider.map((supplier) => (
                <option key={supplier.ma_ncc} value={supplier.ma_ncc}>
                  {supplier.ma_ncc}. {supplier.ten_ncc}
                </option>
              ))}
            </select>
            <button className="evAll3" onClick={DuyetPN}>
              <FaCheck className="icAll" />
              <p>Duyệt</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhieuNhap = () => {
  const [dataPN, setdataPN] = useState([]);
  const [StartDatePN, setStartDatePN] = useState("");
  const [EndDatePN, setEndDatePN] = useState("");
  const [searchIDPN, setSearchIDPN] = useState("");
  const [filteredDataPN, setFilteredDataPN] = useState(dataPN);
  const [GiaNhoPN, setGiaNhoPN] = useState("");
  const [GiaLonPN, setGiaLonPN] = useState("");
  const [datadetailPN, setdataDetailPN] = useState([]);
  const [showOVlay, setShowOVlay] = useState(false);

  useEffect(() => {
    const fectchImport = async () => {
      const data = await getImports();
      const formattedData = data.map((item) => {
        const date = new Date(item.thoi_gian_nhap); // Chuyển đổi chuỗi ngày thành đối tượng Date
        // Định dạng lại ngày theo kiểu "DD/MM/YYYY"
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        return { ...item, thoi_gian_nhap: formattedDate }; // Trả về item với ngày đã được định dạng lại
      });
      setdataPN(formattedData);
      setFilteredDataPN(formattedData);
    };
    fectchImport();
  }, []);

  const GETDATA = async (id) => {
    const data = await getDetailPN(id);
    if (data) {
      setdataDetailPN(data);
    }
  };
  const handleCancel = () => {
    //setShowDetail(null);
    setShowOVlay(false);
  };
  const handleRowClick = (id) => {
    //setShowDetail(id);
    GETDATA(id);
    setShowOVlay(true);
  };

  const searchPN = () => {
    const resultsPN = dataPN.filter((item) => {
      const checkIDPN =
        !searchIDPN || item.ma_pn.toString().includes(searchIDPN); // trả về true hoặc false
      const tempDatePN = item.thoi_gian_nhap.split("/");
      const valueTimePN = new Date(
        `${tempDatePN[1]}-${tempDatePN[0]}-${tempDatePN[2]}`
      );
      const startPN = StartDatePN ? new Date(StartDatePN + "T00:00:00") : null;
      const endPN = EndDatePN ? new Date(EndDatePN + "T23:59:59") : null;
      const giaStartPN = Number(GiaNhoPN);
      const giaEndPN = Number(GiaLonPN);
      const checkNgayPN =
        (!startPN || startPN <= valueTimePN) &&
        (!endPN || endPN >= valueTimePN);
      const checkGiaPN =
        (!giaStartPN || giaStartPN <= item.tong_tien) &&
        (!giaEndPN || giaEndPN >= item.tong_tien);
      return checkIDPN && checkGiaPN && checkNgayPN;
    });
    setFilteredDataPN(resultsPN);
  };

  return (
    <div>
      <div className="Title">Danh Sách Phiếu Nhập</div>
      <div className="boxFind">
        <p>Tìm kiếm</p>
        <div className="custom-ID fixID">
          <p>ID phiếu nhập:</p>
          <Textfield
            className="TF"
            value={searchIDPN}
            onChange={(e) => setSearchIDPN(e.target.value)}
          ></Textfield>
        </div>
        <div className="custom-startDate">
          <p>Từ ngày:</p>
          <input
            type="date"
            value={StartDatePN}
            onChange={(e) => setStartDatePN(e.target.value)}
          />
        </div>
        <div className="custom-endDate">
          <p>Đến ngày:</p>
          <input type="date" value={EndDatePN} onChange={(e) => setEndDatePN} />
        </div>
        <div className="custom-SoTien">
          <p>Phân khúc tổng tiền:</p>
          <input
            type="text"
            value={GiaNhoPN}
            onChange={(e) => setGiaNhoPN(e.target.value)}
          />
          <p>-</p>
          <input
            type="text"
            value={GiaLonPN}
            onChange={(e) => setGiaLonPN(e.target.value)}
          />
        </div>
        <div className="custom-icSearch">
          <FaSearch className="icSearch" onClick={searchPN} />
        </div>
      </div>
      <div className="listPN">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Mã phiếu nhập</th>
              <th style={{ width: "20%" }}>Mã nhân viên</th>
              <th style={{ width: "20%" }}>Mã nhà cung cấp</th>
              <th style={{ width: "20%" }}>Thời gian nhập</th>
              <th style={{ width: "30%" }}>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataPN.map((datatable) => (
              <tr
                key={datatable.id}
                onClick={() => handleRowClick(datatable.ma_pn)}
              >
                <td style={{ width: "10%" }}>{datatable.ma_pn}</td>
                <td style={{ width: "20%" }}>{datatable.ma_nv}</td>
                <td style={{ width: "20%" }}>{datatable.ma_ncc}</td>
                <td style={{ width: "20%" }}>{datatable.thoi_gian_nhap}</td>
                <td style={{ width: "30%" }}>
                  {datatable.tong_tien.toLocaleString("vi-VN")} VNĐ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showOVlay && (
        <div>
          <div className="overlay" onClick={handleCancel}></div>
          <DetailPN data={datadetailPN} handleCancel={handleCancel} />
        </div>
      )}
    </div>
  );
};

const ImportForm = () => {
  const [activeTab, setActiveTab] = useState("nhaphang");
  const handleTab = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <div>
      <div className="title-Selection">
        <p
          className={`titleNH ${activeTab === "nhaphang" ? "selectTab" : ""}`}
          onClick={() => handleTab("nhaphang")}
        >
          Nhập hàng
        </p>
        <p
          className={`titlePN ${activeTab === "phieunhap" ? "selectTab" : ""}`}
          onClick={() => handleTab("phieunhap")}
        >
          Phiếu Nhập
        </p>
      </div>
      {activeTab === "nhaphang" ? <NhapHang /> : <PhieuNhap />}
    </div>
  );
};
const DetailPN = ({ data, handleCancel }) => {
  if (!data || data.length === 0) {
    return null; // Hoặc hiển thị một thông báo lỗi phù hợp
  }
  const totalMoney = data.reduce((total, item) => {
    return total + item.so_luong * item.gia_nhap;
  }, 0);
  return (
    <div className="detailPX">
      <div className="boxCTPX">
        <h3>Chi tiết phiếu nhập</h3>
        <h4>Mã phiếu nhập: {data[0].ma_pn}</h4>
        <div className="content_customer format_table_CTPX">
          <table>
            <thead>
              <tr>
                <th>Mã phiên bản phẩm</th>
                <th>Số lượng</th>
                <th>Giá nhập</th>
              </tr>
            </thead>
            <tbody>
              {data.map((datatable) => (
                <tr>
                  <td>{datatable.ma_phien_ban_sp}</td>
                  <td>{datatable.so_luong}</td>
                  <td>{datatable.gia_nhap.toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="totalMoney">
          Tổng Tiền: {totalMoney.toLocaleString("vi-VN")} VNĐ{" "}
        </div>
        <div className="btn-OK" onClick={handleCancel}>
          Đồng ý
        </div>
      </div>
    </div>
  );
};
export default ImportForm;
