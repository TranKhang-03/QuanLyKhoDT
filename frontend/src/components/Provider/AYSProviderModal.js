import React, { useState } from "react";

import axios from "axios";

const AYSProviderModal = ({
  showAYS,
  handleAYS,
  formData,
  setform,
  fetchProviders,
  active,
  setSearch,
  toast
}) => {
  const deleteProvider = async (MNCC) => {
    await axios.delete(`http://localhost:5000/api/providers/${MNCC}`);
    setform({
      MNCC: " ",
      TNCC: "",
      DC: " ",
      Email: " ",
      SDT: " ",
    });
    (active ? toast.success("Ẩn thành công") : toast.success("Hiện thành công"));
    setSearch({ MNCC: "" });
    fetchProviders();
    handleAYS("");
  };
  return (
    <div class="interface_ays" style={{ display: showAYS ? "block" : "none" }}>
      <div class="overlay " onClick={() => handleAYS("")}></div>
      <div class="form_interface">
        <form class="form_interface_ays">
          <h1>Are You Sure</h1>

          <div class="button-addCustomer-interface">
            <button type="button" onClick={() => handleAYS("")}>
              No
            </button>
            <button type="button" onClick={() => deleteProvider(formData.MNCC)}>
              Yes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AYSProviderModal;
