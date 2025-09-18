import axios from "axios";

export const getHotelData = async function(){
  try {
    const res = await axios.get('http://localhost:3000/api/hotels')
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}