import axios from "axios";

export const getUserCur = async function(){
  try {
    const res = await axios.get('http://localhost:3000/api/profile', { withCredentials: true })
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getHotelData = async function(){
  try {
    const res = await axios.get('http://localhost:3000/api/hotels')
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getHotelRoomData = async function(hotelId){
  try {
    const res = await axios.get(`http://localhost:3000/api/hotel/${hotelId}/rooms`)
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getUserBookingHistory = async function(userId){
  try {
    const res = await axios.get(`http://localhost:3000/api/user/${userId}/bookings`)
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}