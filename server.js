require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  let { url } = req.body;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const title = $("title").text();
    const meta = $('meta[name="description"]').attr("content");

    const headings = [];
    $("h1, h2").each((i, el) => {
      headings.push($(el).text());
    });

    const report = `
      <h2>Basic SEO Info</h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Meta:</strong> ${meta}</p>
      <p><strong>Headings:</strong> ${headings.join(", ")}</p>
    `;

    res.json({ report });

  } catch (err) {
    res.status(500).json({ error: "Error analyzing site" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});