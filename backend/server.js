// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// // Run this once to create tables
// async function initDB() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS audits (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       company VARCHAR(255),
//       score INT,
//       verdict VARCHAR(100),
//       flags TEXT,
//       analysis TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `);
//   console.log('DB ready');
// }
// initDB();

// // AUDIT ROUTE
// app.post('/api/audit', async (req, res) => {
//   const { company, jobText } = req.body;
//   if (!company || !jobText) return res.status(400).json({ error: 'Missing fields' });

//   try {
//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': process.env.ANTHROPIC_API_KEY,
//         'anthropic-version': '2023-06-01',
//       },
//       body: JSON.stringify({
//         model: 'claude-opus-4-5',
//         max_tokens: 1024,
//         messages: [{
//           role: 'user',
//           content: `You are an expert corporate culture analyst. Analyze this job description for "${company}" and respond ONLY with a JSON object, no markdown, no explanation.

// JOB DESCRIPTION:
// ${jobText}

// Respond with exactly:
// {"score":<0-100>,"flags":[<up to 6 red flag strings>],"verdict":"<HIGHLY TRANSPARENT|MOSTLY FAIR|MIXED SIGNALS|CONCERNING|HIGH RISK>","analysis":"<2-3 sentences>","confidence":"<HIGH|MEDIUM|LOW>"}

// Scoring: Start 100. Subtract 15 each for: fast-paced, wear multiple hats, like a family, competitive salary with no number, hustle, self-starter. Subtract 10 for vague scope or missing salary. Add 10 for explicit salary range. Clamp 0-100.`
//         }]
//       })
//     });

//     const data = await response.json();
//     const text = data.content[0].text.replace(/```json|```/g, '').trim();
//     const result = JSON.parse(text);

//     await pool.query(
//       'INSERT INTO audits (company, score, verdict, flags, analysis) VALUES (?, ?, ?, ?, ?)',
//       [company, result.score, result.verdict, JSON.stringify(result.flags), result.analysis]
//     );

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Audit failed' });
//   }
// });

// // INTERVIEW QUESTIONS ROUTE
// app.post('/api/questions', async (req, res) => {
//   const { company, role, flags } = req.body;
//   if (!company || !role) return res.status(400).json({ error: 'Missing fields' });

//   try {
//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': process.env.ANTHROPIC_API_KEY,
//         'anthropic-version': '2023-06-01',
//       },
//       body: JSON.stringify({
//         model: 'claude-opus-4-5',
//         max_tokens: 1024,
//         messages: [{
//           role: 'user',
//           content: `Generate 5 trap interview questions for a candidate interviewing at "${company}" for "${role}". ${flags ? `Red flags noticed: ${flags}` : ''}
// Respond ONLY with a JSON array, no markdown:
// [{"question":"<question>","why":"<one sentence: what truth this reveals>"}]`
//         }]
//       })
//     });

//     const data = await response.json();
//     const text = data.content[0].text.replace(/```json|```/g, '').trim();
//     res.json(JSON.parse(text));
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to generate questions' });
//   }
// });

// // DASHBOARD ROUTE
// app.get('/api/dashboard', async (req, res) => {
//   const [rows] = await pool.query('SELECT * FROM audits ORDER BY created_at DESC LIMIT 20');
//   res.json(rows);
// });

// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const axios = require('axios'); // Using axios for cleaner HF calls
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// // Initialize Database Table
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
//     console.log('// SYSTEM_READY: Database Synced');
//   } catch (err) {
//     console.error('// DB_ERROR:', err);
//   }
// }
// initDB();

// /**
//  * 🔍 AUDIT ROUTE
//  * Uses: facebook/bart-large-mnli (Zero-Shot Classification)
//  */
// app.post('/api/audit', async (req, res) => {
//   const { company, jobText } = req.body;
//   if (!company || !jobText) return res.status(400).json({ error: 'Missing Fields' });

