import axios from "axios";

export const assignUserBadges = async (userId) => {
  try {
    const response = await axios.post(`/api/users/${userId}/badges/assign`);
    return response.data.badges;
  } catch (error) {
    console.error("Error assigning badges:", error);
    return [];
  }
};
