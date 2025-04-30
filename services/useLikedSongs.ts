import axios from "axios";
import useFetch from "./useFetch"; // Assuming you have a custom hook to handle fetch logic
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

const useLikedSongs = () => {
  // Fetch liked songs by making an axios request with userId and token as params
  return useFetch(async (userId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/${userId}/liked-songs`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
        params: {
          limit: 10,  // Optional: Set limit for pagination
          offset: 0,  // Optional: Set offset for pagination
        },
      });
      return response.data; // Return the response data (liked songs)
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      throw error; // Re-throw error for handling elsewhere
    }
  });
};

export default useLikedSongs;
