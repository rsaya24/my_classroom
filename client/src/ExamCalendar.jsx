import { useEffect, useState } from "react";

function dateKey(value) {
  return [String(value.getFullYear()).padStart(4, "0"), String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0")].join("-");
}

export default function ExamCalendar({ requestApi, onExpired }) {
  const [today] = useState(() => dateKey(new Date()));
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setLoadFailed(false);
    requestApi("/exams").then(data => {
      if (active) setExams(data);
    }).catch(err => {
      if (!active) return;
      if (err.status === 401) onExpired();
      setLoadFailed(true);
      setError(err.message);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [requestApi, onExpired, attempt]);

  const first = new Date(month + "-01T12:00:00");
  const year = first.getFullYear();
  const m = first.getMonth();
  const days = new Date(year, m + 1, 0).getDate();
  const monthTitle = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const agenda = exams.filter(e => e.date.startsWith(month))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  function changeMonth(offset) {
    const target = dateKey(new Date(year, m + offset, 1));
    setMonth(target.slice(0, 7));
    setDate(target);
    setMessage("");
  }
  async function save(event) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const exam = await requestApi("/exams", "POST", { name: data.get("name"), date, time: data.get("time") });
      setExams(current => [...current, exam]);
      setMonth(exam.date.slice(0, 7));
      form.elements.namedItem("name").value = "";
      form.elements.namedItem("time").value = "";
      setMessage(exam.name + " added to your calendar.");
    } catch (err) {
      if (err.status === 401) onExpired();
      setError(err.message);
    } finally { setSaving(false); }
  }

  return <section className="subject exam-calendar" aria-labelledby="exam-heading">
    <h2 id="exam-heading">Exam calendar</h2>
    <div className="exam-layout">
      <div>
        <div className="month-nav">
          <button type="button" className="secondary-button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <h3 aria-live="polite">{monthTitle}</h3>
          <button type="button" className="secondary-button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
        <div className="exam-grid">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(label => <small key={label}>{label}</small>)}
          {Array.from({ length: (first.getDay() + 6) % 7 }, (_, i) => <span key={"gap" + i} />)}
          {Array.from({ length: days }, (_, i) => {
            const key = month + "-" + String(i + 1).padStart(2, "0");
            const count = agenda.filter(e => e.date === key).length;
            return <button key={key} type="button" aria-label={key + (count ? ", " + count + " exams" : "")}
              aria-current={key === today ? "date" : undefined} aria-pressed={date === key}
              onClick={() => { setDate(key); setMessage(""); }}>
              {i + 1}{count > 0 && <span aria-hidden="true">●</span>}
            </button>;
          })}
        </div>
      </div>
      <div>
        <form className="exam-form" onSubmit={save}>
          <label>Exam name<input name="name" maxLength={160} required placeholder="e.g. Data Science" /></label>
          <label>Date<input type="date" required value={date} onChange={event => {
            const value = event.target.value;
            setDate(value);
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) setMonth(value.slice(0, 7));
          }} /></label>
          <label>Time<input name="time" type="time" required /></label>
          <button className="notes-button" disabled={saving || loading || loadFailed}>{saving ? "Saving…" : "Add exam"}</button>
        </form>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert" className="error">{error} {loadFailed && <button className="secondary-button" onClick={() => setAttempt(n => n + 1)}>Retry</button>}</p>}
        <h3>Exams in {monthTitle}</h3>
        {loading ? <p role="status">Loading exams…</p> : !loadFailed && !agenda.length && <p>No exams scheduled this month.</p>}
        <ul className="exam-agenda">{agenda.map(exam => <li key={exam._id}>
          <strong>{exam.name}</strong> <time dateTime={exam.date + "T" + exam.time}>{new Date(exam.date + "T" + exam.time).toLocaleString(undefined,
            { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</time>
        </li>)}</ul>
      </div>
    </div>
  </section>;
}
