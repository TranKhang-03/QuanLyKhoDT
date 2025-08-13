import React, { useState } from "react";

import axios from "axios";
const SearchProviderModal = ({ setSearch, search, setData, active,setProviderHidden }) => {
  //tìm kiếm nhà cung cấp
  const searchProvider = async (e) => {
    const { name, value } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
    const response = (
      active
        ? (await axios.get(`http://localhost:5000/api/providers`)).data.filter(
            (item) => item.trang_thai === 1
          )
        : (await axios.get(`http://localhost:5000/api/providers`)
    ).data.filter((item) => item.trang_thai === 0));

    if (value) {
      if (isNaN(value)) {
        const NCC_search = response.filter((response) =>
          response.ten_ncc.toLowerCase().includes(value.toLowerCase())
        );
        (active ? setData(NCC_search):setProviderHidden(NCC_search));
      } else {
        const NCC_search = response.filter((response) =>
          response.ma_ncc.toString().includes(value.toString())
        );
        (active ? setData(NCC_search):setProviderHidden(NCC_search));
      }
    } else {
      const response = await axios.get(`http://localhost:5000/api/providers`);
      (active ? setData(response.data.filter((item) => item.trang_thai === 1)):setProviderHidden(response.data.filter((item) => item.trang_thai === 0)));
    }
  };
  return (
    <div class="input-search">
      <input
        value={search.MNCC}
        name="MNCC"
        type="text"
        onChange={searchProvider}
        placeholder="Search......"
      ></input>
    </div>
  );
};
export default SearchProviderModal;
