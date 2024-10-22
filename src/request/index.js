import axios from 'axios';

axios.interceptors.response.use((res) => res.data);

const getProvinceGeo = async () => {
  return axios.get(
    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
  );
};

export { getProvinceGeo };
