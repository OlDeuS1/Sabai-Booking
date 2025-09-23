import axios from "axios";

export const getUserCur = async function(){
  try {
    const res = await axios.get('http://localhost:3000/api/current-user', { withCredentials: true })
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

export const getHotelAdminData = async function () {
  try {
    const res = await axios.get("http://localhost:3000/api/hotels/admin");
    return res.data;
  } catch (err) {
    alert(`eror : ${err.message}`);
  }
};

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

export const getNormalUsers = async function () {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/user/normal`
    );
    return res.data;
  } catch (err) {
    alert(`eror : ${err.message}`);
  }
};

export const createBooking = async function(bookingData) {
  try {
    const res = await axios.post('http://localhost:3000/api/bookings', bookingData, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error creating booking:', err);
    throw err;
  }
};

export const getBookingById = async function(bookingId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/booking/${bookingId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting booking:', err);
    throw err;
  }
};

export const updateBookingStatus = async function(bookingId, status) {
  try {
    const res = await axios.put(`http://localhost:3000/api/booking/${bookingId}/status`, 
      { status }, 
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error('Error updating booking status:', err);
    throw err;
  }
};