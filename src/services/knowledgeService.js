const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "../../knowledge");

// Cache for loaded documents
let knowledgeCache = null;

// Simple fuzzy match - checks if words are similar
function fuzzyMatch(word1, word2) {
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();

  if (word1 === word2) return true;
  if (word1.includes(word2) || word2.includes(word1)) return true;

  if (word1.length > 4 && word2.length > 4) {
    let matches = 0;
    const shorter = word1.length < word2.length ? word1 : word2;
    const longer = word1.length < word2.length ? word2 : word1;

    for (let char of shorter) {
      if (longer.includes(char)) matches++;
    }
    if (matches / shorter.length >= 0.7) return true;
  }

  return false;
}

// Common misspellings and synonyms
const synonyms = {
  order: ["ordr", "oderr", "ordor", "orders", "ordering"],
  create: [
    "cearte",
    "creat",
    "crate",
    "creation",
    "creating",
    "created",
  ],
  flow: ["flwo", "flo", "flows", "workflow"],
  status: ["staus", "statsu", "state", "states"],
  shipment: ["shipmnt", "shipping", "ship"],
  billing: ["biling", "bill", "invoice"],
  payment: ["paymnt", "pay", "payments"],
  customer: ["custmer", "client", "customers"],
  process: ["procss", "processing", "procedure"],
  architecture: ["architcture", "arch", "structure"],
  high: ["hgh", "hi"],
  level: ["lvl", "levl"],
  what: ["wht", "wat"],
  happens: ["happns", "happen"],
  when: ["whn", "wen"],
};

// Expand query with synonyms and fuzzy matches
function expandQuery(query) {
  if (!query || typeof query !== "string") return [];

  const words = query.toLowerCase().split(/\s+/);
  const expanded = new Set(words);

  words.forEach((word) => {
    for (const [key, values] of Object.entries(synonyms)) {
      if (values.includes(word) || fuzzyMatch(word, key)) {
        expanded.add(key);
      }
    }
  });

  return Array.from(expanded);
}

function loadKnowledgeBase() {
  // Return cached if available
  if (knowledgeCache) {
    return knowledgeCache;
  }

  const files = [];

  function readDir(dir) {
    if (!fs.existsSync(dir)) {
      console.log(`Knowledge directory not found: ${dir}`);
      return;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDir(fullPath);
      } else if (item.endsWith(".md") || item.endsWith(".txt")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        files.push({
          name: item,
          path: fullPath,
          content: content,
        });
        console.log(`📄 Loaded: ${item} (${content.length} chars)`);
      }
    }
  }

  console.log(`\n📂 Loading knowledge from: ${KNOWLEDGE_DIR}`);
  readDir(KNOWLEDGE_DIR);
  console.log(`✅ Total documents loaded: ${files.length}\n`);

  knowledgeCache = files;
  return files;
}

function searchKnowledge(query) {
  if (!query || typeof query !== "string") {
    return [];
  }

  const knowledgeFiles = loadKnowledgeBase();

  if (knowledgeFiles.length === 0) {
    console.log("⚠️ No knowledge files loaded!");
    return [];
  }

  const expandedTerms = expandQuery(query);
  console.log(`🔍 Search query: "${query}"`);
  console.log(`🔍 Expanded terms: ${expandedTerms.join(", ")}`);

  if (expandedTerms.length === 0) {
    return [];
  }

  const results = knowledgeFiles.map((file) => {
    const contentLower = file.content.toLowerCase();
    let score = 0;

    expandedTerms.forEach((term) => {
      const regex = new RegExp(term, "gi");
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    return { ...file, score };
  });

  const filtered = results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  console.log(`📊 Results found: ${filtered.length}`);
  filtered.forEach((r) => console.log(`   - ${r.name}: score ${r.score}`));

  return filtered;
}

module.exports = {
  loadKnowledgeBase,
  searchKnowledge,
};
