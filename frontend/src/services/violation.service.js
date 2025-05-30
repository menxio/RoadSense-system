import api from "@/utils/api";

export const getViolations = async () => {
  try {
    const response = await api.get("/violations");
    return response.data;
  } catch (error) {
    console.error("Error fetching violations:", error);
    throw error;
  }
};

export const getViolationById = async (id) => {
  try {
    const response = await api.get(`/violations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching violation with ID ${id}:`, error);
    throw error;
  }
};

export const updateViolation = async (id, data) => {
  try {
    const response = await api.post(`/violations/${id}?_method=PUT`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating violation:", error);
    throw error;
  }
};

export const submitViolationAppeal = async (formData) => {
  try {
    const response = await api.post("/violations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting violation appeal:", error);
    throw error;
  }
};
