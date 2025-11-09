import { createServer } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { storage } from "./storage.js";

const JWT_SECRET = process.env.SESSION_SECRET || "tiger-satta-secret-key";

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app) {
  // Admin Authentication Routes
  app.post(
    "/api/admin/login",
    [
      body("username").notEmpty().trim(),
      body("password").notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { username, password } = req.body;
        const admin = await storage.getAdminByUsername(username);

        if (!admin) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: admin.id, username: admin.username },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
          success: true,
          admin: { id: admin.id, username: admin.username },
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("adminToken");
    res.json({ success: true });
  });

  app.get("/api/admin/me", authenticateToken, (req, res) => {
    res.json({ admin: req.user });
  });

  app.post(
    "/api/admin/change-password",
    [
      authenticateToken,
      body("currentPassword").notEmpty(),
      body("newPassword").isLength({ min: 6 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { currentPassword, newPassword } = req.body;
        const admin = await storage.getAdminByUsername(req.user.username);

        const validPassword = await bcrypt.compare(currentPassword, admin.password);
        if (!validPassword) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await storage.updateAdminPassword(req.user.username, hashedPassword);

        res.json({ success: true, message: "Password changed successfully" });
      } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.post(
    "/api/admin/forgot-password",
    [body("username").notEmpty().trim()],
    async (req, res) => {
      try {
        const { username } = req.body;
        const admin = await storage.getAdminByUsername(username);

        if (!admin) {
          return res.json({ success: true, message: "If the username exists, a reset token has been generated" });
        }

        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await storage.setResetToken(username, resetToken, expiry);

        res.json({
          success: true,
          message: "Reset token generated",
          resetToken: resetToken,
        });
      } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.post(
    "/api/admin/reset-password",
    [
      body("resetToken").notEmpty(),
      body("newPassword").isLength({ min: 6 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { resetToken, newPassword } = req.body;
        const admin = await storage.getAdminByResetToken(resetToken);

        if (!admin || !admin.resetTokenExpiry || new Date() > new Date(admin.resetTokenExpiry)) {
          return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await storage.updateAdminPassword(admin.username, hashedPassword);
        await storage.clearResetToken(admin.username);

        res.json({ success: true, message: "Password reset successfully" });
      } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  // Game Results Routes
  app.get("/api/results/today", async (req, res) => {
    try {
      const results = await storage.getTodayResults();
      res.json(results);
    } catch (error) {
      console.error("Get today results error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/results/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const results = await storage.getResultsByDate(date);
      res.json(results);
    } catch (error) {
      console.error("Get results by date error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/results/all", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const results = await storage.getAllResults(limit);

      // Group by date
      const groupedResults = {};
      results.forEach(result => {
        if (!groupedResults[result.date]) {
          groupedResults[result.date] = [];
        }
        groupedResults[result.date].push(result);
      });

      res.json(groupedResults);
    } catch (error) {
      console.error("Get all results error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post(
    "/api/admin/results",
    [
      authenticateToken,
      body("date").notEmpty(),
      body("time").notEmpty(),
      body("number").notEmpty().isLength({ min: 1, max: 4 }),
      body("bottomNumber").optional().isLength({ min: 1, max: 4 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { date, time, number, bottomNumber } = req.body;
        const result = await storage.createGameResult({ date, time, number, bottomNumber });
        res.json(result);
      } catch (error) {
        console.error("Create result error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.put(
    "/api/admin/results/:id",
    [
      authenticateToken,
      body("date").optional().notEmpty(),
      body("time").optional().notEmpty(),
      body("number").optional().isLength({ min: 1, max: 4 }),
      body("bottomNumber").optional().isLength({ min: 1, max: 4 }),
    ],
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = {};
        if (req.body.date) updates.date = req.body.date;
        if (req.body.time) updates.time = req.body.time;
        if (req.body.number) updates.number = req.body.number;
        if (req.body.bottomNumber !== undefined) updates.bottomNumber = req.body.bottomNumber;

        const result = await storage.updateGameResult(id, updates);
        res.json(result);
      } catch (error) {
        console.error("Update result error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.delete("/api/admin/results/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGameResult(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete result error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Contact Submissions Routes
  app.post(
    "/api/contact",
    [
      body("name").notEmpty().trim(),
      body("phone").notEmpty().trim(),
      body("email").optional().isEmail(),
      body("message").notEmpty().trim(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { name, phone, email, message } = req.body;
        const submission = await storage.createContactSubmission({
          name,
          phone,
          email: email || null,
          message,
        });
        res.json(submission);
      } catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  app.get("/api/admin/contacts", authenticateToken, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Initialize default admin if none exists
  app.post("/api/admin/init", async (req, res) => {
    try {
      const existingAdmin = await storage.getAdminByUsername("bigdealadmin");
      if (existingAdmin) {
        return res.json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await storage.createAdmin({
        username: "bigdealadmin",
        password: hashedPassword,
      });

      res.json({
        success: true,
        message: "Default admin created",
        credentials: { username: "bigdealadmin", password: "admin123" },
      });
    } catch (error) {
      console.error("Init admin error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
