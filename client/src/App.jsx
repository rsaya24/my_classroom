import { useCallback, useEffect, useRef, useState } from "react";

async function requestApi(path, method = "GET", payload) {
  const response = await fetch("/api" + path, {
    method,
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (response.status === 204) return;
  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    throw new Error("The classroom API is unavailable.");
  }
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error ?? "The request failed."), { status: response.status });
  return data;
}

const request = (path, method, payload) => requestApi("/subjects" + path, method, payload);

function App() {
  const [account, setAccount] = useState(undefined);
  const [authError, setAuthError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    requestApi("/auth/session").then(user => {
      if (active) setAccount(user);
    }).catch(error => {
      if (!active) return;
      if (error.status !== 401) setAuthError(error.message);
      setAccount(null);
    });
    return () => { active = false; };
  }, []);

  const expireSession = useCallback(() => setAccount(null), []);

  async function logout() {
    setSigningOut(true);
    setAuthError("");
    try {
      await requestApi("/auth/logout", "POST", {});
      setAccount(null);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <header className="masthead">
        <div className="frame masthead-inner">
          <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
          <span className="brand">My Classroom</span>
          {account && <div className="account-tools">
            <span>{account.email}</span>
            <button className="secondary-button" disabled={signingOut} onClick={logout}>Sign out</button>
          </div>}
        </div>
      </header>
      {authError && <p className="frame error account-error" role="alert">{authError}</p>}
      {account === undefined ? <main className="frame dashboard" role="status">Opening classroom…</main> :
        account ? <Dashboard key={account.email} onExpired={expireSession} /> :
          <AccountForm onSuccess={user => { setAuthError(""); setAccount(user); }} />}
    </>
  );
}

function AccountForm({ onSuccess }) {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      onSuccess(await requestApi(signup ? "/auth/signup" : "/auth/login", "POST", {
        email: form.get("email"),
        password: form.get("password"),
      }));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="frame auth-layout">
      <section className="auth-intro" aria-labelledby="welcome-heading">
        <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
        <h1 id="welcome-heading">Your study workspace</h1>
        <p>Import your syllabus, work through each unit, and return to the notes and progress you’ve saved.</p>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <h2>{signup ? "Create your account" : "Sign in"}</h2>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label>Password<input name="password" type="password"
          autoComplete={signup ? "new-password" : "current-password"}
          minLength={signup ? 12 : undefined} maxLength={128} required /></label>
        {signup && <small>Use at least 12 characters.</small>}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="notes-button" type="submit" disabled={busy}>
          {busy ? "Working…" : signup ? "Create account" : "Sign in"}
        </button>
        <button type="button" className="secondary-button" disabled={busy}
          onClick={() => { setSignup(!signup); setError(""); }}>
          {signup ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </form>
    </main>
  );
}

