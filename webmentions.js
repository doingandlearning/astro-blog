const WEBMENTION_API_KEY = "mMoMJ0H9rDm_zGUcm9iM1g";

import fs from "fs";
import https from "https";
import path from "node:path";

const DOMAIN = "www.kevincunningham.co.uk";

const webmentions = await fetchWebmentions();
webmentions.forEach(writeWebMention);

function fetchWebmentions() {
  const url =
    "https://webmention.io/api/mentions.jf2" +
    `?domain=${DOMAIN}` +
    `&token=${WEBMENTION_API_KEY}` +
    "&per-page=999";

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let body = "";

      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode !== 200) reject(body);
          resolve(response.children);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => reject(error));
  });
}

function writeWebMention(webmention) {
  // Each post will have its own webmentions json file, named after the slug
  const slug = webmention["wm-target"]
    .replace(`https://${DOMAIN}/`, "")
    .replace(/\/$/, "")
    .replaceAll("/", "--");
  const filename = `./src/content/webmentions/${slug || "home"}.json`;

  // Check if file with filename exists
  if (!fs.existsSync(filename)) {
    console.log(`Creating new webmentions file: ${filename}`);
    fs.writeFileSync(filename, JSON.stringify([webmention], null, 2));
    return;
  } else {
    // If the file already exists, append the new webmention while also deduping
    const entries = JSON.parse(fs.readFileSync(filename))
      .filter((wm) => wm["wm-id"] !== webmention["wm-id"])
      .concat([webmention]);
    entries.sort((a, b) => a["wm-id"] - b["wm-id"]);
    fs.writeFileSync(filename, JSON.stringify(entries, null, 2));
  }
}
