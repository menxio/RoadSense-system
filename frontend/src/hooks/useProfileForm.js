import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import api from "@/utils/api";

export const useProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    plate_number: "",
    school_id: "",
    custom_id: "",
    avatarUrl: "",
    vehicle_color: "",
    vehicle_type: "",
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user.name]);

  useEffect(() => {
    if (user && user.name) {
      setProfile(user);
      setOriginalProfile(user);
    }
  }, [user]);

  useEffect(() => {
    const checkChanges = () => {
      if (avatarFile) return true;
      return (
        profile.name !== originalProfile.name ||
        profile.email !== originalProfile.email ||
        profile.phone_number !== originalProfile.phone_number ||
        profile.plate_number !== originalProfile.plate_number ||
        profile.vehicle_color !== originalProfile.vehicle_color ||
        profile.vehicle_type !== originalProfile.vehicle_type
      );
    };
    setHasChanges(checkChanges());
  }, [profile, originalProfile, avatarFile]);

  const validateField = useCallback((fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2)
          error = "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Please enter a valid email";
        break;
      case "phone_number":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\+?[0-9\-\s]{7,20}$/.test(value))
          error = "Please enter a valid phone number";
        break;
      case "plate_number":
        if (!value.trim()) error = "Plate number is required";
        else if (value.trim().length < 3)
          error = "Plate number must be at least 3 characters";
        break;
      case "vehicle_color":
        if (!value.trim()) error = "Vehicle color is required";
        break;
      case "vehicle_type":
        if (!value.trim()) error = "Vehicle type is required";
        break;
    }
    setFormErrors((prev) => ({ ...prev, [fieldName]: error }));
    return !error;
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [formErrors]
  );

  const handleFieldBlur = useCallback(
    (fieldName) => {
      setFieldTouched((prev) => ({ ...prev, [fieldName]: true }));
      validateField(fieldName, profile[fieldName]);
    },
    [profile, validateField]
  );

  const validateForm = useCallback(() => {
    const errors = {};
    const fields = [
      "name",
      "email",
      "phone_number",
      "plate_number",
      "vehicle_color",
      "vehicle_type",
    ];
    fields.forEach((field) => {
      if (!validateField(field, profile[field])) {
        errors[field] = formErrors[field];
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [profile, formErrors, validateField]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone_number", profile.phone_number);
      formData.append("plate_number", profile.plate_number);
      formData.append("vehicle_color", profile.vehicle_color);
      formData.append("vehicle_type", profile.vehicle_type);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      try {
        const response = await api.post(
          `/users/${profile.custom_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const updatedProfile = response.data.user || profile;
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        setAvatarFile(null);
        dispatch(fetchUserProfile());
        return { success: true, message: "Profile updated successfully!" };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update profile.",
        };
      } finally {
        setLoading(false);
      }
    },
    [profile, avatarFile, validateForm, dispatch]
  );

  const handleReset = useCallback(() => {
    setProfile({ ...originalProfile });
    setAvatarFile(null);
    setFormErrors({});
    setFieldTouched({});
    if (profile.avatarUrl !== originalProfile.avatarUrl) {
      URL.revokeObjectURL(profile.avatarUrl);
    }
  }, [originalProfile, profile.avatarUrl]);

  return {
    user,
    profile,
    setProfile,
    avatarFile,
    setAvatarFile,
    loading,
    formErrors,
    fieldTouched,
    hasChanges,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    handleReset,
    validateField,
  };
};
