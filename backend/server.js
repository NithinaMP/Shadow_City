
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB CONNECTION
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "shadow_city",
// });

// // INIT DB
// async function initDB() {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS audits (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         company VARCHAR(255),
//         score INT,
//         verdict VARCHAR(100),
//         flags TEXT,
//         analysis TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);
//     console.log("✅ Database Ready");
//   } catch (err) {
//     console.error("❌ DB ERROR:", err.message);
//   }
// }
// initDB();

// // AUDIT ROUTE
// app.post('/api/audit', async (req, res) => {
//   const { company, jobText } = req.body;

//   if (!company || !jobText) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   try {
//     let detectedFlags = [];
//     let score = 100;

//     // 🔥 SIMPLE RULE ENGINE (ALWAYS WORKS)
//     const redFlags = [
//       "fast-paced",
//       "family",
//       "hustle",
//       "multiple hats",
//       "self-starter",
//       "competitive salary"
//     ];

//     redFlags.forEach(word => {
//       if (jobText.toLowerCase().includes(word)) {
//         score -= 10;
//         detectedFlags.push(word.toUpperCase());
//       }
//     });

//     // 🤖 TRY AI (optional)
//     try {
//       const hfResponse = await axios.post(
//         "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
//         {
//           inputs: jobText,
//           parameters: {
//             candidate_labels: ["exploitation", "toxic culture", "pay secrecy"]
//           }
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HF_TOKEN}`
//           }
//         }
//       );

//       hfResponse.data.labels.forEach((label, i) => {
//         if (hfResponse.data.scores[i] > 0.6) {
//           detectedFlags.push(label.toUpperCase());
//           score -= 10;
//         }
//       });

//     } catch (aiErr) {
//       console.log("⚠️ AI skipped");
//     }

//     const finalScore = Math.max(10, score);

//     const verdict =
//       finalScore > 80 ? "HIGHLY TRANSPARENT" :
//       finalScore > 60 ? "MOSTLY FAIR" :
//       finalScore > 40 ? "MIXED SIGNALS" :
//       "HIGH RISK";

//     const result = {
//       score: finalScore,
//       flags: detectedFlags.slice(0, 5),
//       verdict,
//       analysis: `${detectedFlags.length} risks detected for ${company}`
//     };

//     // SAVE TO DB
//     await pool.query(
//       "INSERT INTO audits (company, score, verdict, flags, analysis) VALUES (?, ?, ?, ?, ?)",
//       [company, result.score, result.verdict, JSON.stringify(result.flags), result.analysis]
//     );

//     res.json(result);

//   } catch (err) {
//     console.error("❌ ERROR:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DASHBOARD
// app.get('/api/dashboard', async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM audits ORDER BY created_at DESC LIMIT 20");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: "Dashboard error" });
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// // INTERVIEW QUESTIONS ROUTE
// app.post('/api/questions', async (req, res) => {
//   const { company, role, redFlags } = req.body;

//   if (!company || !role) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   try {
//     let questions = [];

//     // 🔥 BASIC INTELLIGENT QUESTIONS (fallback)
//     questions = [
//       {
//         question: `Can you describe a typical workday for a ${role} at ${company}?`,
//         intent: "Reveals actual workload vs expectations"
//       },
//       {
//         question: `How is performance measured for this role?`,
//         intent: "Checks clarity in expectations"
//       },
//       {
//         question: `What challenges did previous employees face in this role?`,
//         intent: "Uncovers hidden problems"
//       },
//       {
//         question: `How often do employees work beyond standard hours?`,
//         intent: "Detects overwork culture"
//       },
//       {
//         question: `Can you share the salary range for this position?`,
//         intent: "Tests transparency"
//       }
//     ];

//     // 🤖 OPTIONAL AI GENERATION
//     try {
//       const aiResponse = await axios.post(
//         "https://api-inference.huggingface.co/models/google/flan-t5-base",
//         {
//           inputs: `Generate 5 interview questions to expose hidden issues in a ${role} job at ${company}`
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HF_TOKEN}`
//           }
//         }
//       );