//   try {
//     // 1. Call Hugging Face for Semantic Analysis
//     const hfResponse = await axios.post(
//       'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
//       {
//         inputs: jobText,
//         parameters: { 
//           candidate_labels: ["exploitation", "toxic culture", "pay secrecy", "role ambiguity", "overwork"] 
//         }
//       },
//       { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
//     );

//     const aiData = hfResponse.data;
    
//     // 2. Advanced Scoring Logic
//     let score = 100;
//     const detectedFlags = [];

//     // Deduct based on AI confidence
//     aiData.labels.forEach((label, index) => {
//       const confidence = aiData.scores[index];
//       if (confidence > 0.6) {
//         score -= 15;
//         detectedFlags.push(label.toUpperCase().replace('_', ' '));
//       }
//     });

//     // Hardcoded "Cringe" Keyword Check (Safety Net)
//     const redFlagKeywords = ["fast-paced", "family", "hustle", "multiple hats", "self-starter", "competitive salary"];
//     redFlagKeywords.forEach(word => {
//       if (jobText.toLowerCase().includes(word)) {
//         score -= 5;
//         if (!detectedFlags.includes(word.toUpperCase())) detectedFlags.push(word.toUpperCase());
//       }
//     });

//     // 3. Finalize Results
//     const finalScore = Math.max(5, Math.min(100, score));
//     const verdict = finalScore >= 80 ? "HIGHLY TRANSPARENT" : finalScore >= 60 ? "MOSTLY FAIR" : finalScore >= 40 ? "MIXED SIGNALS" : "HIGH RISK";
//     const analysis = `The AI detected ${detectedFlags.length} semantic risk factors. The workplace narrative at ${company} suggests a ${verdict.toLowerCase()} environment.`;

//     const result = {
//       score: finalScore,
//       flags: detectedFlags.slice(0, 6),
//       verdict: verdict,
//       analysis: analysis,
//       confidence: "HIGH"
//     };

//     // 4. Save to MySQL
//     await pool.query(
//       'INSERT INTO audits (company, score, verdict, flags, analysis) VALUES (?, ?, ?, ?, ?)',
//       [company, result.score, result.verdict, JSON.stringify(result.flags), result.analysis]
//     );

//     res.json(result);

//   } catch (err) {
//     console.error('// AUDIT_FAIL:', err.message);
//     res.status(500).json({ error: 'Audit Failed: AI Engine Timeout' });
//   }
// });

// /**
//  * 🤖 INTERVIEW QUESTIONS ROUTE
//  * Uses: mistralai/Mistral-7B-Instruct-v0.3 (Text Generation)
//  */
// app.post('/api/questions', async (req, res) => {
//   const { company, role, flags } = req.body;
//   if (!company || !role) return res.status(400).json({ error: 'Missing Data' });

//   try {
//     const prompt = `[INST] You are a career auditor. Generate 5 "trap" interview questions for a ${role} position at ${company}. Base them on these red flags: ${flags || 'general lack of transparency'}. 
//     Respond ONLY with a JSON array of objects with "question" and "why" keys. No intro. [/INST]`;

//     const hfResponse = await axios.post(
//       'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
//       { inputs: prompt },
//       { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
//     );

//     // Clean the AI output to ensure it's valid JSON
//     const rawText = hfResponse.data[0].generated_text;
//     const jsonPart = rawText.substring(rawText.lastIndexOf("["), rawText.lastIndexOf("]") + 1);
    
//     res.json(JSON.parse(jsonPart));

//   } catch (err) {
//     // Fallback if the LLM is slow during the hackathon
//     const fallback = [
//       { question: `Can you define what 'fast-paced' means for this specific ${role} role?`, why: "Exposes potential for unpaid overtime." },
//       { question: `Why isn't the salary range for this position listed publicly?`, why: "Tests the company's commitment to pay equity." }
//     ];
//     res.json(fallback);
//   }
// });

// /**
//  * 📊 DASHBOARD ROUTE
//  */
// app.get('/api/dashboard', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM audits ORDER BY created_at DESC LIMIT 20');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Dashboard Data Unavailable' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`// SHADOW_CITY_SERVER: Running on Port ${PORT}`));
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