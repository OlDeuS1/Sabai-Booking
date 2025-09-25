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

export const createPayment = async function(paymentData) {
  try {
    const res = await axios.post('http://localhost:3000/api/payments', paymentData, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error creating payment:', err);
    throw err;
  }
};

// Rating API functions
export const createRating = async function(ratingData) {
  try {
    const res = await axios.post('http://localhost:3000/api/ratings', ratingData, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error creating rating:', err);
    throw err;
  }
};

export const getRatingByBookingId = async function(bookingId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/rating/booking/${bookingId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null; // ยังไม่มี rating
    }
    console.error('Error getting rating:', err);
    throw err;
  }
};

export const getHotelRatings = async function(hotelId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/ratings/hotel/${hotelId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting hotel ratings:', err);
    throw err;
  }
};

export const getHotelAverageRating = async function(hotelId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/hotel/${hotelId}/average-rating`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting average rating:', err);
    throw err;
  }
};