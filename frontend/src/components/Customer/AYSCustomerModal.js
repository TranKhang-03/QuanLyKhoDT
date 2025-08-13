import React, { useState} from "react";
import axios from "axios";
const AYSCustomerModal = ({showAYS,handleAYS,formData,setSuccessMessage,fetchCustomers,setAYS,setSearch,setform,active,toast}) =>{
  const deleteData = async (MKH) => {


    (active ? toast.success("Ẩn thành công") : toast.success(" Hiện thành công!"));
    await axios.delete(`http://localhost:5000/api/customers/${MKH}`);
    fetchCustomers();
    setform({
      MKH: "",
      TKH: "",
      DC: "",
      SDT: "",
    });
    setAYS(!showAYS);
    setSearch({ MKH: "" });
    setTimeout(() => {
      setSuccessMessage(""); // Ẩn thông báo
    }, 2000);
  };
    return(
        <div
        class="interface_ays"
        style={{ display: showAYS ? "block" : "none" }}
      >
        <div class="overlay " onClick={() => handleAYS("")}></div>
        <div class="form_interface">
          <form class="form_interface_ays">
            <h1>Are You Sure</h1>
            
            <div class="button-addCustomer-interface">
            <button type="button" onClick={() => handleAYS("")}>No</button>
            <button type="button" onClick={() => deleteData(formData.MKH)}>Yes</button>
            </div>
          </form>
        </div>
      </div>
    )
}
export default AYSCustomerModal;