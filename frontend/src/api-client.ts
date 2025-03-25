import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.message || "Registration failed");
    }
    return responseBody; // ✅ Return response to handle in UI
  } catch (error) {
    console.error("Register error:", error);
    throw new Error("Network error during registration");
  }
};

export const signIn = async (formData: SignInFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "Sign in failed");
    }
    return body;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw new Error("Network error during sign-in");
  }
};

export const validateToken = async () => {
  try {
    const token = localStorage.getItem("authToken"); // ✅ Fetch token if stored
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // ✅ Ensure token is sent
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token validation failed");
    }
    return response.json();
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Failed to validate token");
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Sign out failed");
    }
    return { message: "Signed out successfully" }; // ✅ Return response
  } catch (error) {
    console.error("Sign-out error:", error);
    throw new Error("Network error during sign-out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }
  return response.json();
};
