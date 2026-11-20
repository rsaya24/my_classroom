const entries = [
  [
    "Data Science overview and evolution",
    "How did data science evolve, and how does it turn observations into decisions?",
    "Data science combines statistical inference, computing and knowledge of the application domain. Statistical sampling made it possible to estimate quantities for a population. Databases made large collections searchable. Machine learning added ways to predict outcomes from many variables. These methods coexist: a prediction still needs a well-defined population and a meaningful evaluation.",
    "A library first counts monthly loans to describe demand, then investigates why exam-month demand rises. To forecast next month, it trains on earlier months and tests on later ones. If actual demand is 120 loans and the prediction is 110, the absolute error is 10. Compare that error with simply predicting last month's count before adopting the model.",
    "A more accurate forecast matters only if it changes a decision, such as how many copies to order. Exam-month correlation alone cannot establish that exams caused the increase."
  ],
  [
    "Data Science roles, tools and applications",
    "Explain how the roles and tools in a data science team fit together in one application.",
    "A domain specialist defines the decision and what errors cost. A data engineer retrieves and validates records. An analyst describes patterns and checks definitions. A scientist constructs features, trains models and evaluates generalization. An operations engineer deploys the selected method and monitors performance. Each handoff needs an agreed input, output and quality check.",
    "For a bus-demand forecast, use SQL to join tap-ins to scheduled trips, pandas to align dates, and NumPy to calculate errors. Compare a model against last week's passenger count on held-out weeks. Give dispatchers a chart showing expected loads and uncertainty for each route.",
    "Check coverage before changing service: missing tap-ins on one route can make genuine demand appear low. Monitoring the data pipeline is as important as evaluating the forecasting algorithm."
  ],
  [
    "Data Science process overview",
    "Trace a data science project from problem definition to presentation.",
    "Start with a decision and a measurable success criterion. Retrieve representative observations, document their origin, and clean units, keys and missing values. Explore distributions and relationships. Set aside test observations before fitting transformations, compare a model with a baseline, and communicate what action the evidence supports.",
    "To predict delivery delays, define delay as arrival over 15 minutes late. Use order-time features and train on earlier deliveries. Among 40 truly late test orders, detecting 30 gives recall 30/40 = 75%. Also count false alarms because sending extra staff has a cost.",
    "The process is iterative. If one depot has almost no timestamps, investigate collection before adding a more complex model. A diagram can show the feedback arrow from evaluation to preparation."
  ],
  [
    "Defining goals and retrieving data",
    "How would you translate a business question into a retrieval plan?",
    "Specify the decision maker, unit of observation, target, prediction time and evaluation metric. Turn each requirement into fields, sources, keys and a date range. Collect only necessary fields and record the extraction date and query so the dataset can be reproduced.",
    "For predicting next-week absences, one row represents one student-week. Count attendance recorded up to Friday and label whether an absence occurs the following week. Join the timetable by student and week. Check that each join preserves the expected row count and that weekends are excluded consistently.",
    "Including a teacher's end-of-term absence summary leaks future information. A large dataset can still answer the wrong question when its timestamps or population disagree with the stated goal."
  ],
  [
    "Data preparation and exploration",
    "Explain how preparation and exploratory analysis influence one another.",
    "Preparation changes records into a consistent analytical table. Exploration examines their distributions and relationships. Inspect types, units, duplicates and missingness before choosing a correction. After cleaning, repeat summaries to see whether the intervention changed the pattern. Fit imputations using training data when building a predictive model.",
    "Suppose commute times are 20, 25, 30 and 999 minutes. Their mean is 268.5, while the median is 27.5. A histogram and source documentation might reveal that 999 means missing. Recoding it produces a mean of 25 minutes for the three observed trips. Report that one of four records lacked a valid time.",
    "An unusual value can be a genuine long journey. Removing it just because it changes the mean can suppress the very phenomenon under investigation."
  ],
  [
    "Data modeling and presentation",
    "How would you evaluate and present a predictive model to a decision maker?",
    "Choose a target and a baseline. Split according to how predictions will be used, fit on training data, tune on validation data and evaluate on a held-out set. Choose a metric whose units or costs are meaningful. Inspect errors across groups and periods before recommending action.",
    "For weekly demand of 20, 30 and 40 orders, predictions of 22, 27 and 35 have absolute errors 2, 3 and 5. Mean absolute error is 10/3, about 3.33 orders. A baseline with errors 4, 4 and 4 averages 4 orders. Show actual and predicted counts on the same time axis and identify where the largest miss occurred.",
    "Three weeks give weak evidence for a lasting improvement. Present the evaluation window, uncertainty and a monitoring plan alongside the average."
  ],
  [
    "Data Science ethics and doing good Data Science",
    "Evaluate the ethical risks throughout a data science project.",
    "Identify who benefits, who may be harmed and who can challenge a decision. At collection, justify the purpose and minimize fields. During modeling, examine representation, proxy variables and subgroup errors. At deployment, explain intended use, monitor harm and provide a correction process.",
    "A scholarship screening system misses 4 of 20 eligible applicants from group A and 2 of 40 from group B. The false-negative rates are 20% and 5%. Overall accuracy hides that disparity. Audit labels and missing documents, then evaluate revised procedures and the cost of manual review.",
    "An observed difference warrants investigation. It does not by itself establish the cause. Good practice links each safeguard to a concrete decision and a person responsible for acting on it."
  ],
  [
    "Data ownership and aspects of privacy",
    "Explain why control of a dataset and protection of privacy require separate decisions.",
    "Distinguish the people described, the collector, the custodian and the parties authorized to reuse the records. Document who can access, correct, share and delete data. Privacy concerns what others can infer about a person, even when a name is removed. Limit collection, linkability, access and retention.",
    "A college shares commute records without names. A rare combination of home locality, arrival time and course could still identify a student. Aggregate arrival times into hourly groups, suppress very small groups and share only the summary needed for bus planning.",
    "Aggregation reduces detail and may make infrequent routes harder to plan. Explain that trade-off, and evaluate re-identification risk when the release can be linked to another dataset."
  ],
  [
    "Getting informed consent",
    "Design an informed-consent process for a student learning study.",
    "Consent is a voluntary, informed choice for a defined purpose. Explain in accessible language what is collected, why, who may use it, how long it is retained and how participants can ask questions or withdraw. Separate optional research participation from access to normal teaching.",
    "For a study of quiz habits, show an example event record and explain whether staff will see individual or aggregate results. Offer separate choices for this study and later reuse. Record the notice version and decision. If the team later wants to train a commercial product, revisit the original scope.",
    "A checkbox alone cannot establish understanding or freedom of choice. Explain any practical limits on withdrawal, such as results already published in aggregate, before a participant decides."
  ],
  [
    "The Five Cs of Data Science",
    "Use the Five Cs of data ethics to evaluate a proposed data reuse.",
    "In the consent, clarity, consistency, control and consequences framework, consent asks whether people agreed to the purpose. Clarity asks whether the explanation was understandable. Consistency tests whether later use matches that explanation. Control concerns meaningful choices over the data. Consequences examine likely benefit and harm.",
    "A fitness app proposes sharing exercise logs with an insurer. Check the original opt-in, show plainly which fields would be shared, and compare insurance scoring with the original coaching purpose. Provide controls for future sharing. Evaluate whether incomplete exercise records could unfairly increase premiums.",
    "The five checks answer different questions. Clear disclosure alone does not resolve an inconsistent purpose. If your course uses a different Five Cs formulation, follow the terminology in the prescribed text."
  ],
  [
    "Diversity, inclusion and future trends",
    "How can diversity and inclusion shape the evaluation of a new data science system?",
    "Diversity concerns which experiences appear in the data and design team. Inclusion concerns who can participate, influence requirements and access the result. Audit coverage, collect feedback from affected groups, evaluate subgroup outcomes and revisit the design after deployment.",
    "A speech interface recognizes 950 of 1,000 utterances from one group and 60 of 100 from another. Pooled accuracy is 1,010/1,100, about 91.8%, yet the second group receives 60% accuracy. Recruit speakers from the underrepresented group, test with realistic devices, and report both rates after revision.",
    "Privacy-preserving approaches such as federated learning can support participation when raw recordings remain on devices. They still need representative participants and privacy safeguards for model updates."
  ],
  [
    "Working with NumPy arrays and data types",
    "Explain how shape, axes and dtype determine the behavior of an ndarray.",
    "An ndarray represents a rectangular collection using a common element dtype. Shape gives the length of each axis, ndim counts axes, size counts elements and itemsize gives bytes per element. Element types affect memory, range and precision. Vectorized operations apply compiled routines across compatible elements.",
    "For a = np.array([[2,4,6],[1,3,5]], dtype=np.int16), shape is (2,3), size is 6 and the element buffer uses 12 bytes. a.mean(axis=0) collapses the row axis and returns [1.5,3.5,5.5]. An int64 buffer would use 48 bytes for the same six values.",
    "A narrow integer dtype saves memory but can overflow. Arithmetic that needs decimals or a larger range should use an appropriate dtype before the calculation."
  ],
  [
    "Array creation, indexing and slicing",
    "Construct a two-dimensional array and explain scalar indexing, slicing and masking.",
    "Create data explicitly with np.array or generate a sequence using np.arange. Reshape changes dimensions while preserving element count. Indexing uses zero-based positions. A slice specifies start, exclusive stop and optional step. A boolean mask selects elements satisfying a condition.",
    "Let a = np.arange(12).reshape(3,4). The rows are 0–3, 4–7 and 8–11. a[1,2] is 6. a[:,1:3] selects columns 1 and 2, yielding [[1,2],[5,6],[9,10]]. a[a % 5 == 0] yields [0,5,10]. Predicting each output demonstrates which axes the selection preserves.",
    "Basic slicing usually returns a view: writing to it can change the original. Use .copy() for an independent result. Boolean indexing produces a separate selection."
  ],
  [
    "Numerical operations and array functions",
    "Explain vectorization, broadcasting and reduction using one matrix.",
    "Vectorization expresses an elementwise calculation on entire arrays. Broadcasting aligns dimensions from the right: corresponding lengths must match or one must equal one. A reduction combines values along an axis, for example sum or mean. Matrix multiplication uses @ and has different shape rules.",
    "For a = np.array([[1,2,3],[4,5,6]]), a * 2 doubles every entry. a + [10,20,30] produces [[11,22,33],[14,25,36]]. a.sum(axis=0) yields [5,7,9], whereas a.sum(axis=1) yields [6,15]. The axis named is the axis being reduced.",
    "Adding a length-two vector to this matrix fails because the trailing dimensions are 3 and 2. Reshape row offsets to (2,1) to add one offset to each row."
  ],
  [
    "Data processing using arrays",
    "Show how masks and vectorized arithmetic implement a reproducible cleaning pipeline.",
    "Define validity rules in the units of the measurement. Cast to a dtype that can represent missing values, create a boolean mask, replace invalid observations and calculate summaries along the intended axis. Keep the mask or a count so the summary communicates coverage.",
    "Let readings be [20, 22, -999, 24] °C and let the documented missing code be -999. With a floating array, clean = np.where(a == -999, np.nan, a). np.nanmean(clean) equals 22 °C. Subtracting 22 gives anomalies [-2, 0, missing, 2]. The mean of the uncleaned readings would be -233.25 °C.",
    "Treating missing as zero also biases the result. If all readings are missing, report missing coverage instead of interpreting the output as a measured temperature."
  ],
  [
    "Loading and saving arrays",
    "Compare binary and text persistence for a NumPy experiment.",
    "An NPY file stores one array with shape and dtype metadata. An NPZ archive groups several named arrays. Text formats are easy to inspect or exchange but require agreement on delimiters, header handling and numeric precision. Choose a format based on round-trip fidelity and the receiving tool.",
    "Save a 2-by-2 int16 array with np.save(\"scores.npy\", a), then b = np.load(\"scores.npy\", allow_pickle=False). Check b.shape, b.dtype and np.array_equal(a,b). For a CSV exchange, write np.savetxt(\"scores.csv\", a, delimiter=\",\", fmt=\"%d\") and specify delimiter and dtype when loading it.",
    "Rounded text can lose significant digits from floating-point values. Compare numerical arrays with an appropriate tolerance when text serialization intentionally changes precision."
  ],
  [
    "NumPy random numbers",
    "Explain reproducibility and sampling using NumPy's random generator.",
    "A pseudorandom generator updates an internal state to produce a deterministic sequence with useful statistical properties. A seed initializes that state. Choose the distribution to match the experiment: integers for discrete outcomes, normal for a continuous noise model, and choice for sampling from a population.",
    "Use rng = np.random.default_rng(42) and rolls = rng.integers(1,7,size=600). The upper bound is exclusive, so six is possible and seven is excluded. For a fair die each face has expected count 100; finite samples fluctuate. Estimate the chance of rolling an even number with (rolls % 2 == 0).mean() and compare with 3/6.",
    "Recreating a generator with the same seed for every trial repeats the sequence. Create it once and record the seed and software environment for reproducibility."
  ],
  [
    "Data manipulation with Pandas",
    "Explain labeled tabular operations and the role of index alignment in pandas.",
    "A Series is a one-dimensional labeled object. A DataFrame combines labeled columns that may have different dtypes. Select columns by name, rows by label with loc and positions with iloc. Arithmetic aligns labels, which is valuable when records arrive in different orders.",
    "Suppose marks is a Series with A:70 and B:80, while bonus lists B:5 and A:2. marks + bonus gives A:72 and B:85 because labels align. Assign the result to a final_score column, then filter using df.loc[df[\"final_score\"] >= 80]. B qualifies. Positional pairing would apply the bonuses to the wrong students.",
    "A missing label can produce a missing value. Check unique identifiers and inspect unmatched indices before filling a missing bonus with zero."
  ],
  [
    "Data wrangling and exploration",
    "Design a wrangling and exploration sequence for a table of orders.",
    "Wrangling converts raw records into an analysis-ready structure. Define what one row means, inspect types and units, parse dates and normalize categories. Explore row counts, missingness, distributions and group sizes before and after each transformation. Retain an auditable copy of the raw values.",
    "Order totals recorded as \"100\", \"₹200\" and blank form a text column. Remove the currency symbol where appropriate and parse the result numerically. The two known orders total ₹300 and average ₹150; report one missing total. Grouping by month can reveal whether missing totals occur only after a system change.",
    "Filling the blank with zero would reduce the mean to ₹100 and change its meaning. A genuine zero-value order and an unknown total require separate treatment."
  ],
  [
    "Cleaning, filtering and merging data",
    "Explain how to join two cleaned tables without silently changing the number of observations.",
    "Cleaning standardizes data types and keys. Filtering restricts rows with an explicit condition. Merging combines records on a meaningful key. A left join preserves every row of the left table, while an inner join discards unmatched keys. Check the expected relationship before merging.",
    "Orders contain customer IDs [A,A,B] and the customer table has one row for each of A and B. Join with orders.merge(customers, on=\"id\", how=\"left\", validate=\"many_to_one\", indicator=True). Expect three rows, inspect the merge indicator and reconcile total revenue. If the customer table has two A records, an unchecked join produces five rows.",
    "Resolve duplicate keys using a business rule, such as the address valid on the order date. Arbitrarily keeping the first row may give a plausible but incorrect result."
  ],
  [
    "Reshaping and aggregating data",
    "Distinguish reshaping from aggregation and demonstrate when information is lost.",
    "Reshaping changes the arrangement of records, such as converting subject columns into a subject and score pair with melt. Aggregation summarizes multiple observations, for example by grouping on subject and calculating a mean. Pivot requires unique row-column pairs, whereas pivot_table can aggregate duplicate combinations.",
    "Students A and B score 60 and 80 in Maths, and 70 and 90 in Physics. Melting produces four student-subject rows; pivoting on student and subject reconstructs the original table. Grouping the long table by subject and taking mean gives Maths 70 and Physics 80. The two means cannot reconstruct individual marks.",
    "When combining group averages, weight by the number of valid records. An unweighted mean of differently sized groups answers a different question."
  ],
  [
    "Reading, writing, loading and saving files with Pandas",
    "Design a reliable import and export process for a pandas dataset.",
    "Inspect the file layout and choose the matching reader. Specify the delimiter, encoding, missing-value conventions and types for sensitive columns. Parse dates explicitly, validate schema and keys, then export in a format appropriate for the recipient. Test the result by reading it back.",
    "For a CSV containing IDs 001 and 010, use pd.read_csv(path, dtype={\"id\":\"string\"}). An inferred integer column loses the leading zeros. Write with df.to_csv(out, index=False) to avoid exporting the incidental DataFrame index. On reimport, check both IDs, row count, total amount and date range.",
    "CSV does not retain a complete schema. A typed format such as Parquet is useful for repeated analysis, while a documented CSV can be easier to exchange with other tools."
  ],
  [
    "Data visualization in Python",
    "Demonstrate a Python visualization workflow from raw measurements to an interpretable figure.",
    "Begin with a question and identify the data types. Clean the records, calculate the quantity to display and select a visual encoding that matches the comparison. In Matplotlib, create a Figure and Axes with fig, ax = plt.subplots(). Draw on the Axes, label units and export the Figure.",
    "To compare wait times at two desks, desk A records [2,4,6] minutes and B records [3,6,9]. Their means are 4 and 6. Draw ax.bar([\"A\",\"B\"], [4,6]) and label the vertical axis \"Mean wait (minutes)\". Show the sample sizes or individual points so the reader sees how little evidence underlies the comparison.",
    "A two-minute difference describes this sample. Without more observations and comparable operating conditions, it is insufficient to conclude that a desk is consistently slower."
  ],
  [
    "Understanding data visualization",
    "Explain how a chart's encoding and scale influence the reader's conclusion.",
    "A visualization maps variables to position, length, color or other visible attributes. Match the mapping to the task: aligned lengths support category comparisons, position on two axes shows association, and ordered color can show intensity. Put units, denominator and time period where they can be checked.",
    "Two departments report 8 incidents among 200 users and 12 among 600. A count chart ranks the second higher, but the rates are 4% and 2%. To compare user risk, plot rates on a common scale and label denominators. To allocate investigation staff, counts may answer the more relevant question.",
    "A truncated bar axis exaggerates ratios because viewers interpret bar length from its baseline. Choose the question before the chart, then explain what the chart permits the reader to infer."
  ],
  [
    "Bar charts and line plots",
    "Compare bar and line charts and justify a choice for two different questions.",
    "Bars encode values by length from a common baseline. They suit discrete categories whose order can often be changed. Lines connect positions in a meaningful order, making slopes and turning points visible. Connecting unrelated categories suggests transitions that have no interpretation.",
    "For sales of 20, 35 and 30 items in January, February and March, the line rises by 15 then falls by 5. Use ax.plot(months, sales, marker=\"o\") after ordering by date. For three stores measured in the same month, ax.bar(stores, sales) supports comparison without implying a journey between stores.",
    "Use actual date distances for irregular observations. On a bar chart retain a meaningful zero baseline; on a time-series chart identify gaps before connecting two observations."
  ],
  [
    "Area plots and histograms",
    "Distinguish an area plot from a histogram and show how each can mislead.",
    "An area plot fills the region between a sequence and a baseline. Stacked areas show how components contribute to a total over an ordered axis. A histogram divides a numerical variable into intervals and counts observations in each. Its horizontal axis represents value ranges rather than categories or time.",
    "Suppose online and store sales are [4,6] and [6,6] over two days. A stacked area chart has total heights 10 and 12. For wait times [1,2,2,4,5,5], bins [0,3) and [3,6) each contain three observations. A histogram shows equal counts even though the individual wait times differ.",
    "Bin boundaries can conceal clusters. With unequal bin widths, use density if bar area is intended to represent relative frequency. For stacked areas, interior series are harder to compare because their baselines move."
  ],
  [
    "Pie charts and box plots",
    "Explain what pie and box plots reveal and calculate the quantities that define them.",
    "A pie chart encodes mutually exclusive parts of a single total by angle. A box plot describes a numerical distribution using the median and quartiles. The box spans the interquartile range. A common convention draws whiskers to the most extreme observations within 1.5 IQR of each quartile.",
    "Counts of 20, 30 and 50 out of 100 produce pie angles of 72°, 108° and 180°. For data with Q1 = 10, median = 14 and Q3 = 18, IQR = 8. The upper fence is 18 + 1.5 × 8 = 30. An observation of 35 appears as a potential outlier under that convention.",
    "The fence is a threshold, not necessarily the endpoint of the whisker. A flagged observation may be valid. A pie chart also becomes difficult to interpret when several slices are nearly equal."
  ],
  [
    "Scatter plots and time series plots",
    "Show why plotting the same observations against different axes answers different questions.",
    "A scatter plot maps two numerical variables to horizontal and vertical position. Inspect direction, form, spread, clusters and unusual points. A time-series plot orders one measure by time and can expose trends, cycles or sudden level shifts. Its interpretation depends on the sampling interval.",
    "For three days with temperatures [20,25,30] and ice-cream sales [40,55,70], scatter points suggest positive association. Plot sales against date instead and the visible pattern is two successive increases of 15 items. The scatter view alone does not show whether day order or another factor explains the association.",
    "Check weekday effects and collect more observations before predicting sales from temperature. Mark missing days as gaps when a connecting line would imply an unobserved trend."
  ],
  [
    "Figures and subplots",
    "Explain the Figure–Axes relationship and design a fair small-multiple comparison.",
    "The Figure is the complete canvas used for layout and export. Each Axes is a plotting region with its own artists, scales and labels. Subplots place related views on a common canvas. Share an axis when panels represent the same quantity and a direct visual comparison is intended.",
    "Use fig, axes = plt.subplots(1,2,sharey=True,layout=\"constrained\"). Draw monthly defects [2,4,6] for line A and [20,22,24] for line B. Label months on both panels, defects per month on the shared axis, and each line in its panel title. Both rise by four, while B remains 18 defects higher.",
    "Separate automatically scaled axes could make very different levels look alike. If production volumes differ, plot defect rates as well as counts before judging manufacturing quality."
  ],
  [
    "Plotting functions with Pandas",
    "Demonstrate how pandas plotting depends on the shape and aggregation of a table.",
    "Pandas offers plotting methods on Series and DataFrame objects. By default, a line plot can use the index as x and numerical columns as series. Decide whether each row is an observation or a summary, then reshape or aggregate before choosing kind=\"bar\", \"line\", \"hist\" or \"scatter\".",
    "A sales table has East amounts 10 and 20 and West amount 20. totals = df.groupby(\"region\")[\"amount\"].sum() gives East 30 and West 20. totals.plot.bar(ylabel=\"Total sales\") compares totals. Group means instead are 15 and 20, reversing the ranking because East has more records.",
    "Choose total for volume and mean for a typical transaction. For a time trend convert timestamps, sort and aggregate by the intended interval before calling plot.line()."
  ],
  [
    "Data visualization using Tableau",
    "Explain how Tableau converts a data source into an analytical view.",
    "Connect to data, inspect field types and identify its level of detail. Dimensions group observations, while measures are aggregated at the view's level of detail. Rows and Columns determine spatial layout. The Marks card controls properties such as type, color, size and detail.",
    "For transactions East 100, East 50 and West 120, place Region on Rows and SUM(Sales) on Columns. The bars show East 150 and West 120. Switching to AVG(Sales) gives East 75 and West 120. Interpret the first as sales volume and the second as average transaction amount.",
    "Adding another dimension to Detail can split marks. After modifying the view, reconcile totals against the source and state the aggregation explicitly in the title or tooltip."
  ],
  [
    "Filters, parameters and sets",
    "Compare a filter, a parameter and a set through one Tableau dashboard.",
    "A filter restricts records or marks at a stage of Tableau's order of operations. A parameter stores one chosen value that can drive a calculation or filter. A set defines membership in a subset of a dimension, allowing in/out comparisons. These controls serve distinct analytical purposes.",
    "Suppose product sales are A 80, B 120 and C 150. A target parameter of 100 can drive SUM([Sales]) >= [Target] per product, marking B and C as meeting target. A top-two product set also contains B and C here. Raise the target to 140: only C meets target, while the top-two set still contains B and C. A region filter can change which records contribute.",
    "A parameter by itself changes no marks; reference it in a calculation or control. Check filter order when a top-N result should be recalculated within a selected region."
  ],
  [
    "Arithmetic and logical table calculations",
    "Distinguish row-level arithmetic, aggregate logic and a Tableau table calculation.",
    "Row-level arithmetic evaluates an expression on each source record. An aggregate calculation combines records at the view's level of detail. Logical expressions classify results using conditions. Table calculations operate on the aggregated marks in the view; addressing specifies traversal and partitioning specifies where a calculation restarts.",
    "For monthly sales of 100, 150 and 120, RUNNING_SUM(SUM([Sales])) computed across month gives 100, 250 and 370. A logical test comparing that running sum with 200 first becomes true in month two. If the view contains multiple regions, restart the running sum per region to answer a regional question.",
    "Changing the sort order or removing displayed months may change a table calculation. Verify the intermediate monthly totals and the Compute Using setting before interpreting the result."
  ],
  [
    "Heat maps and tree maps",
    "Compare heat maps and treemaps for locating high-value categories.",
    "A heat map encodes a measure by color within a grid of two categorical dimensions. A treemap divides an area into nested rectangles, with size typically representing contribution and color optionally representing another measure. Heat maps suit comparisons across two dimensions; treemaps emphasize part-to-whole structure.",
    "North has sales of 60 and 40 in categories A and B. South has 20 and 80. A region-by-category heat map highlights South-B as the highest cell. In a treemap of all sales, South-B occupies 80/200 = 40% of the total area. Grouping by region shows two equally large parent rectangles.",
    "Use one color scale for comparable heat-map cells and label whether values are counts or rates. Rectangle areas convey approximate proportions; use bars when close values must be compared accurately."
  ],
  [
    "Pareto charts",
    "Construct and interpret a Pareto chart for defect prioritization.",
    "A Pareto chart orders categories by descending frequency or cost. Bars show individual contributions and a line shows cumulative percentage on a second scale. Choose the measure, aggregate it by category, sort descending and divide each running sum by the overall total.",
    "If defects A, B, C and D occur 40, 30, 20 and 10 times, cumulative counts are 40, 70, 90 and 100. The line therefore reaches 80% only at category C. The smallest leading group covering at least 80% comprises A, B and C. In Tableau calculate the running total over category in the same descending order as the bars.",
    "The 80/20 pattern is an empirical observation, not a guaranteed split. A rare but costly defect might move to the top in a separate Pareto chart ranked by financial loss."
  ],
  [
    "Interactive dashboards",
    "Design an interactive dashboard and explain how you would verify its behavior.",
    "Start with an audience and a decision. Select complementary sheets, keep metric definitions consistent and arrange the overview before details. A filter action restricts target data; a highlight action retains context while emphasizing selected marks. Configure source, targets, trigger and clearing behavior.",
    "A regional sales dashboard shows national sales of ₹500 and a product chart. Selecting East, whose sales are ₹180, should update the product bars so their sum is ₹180. The KPI title must indicate whether it shows national or selected-region sales. Clearing the selection should restore the documented default.",
    "Test selecting a region with no transactions, combining date and region filters, and using the dashboard on a narrow display. Empty results need an explanatory label so users can distinguish missing data from a measured zero."
  ],
  [
    "Story interfaces and sharing your work",
    "Explain how a Tableau story turns a collection of views into a reproducible argument.",
    "A story sequences worksheets or dashboards into story points. Each point should answer a specific question, preserve the intended view state and use a caption that states the finding. Start with context, present supporting detail, then disclose limitations and the decision the evidence can support.",
    "A store's returns rise from 20/1,000 orders to 30/1,000. Point one shows the rate rising from 2% to 3%. Point two breaks it down by product; point three shows which segment contributed the additional returns. The change is one percentage point, or a 50% relative increase. Explain which measure each caption uses.",
    "Before sharing, test filters and permissions as the intended viewer, check whether the source or extract travels with the workbook, and remove confidential fields. A static export preserves the selected view but loses interactive investigation."
  ]
];

const normalize = title => title.trim().toLowerCase().replace(/\s+/g, " ");
const answers = new Map(entries.map(([title, question, explanation, example, evaluation]) => [
  normalize(title),
  [
    "## Practice question", question,
    "## Explanation", explanation,
    "## Worked example", example,
    "## Interpretation and limitations", evaluation,
    "## Suggested 10-mark breakdown",
    "2 marks for defining the central idea, 3 for explaining how it works, 3 for developing the example and 2 for interpreting the result or discussing a limitation.",
  ].join("\n"),
]));

export const examAnswer = title => answers.get(normalize(title));
