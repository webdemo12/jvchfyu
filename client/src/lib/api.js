import { queryClient } from "./queryClient";

export const api = {
  // Admin Auth
  async login(username, password) {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
    return response.json();
  },

  async logout() {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },

  async getMe() {
    const response = await fetch("/api/admin/me", {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Not authenticated");
    }
    return response.json();
  },

  async changePassword(currentPassword, newPassword) {
    const response = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Password change failed");
    }
    return response.json();
  },

  async forgotPassword(username) {
    const response = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    return response.json();
  },

  async resetPassword(resetToken, newPassword) {
    const response = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Password reset failed");
    }
    return response.json();
  },

  // Results
  async getTodayResults() {
    const response = await fetch("/api/results/today");
    return response.json();
  },

  async getResultsByDate(date) {
    const response = await fetch(`/api/results/date/${encodeURIComponent(date)}`);
    return response.json();
  },

  async getAllResults(limit = 30) {
    const response = await fetch(`/api/results/all?limit=${limit}`);
    return response.json();
  },

  async createResult(date, time, number, bottomNumber) {
    const response = await fetch("/api/admin/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time, number, bottomNumber }),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create result");
    }
    return response.json();
  },

  async updateResult(id, updates) {
    const response = await fetch(`/api/admin/results/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update result");
    }
    return response.json();
  },

  async deleteResult(id) {
    const response = await fetch(`/api/admin/results/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete result");
    }
    return response.json();
  },

  // Contact
  async submitContact(data) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit contact form");
    }
    return response.json();
  },

  async getContacts() {
    const response = await fetch("/api/admin/contacts", {
      credentials: "include",
    });
    return response.json();
  },

  // Init
  async initAdmin() {
    const response = await fetch("/api/admin/init", {
      method: "POST",
    });
    return response.json();
  },
};
