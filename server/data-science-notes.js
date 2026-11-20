import { chapters } from "./exam-bank.js";

const unitPatterns = [
  [/data science process/i, /data science roles/i, /informed consent/i, /five cs/i],
  [/numpy/i, /data manipulation with pandas/i, /array creation/i, /data wrangling/i],
  [/visualization in python/i, /histograms?/i, /subplots?/i, /plotting functions with pandas/i],
  [/tableau/i, /pareto/i, /interactive dashboards?/i, /tree ?map/i],
];

function formatTopic([title, explanation, example, interpretation]) {
  return ["## " + title, explanation, "Worked example. " + example, interpretation].join("\n\n");
}

const normalize = title => title.trim().toLowerCase().replace(/\s+/g, " ");
const byTitle = new Map(chapters.flat().map(row => [normalize(row[0]), row]));

export function builtInNotes(topics) {
  const exact = topics.map(topic => byTitle.get(normalize(topic.title)));
  if (exact.length && exact.every(Boolean)) return [...new Set(exact)].map(formatTopic).join("\n\n");
  // Imported screenshots often combine several syllabus topics on one line.
  const text = topics.map(topic => topic.title).join(" ");
  const matching = chapters.filter((_, i) => unitPatterns[i].filter(pattern => pattern.test(text)).length >= 2);
  return matching.length === 1 ? matching[0].map(formatTopic).join("\n\n") : null;
}