function draftUnits(text) {
  const heading = /^\s*(?:[#*|•]+\s*)?(?:unit|module)\s*[-:–—.|]*\s*(\d+|[ivxlcdm]+|one|two|three|four)\b[\s:–—.|-]*(.*)$/i;
  const units = [];
  for (const line of text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)) {
    const match = line.match(heading);
    if (match) {
      units.push({ title: "Unit " + match[1].toUpperCase(), lines: match[2] ? [match[2]] : [] });
    } else if (units.length) {
      units.at(-1).lines.push(line);
    }
  }
  if (!units.length) return [{ title: "Unit 1", text: text.trim() }];
  return units.map(unit => ({ title: unit.title, text: unit.lines.join("\n") }));
}

function Dashboard({ onExpired }) {
  const [subjects, setSubjects] = useState([]);
  const [draft, setDraft] = useState(null);
  const [reading, setReading] = useState(false);
  const [path, setPath] = useState(() => window.location.hash);
  const [notesStatus, setNotesStatus] = useState({});
  const pendingNotes = useRef(new Set());

  useEffect(() => {
    function navigate() {
      setPath(window.location.hash);
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    request("").then(data => {
      if (active) setSubjects(data);
    }).catch(failure => {
      if (!active) return;
      if (failure.status === 401) onExpired();
      else setError(failure.message);
    }).finally(() => {
      if (active) setBusy(false);
    });
    return () => { active = false; };
  }, [onExpired]);

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (failure) {
      if (failure.status === 401) onExpired();
      else setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  const updateUnit = useCallback((subjectId, unitId, update) => {
    setSubjects(previous => previous.map(subject => subject._id !== subjectId ? subject : {
      ...subject,
      units: subject.units.map(unit => unit._id === unitId ? update(unit) : unit),
    }));
  }, []);

  function upload(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    run(async () => {
      if (file.type !== "image/png" || file.size > 3_000_000) {
        throw new Error("Choose a PNG file up to 3 MB.");
      }
      setDraft({ title: file.name.replace(/\.png$/i, ""), units: draftUnits(""), source: "" });
      setReading(true);
      let worker;
      try {
        const url = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.esm.min.js";
        const { default: ocr } = await import(/* @vite-ignore */ url);
        worker = await ocr.createWorker("eng");
        const { data } = await worker.recognize(file);
        setDraft(previous => ({ ...previous, units: draftUnits(data.text), source: data.text.trim() }));
      } catch {
        setError("Automatic text recognition was unavailable. Enter the subtopics below to continue.");
      } finally {
        setReading(false);
        if (worker) await worker.terminate();
      }
    });
  }

  function editDraftUnit(index, changes) {
    setDraft(previous => ({
      ...previous,
      units: previous.units.map((unit, i) => i === index ? { ...unit, ...changes } : unit),
    }));
  }

  function saveOutline() {
    run(async () => {
      const units = draft.units.map(unit => ({
        title: unit.title.trim(),
        topics: unit.text.split(/\r?\n/).map(line => line.trim()).filter(Boolean),
      }));
      const incomplete = units.findIndex(unit => !unit.title || !unit.topics.length);
      if (incomplete >= 0) throw new Error("Enter a unit title and at least one subtopic in section " + (incomplete + 1) + ".");
      const subject = await request("/outline", "POST", { title: draft.title.trim(), units });
      setSubjects(previous => [...previous, subject]);
      setDraft(null);
      window.location.hash = "/subjects/" + subject._id;
    });
  }

  function toggle(subject, unit, topic, completed) {
    run(async () => {
      await request("/" + subject + "/units/" + unit + "/topics/" + topic, "PATCH", { completed });
      updateUnit(subject, unit, current => ({
        ...current,
        topics: current.topics.map(item => item._id === topic ? { ...item, completed } : item),
      }));
    });
  }

  const [, subjectId, unitId] = path.match(/^#\/subjects\/([^/]+)(?:\/units\/([^/]+))?$/) ?? [];
  const selectedSubject = subjects.find(subject => subject._id === subjectId);
  const selectedUnit = selectedSubject?.units.find(unit => unit._id === unitId);
  const savedNotes = selectedUnit?.notes;
  const status = notesStatus[unitId];

  const generateNotes = useCallback(async (subject, unit) => {
    if (pendingNotes.current.has(unit)) return;
    pendingNotes.current.add(unit);
    setNotesStatus(previous => ({ ...previous, [unit]: { loading: true } }));
    try {
      const { notes } = await request("/" + subject + "/units/" + unit + "/notes", "POST", {});
      updateUnit(subject, unit, current => ({ ...current, notes }));
      setNotesStatus(previous => ({ ...previous, [unit]: { done: true } }));
    } catch (failure) {
      if (failure.status === 401) onExpired();
      setNotesStatus(previous => ({ ...previous, [unit]: { error: failure.message } }));
    } finally {
      pendingNotes.current.delete(unit);
    }
  }, [onExpired, updateUnit]);

  useEffect(() => {
    if (selectedUnit && !savedNotes && !status) void generateNotes(subjectId, unitId);
  }, [selectedUnit, savedNotes, status, subjectId, unitId, generateNotes]);

  if (path && path !== "#/" && path !== "#") {
    const subjectLink = "#/subjects/" + subjectId;
    return (
      <main className="frame dashboard">
        <nav className="study-nav" aria-label="Study navigation">
          <a href="#/">All subjects</a>
          {selectedSubject && unitId && <a href={subjectLink}>{selectedSubject.title}</a>}
        </nav>
        {error && <p role="alert" className="error">{error}</p>}
        {!selectedSubject && busy && <p role="status" className="status">Loading syllabus…</p>}
        {(!selectedSubject || (unitId && !selectedUnit)) && !busy && !error &&
          <p role="status">This subject or unit could not be found.</p>}
        {selectedSubject && !unitId && <>
          <h1 className="study-title">{selectedSubject.title}</h1>
          <div className="study-grid">
            {selectedSubject.units.map(unit => (
              <article className="subject study-card" key={unit._id}>
                <h2><a href={subjectLink + "/units/" + unit._id}>{unit.title} <span aria-hidden="true">→</span></a></h2>
                <ul>{unit.topics.map(topic => <li key={topic._id}>{topic.title}</li>)}</ul>
              </article>
            ))}
          </div>
        </>}
        {selectedUnit && <>
          <h1 className="study-title">{selectedUnit.title}</h1>
          <section className="subject study-card" aria-labelledby="unit-topics">
            <h2 id="unit-topics">Subtopics</h2>
            <ul className="topics">
              {selectedUnit.topics.map(topic => (
                <li key={topic._id}>
                  <label className="topic">
                    <input type="checkbox" checked={topic.completed} disabled={busy}
                      onChange={event => toggle(subjectId, unitId, topic._id, event.target.checked)} />
                    <span>{topic.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
          <section className="unit-notes" aria-labelledby="unit-notes-heading">
            <h2 id="unit-notes-heading">Study notes</h2>
            {!savedNotes && !status?.error && <p role="status" className="status">Generating notes for this unit…</p>}
            {status?.error && <>
              <p role="alert" className="error">{status.error}</p>
              <button type="button" className="notes-button" onClick={() => generateNotes(subjectId, unitId)}>Retry notes</button>
            </>}
            {savedNotes && <Notes notes={savedNotes} />}
          </section>
        </>}
      </main>
    );
  }

  const topics = subjects.flatMap(subject => subject.units.flatMap(unit => unit.topics));
  const completed = topics.filter(topic => topic.completed).length;
  const progress = topics.length ? Math.round(100 * completed / topics.length) : 0;

  return (
      <main className="frame dashboard">
        <section className="hero">
          <div className="hero-copy">
            <h1>Study dashboard</h1>
            <p>Import your syllabus, track topics, and keep your unit notes together.</p>
            <label className="upload-button">
              <input type="file" accept="image/png" onChange={upload} disabled={busy} aria-label="Import syllabus" />
              <span aria-hidden="true">＋</span> Import syllabus
            </label>
            <small>PNG screenshot · Up to 3 MB</small>
          </div>
          <div className="progress-card">
            <h2>Overall progress</h2>
            <strong>{progress}<span>%</span></strong>
            <progress max={100} value={progress} aria-label="Overall progress" />
            <p>{completed} of {topics.length} topics completed</p>
          </div>
        </section>
        {draft && <form className="subject review-form" aria-label="Review syllabus"
          onSubmit={event => { event.preventDefault(); saveOutline(); }}>
          <h2>Review syllabus</h2>
          {reading && <p role="status">Reading your PNG…</p>}
          {error && <p role="alert" className="error">{error}</p>}
          <label>Subject name<input required value={draft.title} disabled={busy}
            onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
          {!reading && <>
            {draft.source && <details><summary>View text read from the PNG</summary><pre>{draft.source}</pre></details>}
            {draft.units.map((unit, i) => (
              <fieldset key={i}>
                <legend>Section {i + 1}</legend>
                <label>Unit title<input required disabled={busy} value={unit.title}
                  onChange={e => editDraftUnit(i, { title: e.target.value })} /></label>
                <label>Subtopics, one per line<textarea rows={4} required disabled={busy}
                  value={unit.text} placeholder={"First subtopic\nSecond subtopic"}
                  onChange={e => editDraftUnit(i, { text: e.target.value })} /></label>
                {draft.units.length > 1 && <button type="button" className="secondary-button" disabled={busy}
                  onClick={() => setDraft({ ...draft, units: draft.units.filter((_, n) => i !== n) })}>Remove unit</button>}
              </fieldset>
            ))}
            <button type="button" className="secondary-button" disabled={busy}
              onClick={() => setDraft({ ...draft, units: [...draft.units, { title: "Unit " + (draft.units.length + 1), text: "" }] })}>Add unit</button>
            <div className="review-actions">
              <button type="submit" className="notes-button" disabled={busy}>Save subject</button>
              <button type="button" className="secondary-button" disabled={busy} onClick={() => { setDraft(null); setError(""); }}>Cancel</button>
            </div>
          </>}
        </form>}
        <section className="metrics" aria-label="Study statistics">
          <Metric value={subjects.length} label="Subjects" />
          <Metric value={completed} label="Topics completed" />
          <Metric value={topics.length - completed} label="Topics remaining" />
        </section>
        <section className="subjects" aria-labelledby="subjects-heading" aria-busy={busy}>
          <div className="section-heading">
            <h2 id="subjects-heading">Your subjects</h2>
          </div>
          {!draft && error && <p role="alert" className="error">{error}</p>}
          {!draft && busy && <p role="status" className="status">Working…</p>}
          {!busy && !error && !subjects.length && (
            <div className="empty">
              <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
              <h3>No subjects yet</h3>
              <p>Import a syllabus screenshot to create your first subject.</p>
            </div>
          )}
          {subjects.map(subject => (
            <article key={subject._id} className="subject">
              <a className="subject-heading subject-link" href={"#/subjects/" + subject._id}>
                <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
                <div>
                  <h3>{subject.title}</h3>
                  <p>{subject.units.length} {subject.units.length === 1 ? "unit" : "units"}</p>
                </div>
                <span className="subject-arrow" aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </section>
      </main>
  );
}

function Metric({ value, label }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span></div>;
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v15M3 5c4-1 7 0 9 2 2-2 5-3 9-2v13c-4-1-7 0-9 2-2-2-5-3-9-2z" />
    </svg>
  );
}

function Notes({ notes }) {
  const headings = ["h4", "h5", "h6", "h6"];
  return (
    <article className="notes">
      {notes.split("\n").map((line, index) => {
        const heading = line.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
          const level = heading[1].length - 1;
          const Tag = headings[level];
          return <Tag key={index}>{heading[2]}</Tag>;
        }
        return line.trim() && <p key={index}>{line}</p>;
      })}
    </article>
  );
}

export default App;
