// Worked-example questions are eligible only when their evidence occurs in this chapter.
const examples = [
  ["If 120 books are borrowed and the forecast was 110, what is the absolute error?", "the absolute error is 10", "10 loans", "110 loans", "120 loans"],
  ["A model flags 30 of 40 truly late deliveries. What is its recall?", "30/40 = 75%", "75%", "30%", "40%"],
  ["Once 999 is identified as missing, what is the mean of the observed commute times?", "mean of 25 minutes for the three observed", "25 minutes", "27.5 minutes", "268.5 minutes"],
  ["Which group had the higher false-negative rate in the scholarship example?", "false-negative rates are 20% and 5%", "Group A", "Group B", "Both had the same rate"],
  ["In the bus-demand example, which tool joins tap-ins to scheduled trips?", "use SQL to join tap-ins to scheduled trips", "SQL", "pandas", "NumPy"],
  ["How much element storage do six int16 values occupy?", "element buffer uses 12 bytes", "12 bytes", "6 bytes", "48 bytes"],
  ["For np.arange(12).reshape(3,4), what is the value at index [1,2]?", "a[1,2] is 6", "6", "5", "9"],
  ["In the matrix example, which output gives one total per row?", "a.sum(axis=1) yields [6,15]", "[6,15]", "[5,7,9]", "[1,2,3]"],
  ["Why does student B receive the correct bonus even when the rows are reordered?", "B:85 because labels align", "pandas aligns the labels", "pandas pairs values by position", "pandas first averages both columns"],
  ["Which pandas dtype preserves leading zeros in student IDs?", 'dtype={"id":"string"}', "string", "integer", "floating point"],
  ["Which statistic compares incident risk when two departments have different numbers of users?", "plot rates on a common scale and label denominators", "Incidents per user", "Total incident count", "Number of users alone"],
  ["With Q1 = 10 and Q3 = 18, what is the upper fence under the 1.5 × IQR rule?", "18 + 1.5 × 8 = 30", "30", "18", "35"],
  ["Which Matplotlib setting keeps two subplot y-scales comparable?", "plt.subplots(1,2,sharey=True", "sharey=True", "marker=\"o\"", "layout=\"constrained\""],
  ["Which chart shows the distribution of individual wait times across numerical bins?", "A histogram shows equal counts", "Histogram", "Stacked area chart", "Pie chart"],
  ["Which region has the higher total sales in the pandas example?", "gives East 30 and West 20", "East", "West", "Both totals are equal"],
  ["For defect counts 40, 30, 20 and 10, which categories first cover at least 80%?", "at least 80% comprises A, B and C", "A, B and C", "A and B", "A alone"],
  ["If South-B contributes 80 out of 200 sales, what share of the treemap should it occupy?", "80/200 = 40%", "40%", "20%", "80%"],
  ["For monthly sales of 100, 150 and 120, when does the running total first exceed 200?", "first becomes true in month two", "Month two", "Month one", "Month three"],
  ["When the sales target rises to 140, which product still meets it?", "only C meets target", "C only", "B and C", "A and B"],
  ["A return rate rises from 2% to 3%. What is the relative increase?", "a 50% relative increase", "50%", "1%", "3%"],
];

function shuffled(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeQuiz(sections) {
  const passages = sections.map(section => {
    const lines = section.trim().split(/\n/);
    const title = lines[0].match(/^#{1,6}\s+(.+)/)?.[1];
    const paragraphs = (title ? lines.slice(1) : lines).map(s => s.trim()).filter(Boolean);
    return { title: title || "Unit notes", paragraphs };
  }).filter(p => p.paragraphs.length);
  const questions = [];
  const used = new Set();
  for (const [prompt, clue, answer, ...others] of shuffled(examples)) {
    for (const p of passages) {
      const evidence = p.paragraphs.find(line => line.includes(clue));
      if (!evidence || used.has(p.title)) continue;
      used.add(p.title);
      questions.push({ prompt, answer, options: shuffled([answer, ...others]), evidence, title: p.title });
      break;
    }
  }
  const titles = [...new Set(passages.map(p => p.title))];
  for (const p of shuffled(passages)) {
    if (questions.length >= 5 || used.has(p.title)) continue;
    const evidence = p.paragraphs.find(line => line.length >= 24 && !line.startsWith("```")) || p.paragraphs[0];
    const others = shuffled(titles.filter(t => t !== p.title));
    if (others.length) {
      questions.push({ prompt: "Under which topic do your notes explain this passage?", excerpt: evidence,
        answer: p.title, options: shuffled([p.title, ...others.slice(0, 3)]), evidence, title: p.title });
    } else {
      // A short, single-section upload can still support recall without inventing distractors.
      for (const line of p.paragraphs.slice(0, 5)) {
        const token = line.match(/[\p{L}\p{N}][\p{L}\p{N}-]{2,}/gu)?.sort((a,b) => b.length - a.length)[0];
        if (token) questions.push({ prompt: "Fill in the missing term from your notes.", excerpt: line.replaceAll(token, "_____"),
          answer: token, evidence: line, title: p.title });
      }
    }
    used.add(p.title);
  }
  return questions.slice(0, 5);
}
