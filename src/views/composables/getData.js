import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getUserCur = async function(){
  try {
    const res = await axios.get(`${API_BASE}/api/current-user`, {
      withCredentials: true,
    });
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getHotelData = async function(){
  try {
    const res = await axios.get(`${API_BASE}/api/hotels`)
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getHotelAdminData = async function () {
  try {
    console.log('Fetching hotel admin data...');
    const res = await axios.get(`${API_BASE}/api/hotels/admin`);
    console.log('Hotel admin data response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error fetching hotel admin data:', err);
    console.error('Error response:', err.response?.data);
    alert(`Error fetching hotel data: ${err.response?.data?.error || err.message}`);
    return [];
  }
};

export const getHotelByOwnerId = async function (ownerId) {
  try {
    const res = await axios.get(`${API_BASE}/api/hotels/owner/${ownerId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting hotels by owner ID:', err);
    alert(`Error: ${err.message}`);
  }
};

export const getHotelRoomData = async function(hotelId){
  try {
    const res = await axios.get(`${API_BASE}/api/hotel/${hotelId}/rooms`)
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getUserBookingHistory = async function(userId){
  try {
    const res = await axios.get(`${API_BASE}/api/user/${userId}/bookings`)
    return res.data;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
}

export const getNormalUsers = async function () {
  try {
    const res = await axios.get(
      `${API_BASE}/api/user/normal`
    );
    return res.data;
  } catch (err) {
    alert(`eror : ${err.message}`);
  }
};

export const createBooking = async function(bookingData) {
  try {
    const res = await axios.post('${API_BASE}/api/bookings', bookingData, { 
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
    const res = await axios.get(`${API_BASE}/api/booking/${bookingId}`, { 
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
    const res = await axios.put(`${API_BASE}/api/booking/${bookingId}/status`, 
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
    const res = await axios.post('${API_BASE}/api/payments', paymentData, { 
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
    const res = await axios.post('${API_BASE}/api/ratings', ratingData, { 
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
    const res = await axios.get(`${API_BASE}/api/rating/booking/${bookingId}`, { 
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
    const res = await axios.get(`${API_BASE}/api/ratings/hotel/${hotelId}`, { 
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
    const res = await axios.get(`${API_BASE}/api/hotel/${hotelId}/average-rating`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting average rating:', err);
    throw err;
  }
};

export const getHotelBookings = async function(hotelId) {
  try {
    const res = await axios.get(`${API_BASE}/api/hotel/${hotelId}/bookings`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting hotel bookings:', err);
    throw err;
  }
};

export const createHotel = async function(hotelData) {
  try {
    const res = await axios.post('${API_BASE}/api/hotels', hotelData, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error creating hotel:', err);
    throw err;
  }
};

export const deleteHotel = async function(hotelId) {
  try {
    const res = await axios.delete(`${API_BASE}/api/hotels/${hotelId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error deleting hotel:', err);
    throw err;
  }
};

export const getHotelById = async function(hotelId) {
  try {
    const res = await axios.get(`${API_BASE}/api/hotels/${hotelId}`, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error getting hotel by ID:', err);
    throw err;
  }
};

export const updateHotel = async function(hotelId, hotelData) {
  try {
    const res = await axios.put(`${API_BASE}/api/hotels/${hotelId}`, hotelData, { 
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error('Error updating hotel:', err);
    throw err;
  }
};