//       if (aiResponse.data && aiResponse.data[0]?.generated_text) {
//         const lines = aiResponse.data[0].generated_text.split("\n").filter(q => q.trim() !== "");

//         questions = lines.slice(0, 5).map(q => ({
//           question: q,
//           intent: "AI-generated probe"
//         }));
//       }

//     } catch (err) {
//       console.log("⚠️ AI questions skipped");
//     }

//     res.json({ questions });

//   } catch (err) {
//     console.error("❌ ERROR:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB CONNECTION
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "shadow_city",
// });

// // INIT DB
// async function initDB() {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS audits (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         company VARCHAR(255),
//         score INT,
//         verdict VARCHAR(100),
//         flags TEXT,
//         analysis TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);
//     console.log("✅ Database Ready");
//   } catch (err) {
//     console.error("❌ DB ERROR:", err.message);
//   }
// }
// initDB();

// // AUDIT ROUTE
// app.post('/api/audit', async (req, res) => {
//   const { company, jobText } = req.body;

//   if (!company || !jobText) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   try {
//     let detectedFlags = [];
//     let score = 100;

//     // 🔥 SIMPLE RULE ENGINE (ALWAYS WORKS)
//     const redFlags = [
//       "fast-paced",
//       "family",
//       "hustle",
//       "multiple hats",
//       "self-starter",
//       "competitive salary"
//     ];

//     redFlags.forEach(word => {
//       if (jobText.toLowerCase().includes(word)) {
//         score -= 10;
//         detectedFlags.push(word.toUpperCase());
//       }
//     });

//     // 🤖 TRY AI (optional)
//     try {
//       const hfResponse = await axios.post(
//         "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
//         {
//           inputs: jobText,
//           parameters: {
//             candidate_labels: ["exploitation", "toxic culture", "pay secrecy"]
//           }
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HF_TOKEN}`
//           }
//         }
//       );

//       hfResponse.data.labels.forEach((label, i) => {
//         if (hfResponse.data.scores[i] > 0.6) {
//           detectedFlags.push(label.toUpperCase());
//           score -= 10;
//         }
//       });

//     } catch (aiErr) {
//       console.log("⚠️ AI skipped");
//     }

//     const finalScore = Math.max(10, score);

//     const verdict =
//       finalScore > 80 ? "HIGHLY TRANSPARENT" :
//       finalScore > 60 ? "MOSTLY FAIR" :
//       finalScore > 40 ? "MIXED SIGNALS" :
//       "HIGH RISK";

//     const result = {
//       score: finalScore,
//       flags: detectedFlags.slice(0, 5),
//       verdict,
//       analysis: `${detectedFlags.length} risks detected for ${company}`
//     };

//     // SAVE TO DB
//     await pool.query(
//       "INSERT INTO audits (company, score, verdict, flags, analysis) VALUES (?, ?, ?, ?, ?)",
//       [company, result.score, result.verdict, JSON.stringify(result.flags), result.analysis]
//     );

//     res.json(result);

//   } catch (err) {
//     console.error("❌ ERROR:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ QUESTIONS ROUTE — THIS WAS MISSING
// app.post('/api/questions', async (req, res) => {
//   const { company, role, flags } = req.body;

//   if (!company || !role) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   try {
//     // 🔥 RULE-BASED TRAP QUESTIONS (ALWAYS WORKS)
//     const baseQuestions = [
//       {
//         question: `Can you describe what a typical day looks like for someone in the ${role} role at ${company}?`,
//         why: "Reveals if the role scope matches the job description or is much broader."
//       },
//       {
//         question: `How does ${company} measure success for this ${role} position in the first 90 days?`,
//         why: "Exposes whether expectations are realistic or vague and impossible to meet."
//       },
//       {
//         question: `What is the salary range budgeted for this ${role} position?`,
//         why: "Directly confronts pay secrecy — a company that won't answer is hiding something."
//       },
//       {
//         question: `Can you tell me about the team I'd be working with and how workload is distributed?`,
//         why: "Uncovers if one person is expected to do the work of three — the real multiple hats trap."
//       },
//       {
//         question: `What is the average tenure of people who have held this ${role} role at ${company}?`,
//         why: "High turnover is the single biggest signal of a toxic environment."
//       },
//     ];

