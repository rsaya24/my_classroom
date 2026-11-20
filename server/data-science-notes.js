const units = [
  {
    matches: [/data science process/i, /data science roles/i, /informed consent/i, /five cs/i],
    notes: `## Data science overview and evolution
Data science uses statistics, computing and domain knowledge to turn observations into decisions. Its methods evolved from statistical analysis and database reporting to large-scale data mining, machine learning and predictive applications. A hospital might use past admissions to estimate how many beds it needs next week.
## Roles, tools and applications
A data engineer builds reliable data pipelines. An analyst explores trends and communicates findings. A data scientist designs and evaluates models. A domain expert checks whether the question and interpretation make sense. SQL retrieves records, pandas prepares tables, NumPy handles numerical arrays, and visualization tools communicate results.
## The data science process
Define the decision and a measurable goal first. Retrieve relevant data, check its source and permissions, then prepare it by resolving missing values, duplicates and inconsistent units. Explore distributions and relationships before modeling. Evaluate the model on held-out data, and present the result with assumptions and limitations.
## Ethics, ownership and privacy
Identify who collected the data, who controls its use, and whose lives it describes. Permission to access a dataset does not by itself establish informed consent. Explain the purpose of collection, minimize unnecessary fields, restrict access, and consider whether combining datasets could identify individuals.
## The Five Cs, diversity and inclusion
One common ethics framework uses consent, clarity, consistency, control and consequences. Apply it by asking whether people understand and control the use of their data and who bears the consequences of a mistake. Check performance across groups: an accurate average can hide poor outcomes for an underrepresented group.
## Future trends and revision
Privacy-preserving analysis, responsible AI and automated workflows can change how projects are built. For an exam answer, connect a trend to a practical benefit and a limitation. Practice tracing a student-performance project from goal definition through presentation, including where consent and bias checks belong.`
  },
  {
    matches: [/numpy/i, /data manipulation with pandas/i, /array creation/i, /data wrangling/i],
    notes: `## NumPy arrays and data types
An ndarray stores elements in a multidimensional array with a common dtype. Inspect shape for dimensions, ndim for the number of axes and dtype for the element type. Integer and floating-point arrays differ in precision and memory use.
## Array creation, indexing and slicing
np.array([2, 4, 6]) builds an array from values. np.arange(6).reshape(2, 3) makes two rows and three columns. For that array, a[1, 2] gives 5 and a[:, 1] selects the second column. Slice end positions are exclusive.
## Numerical operations and array functions
Arithmetic is elementwise: a * 2 doubles each element. Broadcasting lets compatible shapes interact, such as subtracting a column mean from every row. np.mean(a, axis=0) computes a mean per column; axis=1 summarizes each row. Use masks such as a[a > 2] to select values.
## Loading, saving and random numbers
Use np.save and np.load to round-trip an array in NPY format, or np.loadtxt for simple text data. np.random.default_rng(42) creates a reproducible generator. Use its integers or normal methods to simulate data.
## Data wrangling, exploration and cleaning in pandas
A DataFrame has labeled columns and an index. Inspect its structure with info(), sample records with head(), and summarize numerical columns with describe(). Check missing values, parse dates, fix inconsistent types and remove duplicates according to the meaning of each record.
## Filtering, merging and reshaping
A boolean filter such as df[df["marks"] >= 50] selects matching rows. merge joins tables using common keys; duplicate keys can multiply rows. melt turns wide data into long form. pivot or pivot_table rearranges long records into a table for comparison.
## Aggregation and file handling
Group records by a category and apply an aggregate: df.groupby("unit")["marks"].mean(). Use read_csv to load a table and to_csv(index=False) to save it without an extra index column. Verify row counts and totals after a join or reshape.
## Practice
Build a 2-by-3 array, select its last column and calculate row means. Then explain how you would clean two student tables, join them by student ID and report average marks per subject.`
  },
  {
    matches: [/visualization in python/i, /histograms?/i, /subplots?/i, /plotting functions with pandas/i],
    notes: `## Understanding data visualization
Choose a chart based on the question, variable types and comparison. Label axes and units, use readable scales and distinguish counts from proportions. A chart can reveal an association without establishing its cause.
## Bar, line and area plots
Use bars to compare categories. A line connects observations in a meaningful order, usually time. An area plot emphasizes magnitude over a baseline; stacked areas show composition but make middle series harder to compare.
## Histograms, pie charts and box plots
A histogram groups numerical values into bins to show distribution. Bin width changes the apparent shape. A pie chart displays parts of one whole. A box plot summarizes median and quartiles and can highlight possible outliers; points outside the whiskers need investigation.
## Scatter plots and time series
A scatter plot compares two numerical variables and can reveal clusters, outliers or nonlinear relationships. For a time series, parse timestamps, sort them and choose a meaningful interval. Gaps can represent missing observations rather than zeros.
## Figures, subplots and pandas
A Matplotlib Figure contains one or more Axes. fig, ax = plt.subplots() creates a plotting area. df.plot(x="month", y="sales", ax=ax) draws a line on it; changing kind to "bar" makes a bar chart. Use subplots for related measures that require separate scales.
## Practice
For monthly sales, use a line plot for the trend, a bar plot for comparisons by store, and a box plot for the spread of order values. Explain what information each chart reveals that the other two omit.`
  },
  {
    matches: [/tableau/i, /pareto/i, /interactive dashboards?/i, /tree ?map/i],
    notes: `## Tableau and visual analysis
Connect to the data and check field types. Dimensions such as Region group records; measures such as Sales are aggregated. Place fields on rows and columns, then use the Marks card to encode color, size and labels.
## Filters, parameters and sets
A filter restricts which records or marks appear. A parameter stores one user-selected value and affects a view when referenced in a calculation, filter or other configuration. A set represents a subset of members, such as the top ten products by sales.
## Arithmetic and logical calculations
Use arithmetic to derive a measure such as SUM([Profit]) / SUM([Sales]), handling zero sales explicitly. Logical expressions classify data: IF [Sales] >= 1000 THEN "High" ELSE "Low" END. Table calculations operate on the marks in the view; their result depends on the chosen partition and direction.
## Heat maps, treemaps and Pareto charts
A heat map uses color intensity across a grid. A treemap uses nested rectangles whose areas encode magnitude. A Pareto chart orders categories by contribution and overlays cumulative percentage. Find the categories responsible for most of the total rather than assuming an exact 80/20 split.
## Interactive dashboards, stories and sharing
Combine related sheets on a dashboard and link them with filter or highlight actions. Test selections and reset behavior. A story presents an ordered sequence of views to explain a finding. When sharing a workbook, verify access permissions, data freshness and whether the audience can see underlying records.
## Practice
Design a sales dashboard with a regional heat map and a Pareto chart by product. Explain how a region filter differs from a parameter that changes the sales target.`
  },
];

export function builtInNotes(topics) {
  const text = topics.map(topic => topic.title).join(" ");
  const matching = units.filter(unit => unit.matches.filter(pattern => pattern.test(text)).length >= 2);
  return matching.length === 1 ? matching[0].notes : null;
}
