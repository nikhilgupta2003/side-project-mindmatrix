import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("volunteer.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    hours INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    volunteer_id INTEGER NOT NULL,
    opportunity_id INTEGER NOT NULL,
    status TEXT DEFAULT 'registered',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
  );
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM opportunities").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO opportunities (title, description, organization, date, location, category, image_url, hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedData = [
    ["Beach Cleanup Drive", "Join us for a morning of cleaning our local coastline. Gloves and bags provided.", "Ocean Guardians", "2026-03-15", "Sunset Beach", "Environment", "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800", 4],
    ["After-School Tutoring", "Help middle school students with math and science homework.", "Bright Minds NGO", "2026-03-20", "Community Library", "Education", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800", 2],
    ["Animal Shelter Support", "Walk dogs and help clean kennels at our local shelter.", "Happy Paws", "2026-03-18", "City Animal Shelter", "Animals", "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800", 3],
    ["Food Bank Distribution", "Sort and pack food boxes for families in need.", "Unity Food Bank", "2026-03-22", "Downtown Warehouse", "Community", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", 5],
    ["Senior Tech Workshop", "Teach seniors how to use smartphones and video call their families.", "Silver Connect", "2026-03-25", "Heritage Senior Home", "Education", "https://images.unsplash.com/photo-1516307364728-25b36c5f4002?auto=format&fit=crop&q=80&w=800", 2]
  ];

  seedData.forEach(data => insert.run(...data));

  // Seed a default volunteer
  db.prepare("INSERT OR IGNORE INTO volunteers (name, email) VALUES (?, ?)").run("Alex Student", "alex@example.com");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/opportunities", (req, res) => {
    const opportunities = db.prepare("SELECT * FROM opportunities ORDER BY date ASC").all();
    res.json(opportunities);
  });

  app.get("/api/opportunities/:id", (req, res) => {
    const opportunity = db.prepare("SELECT * FROM opportunities WHERE id = ?").get(req.params.id);
    if (!opportunity) return res.status(404).json({ error: "Not found" });
    res.json(opportunity);
  });

  app.post("/api/register", (req, res) => {
    const { volunteerId, opportunityId } = req.body;
    try {
      const result = db.prepare("INSERT INTO registrations (volunteer_id, opportunity_id) VALUES (?, ?)").run(volunteerId, opportunityId);
      res.json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Already registered or error" });
    }
  });

  app.get("/api/volunteer/:id/stats", (req, res) => {
    const stats = db.prepare(`
      SELECT 
        date(r.registered_at) as date, 
        SUM(o.hours) as hours 
      FROM registrations r
      JOIN opportunities o ON r.opportunity_id = o.id
      WHERE r.volunteer_id = ? AND r.status = 'completed'
      GROUP BY date(r.registered_at)
      ORDER BY date ASC
    `).all(req.params.id);
    res.json(stats);
  });

  app.get("/api/volunteer/:id/registrations", (req, res) => {
    const registrations = db.prepare(`
      SELECT r.*, o.title, o.date, o.location, o.hours
      FROM registrations r
      JOIN opportunities o ON r.opportunity_id = o.id
      WHERE r.volunteer_id = ?
      ORDER BY o.date ASC
    `).all(req.params.id);
    res.json(registrations);
  });

  // Mock completion for demo
  app.post("/api/registrations/:id/complete", (req, res) => {
    db.prepare("UPDATE registrations SET status = 'completed' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