//     // 🤖 TRY TO ENHANCE WITH HF AI (optional)
//     try {
//       const prompt = flags
//         ? `Company: ${company}, Role: ${role}, Red flags noticed: ${flags}`
//         : `Company: ${company}, Role: ${role}`;

//       const hfResponse = await axios.post(
//         "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
//         {
//           inputs: prompt,
//           parameters: {
//             candidate_labels: ["overwork", "pay secrecy", "toxic culture", "role ambiguity", "job insecurity"]
//           }
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HF_TOKEN}`
//           }
//         }
//       );

//       // If AI detects specific risks, swap in a targeted question
//       const topLabel = hfResponse.data.labels[0];
//       const topScore = hfResponse.data.scores[0];

//       if (topScore > 0.5) {
//         if (topLabel === "overwork") {
//           baseQuestions[1] = {
//             question: `What does work-life balance look like at ${company} — are there expectations to be available outside standard hours?`,
//             why: "Directly exposes overwork culture that hides behind flexible hours language."
//           };
//         } else if (topLabel === "pay secrecy") {
//           baseQuestions[2] = {
//             question: `Is the compensation for this ${role} role fixed or does it include variable components, and what is the total package range?`,
//             why: "Forces transparency on pay structure that vague postings deliberately obscure."
//           };
//         } else if (topLabel === "role ambiguity") {
//           baseQuestions[0] = {
//             question: `Can you show me the KPIs or OKRs this ${role} position will be evaluated against?`,
//             why: "Vague roles collapse under measurable metric questions — reveals true scope."
//           };
//         }
//       }

//       console.log("✅ AI enhanced questions");
//     } catch (aiErr) {
//       console.log("⚠️ AI skipped for questions — using rule-based");
//     }

//     res.json(baseQuestions);

//   } catch (err) {
//     console.error("❌ QUESTIONS ERROR:", err.message);
//     res.status(500).json({ error: "Failed to generate questions" });
//   }
// });

// // DASHBOARD
// app.get('/api/dashboard', async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM audits ORDER BY created_at DESC LIMIT 20");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: "Dashboard error" });
//   }
// });

// const PORT = process.env.PORT || 5000;

// const path = require("path");

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "shadow_city",
});

// ================= INIT DB =================
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

// ================= AUDIT ROUTE =================
app.post('/api/audit', async (req, res) => {
  const { company, jobText } = req.body;

  if (!company || !jobText) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let detectedFlags = [];
    let score = 100;

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

    // OPTIONAL AI
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

    } catch (err) {
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

// ================= QUESTIONS ROUTE =================
app.post('/api/questions', async (req, res) => {
  const { company, role } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const questions = [
      {
        question: `Can you describe a typical workday for a ${role} at ${company}?`,
        why: "Reveals actual workload vs expectations"
      },
      {
        question: `How is performance measured for this role?`,
        why: "Checks clarity in expectations"
      },
      {
        question: `What challenges did previous employees face in this role?`,
        why: "Uncovers hidden problems"
      },
      {
        question: `How often do employees work beyond standard hours?`,
        why: "Detects overwork culture"
      },
      {
        question: `Can you share the salary range for this position?`,
        why: "Tests transparency"
      }
    ];

    res.json(questions);

  } catch (err) {
    console.error("❌ QUESTIONS ERROR:", err.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// ================= DASHBOARD =================
app.get('/api/dashboard', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM audits ORDER BY created_at DESC LIMIT 20"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Dashboard error" });
  }
});

// ================= SERVE FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});