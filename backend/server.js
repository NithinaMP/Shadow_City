
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECTION
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "shadow_city",
});

// INIT DB
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company VARCHAR(255),
        score INT,
        verdict VARCHAR(100),
        flags TEXT,
        analysis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Database Ready");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
}
initDB();

// AUDIT ROUTE
app.post('/api/audit', async (req, res) => {
  const { company, jobText } = req.body;

  if (!company || !jobText) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let detectedFlags = [];
    let score = 100;

    // 🔥 SIMPLE RULE ENGINE (ALWAYS WORKS)
    const redFlags = [
      "fast-paced",
      "family",
      "hustle",
      "multiple hats",
      "self-starter",
      "competitive salary"
    ];

    redFlags.forEach(word => {
      if (jobText.toLowerCase().includes(word)) {
        score -= 10;
        detectedFlags.push(word.toUpperCase());
      }
    });

    // 🤖 TRY AI (optional)
    try {
      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
          inputs: jobText,
          parameters: {
            candidate_labels: ["exploitation", "toxic culture", "pay secrecy"]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`
          }
        }
      );

      hfResponse.data.labels.forEach((label, i) => {
        if (hfResponse.data.scores[i] > 0.6) {
          detectedFlags.push(label.toUpperCase());
          score -= 10;
        }
      });

    } catch (aiErr) {
      console.log("⚠️ AI skipped");
    }

    const finalScore = Math.max(10, score);

    const verdict =
      finalScore > 80 ? "HIGHLY TRANSPARENT" :
      finalScore > 60 ? "MOSTLY FAIR" :
      finalScore > 40 ? "MIXED SIGNALS" :
      "HIGH RISK";

    const result = {
      score: finalScore,
      flags: detectedFlags.slice(0, 5),
      verdict,
      analysis: `${detectedFlags.length} risks detected for ${company}`
    };

    // SAVE TO DB
    await pool.query(
      "INSERT INTO audits (company, score, verdict, flags, analysis) VALUES (?, ?, ?, ?, ?)",
      [company, result.score, result.verdict, JSON.stringify(result.flags), result.analysis]
    );

    res.json(result);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DASHBOARD
app.get('/api/dashboard', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM audits ORDER BY created_at DESC LIMIT 20");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Dashboard error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// INTERVIEW QUESTIONS ROUTE
app.post('/api/questions', async (req, res) => {
  const { company, role, redFlags } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let questions = [];

    // 🔥 BASIC INTELLIGENT QUESTIONS (fallback)
    questions = [
      {
        question: `Can you describe a typical workday for a ${role} at ${company}?`,
        intent: "Reveals actual workload vs expectations"
      },
      {
        question: `How is performance measured for this role?`,
        intent: "Checks clarity in expectations"
      },
      {
        question: `What challenges did previous employees face in this role?`,
        intent: "Uncovers hidden problems"
      },
      {
        question: `How often do employees work beyond standard hours?`,
        intent: "Detects overwork culture"
      },
      {
        question: `Can you share the salary range for this position?`,
        intent: "Tests transparency"
      }
    ];

    // 🤖 OPTIONAL AI GENERATION
    try {
      const aiResponse = await axios.post(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
          inputs: `Generate 5 interview questions to expose hidden issues in a ${role} job at ${company}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`
          }
        }
      );

      if (aiResponse.data && aiResponse.data[0]?.generated_text) {
        const lines = aiResponse.data[0].generated_text.split("\n").filter(q => q.trim() !== "");

        questions = lines.slice(0, 5).map(q => ({
          question: q,
          intent: "AI-generated probe"
        }));
      }

    } catch (err) {
      console.log("⚠️ AI questions skipped");
    }

    res.json({ questions });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});