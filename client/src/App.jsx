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

function readPng(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("The PNG could not be read."));
    reader.readAsDataURL(file);
  });
}

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

function Dashboard({ onExpired }) {
  const [subjects, setSubjects] = useState([]);
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

  function updateUnit(subjectId, unitId, update) {
    setSubjects(previous => previous.map(subject => subject._id !== subjectId ? subject : {
      ...subject,
      units: subject.units.map(unit => unit._id === unitId ? update(unit) : unit),
    }));
  }

  function upload(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    run(async () => {
      if (file.type !== "image/png" || file.size > 3_000_000) {
        throw new Error("Choose a PNG file up to 3 MB.");
      }
      const subject = await request("", "POST", { image: await readPng(file) });
      setSubjects(previous => [...previous, subject]);
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
        <section className="metrics" aria-label="Study statistics">
          <Metric value={subjects.length} label="Subjects" />
          <Metric value={completed} label="Topics completed" />
          <Metric value={topics.length - completed} label="Topics remaining" />
        </section>
        <section className="subjects" aria-labelledby="subjects-heading" aria-busy={busy}>
          <div className="section-heading">
            <h2 id="subjects-heading">Your subjects</h2>
          </div>
          {error && <p role="alert" className="error">{error}</p>}
          {busy && <p role="status" className="status">Working…</p>}
          {!busy && !error && !subjects.length && (
            <div className="empty">
              <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
              <h3>No subjects yet</h3>
              <p>Import a syllabus screenshot to create your first subject.</p>
            </div>
          )}
          {subjects.map(subject => (
            <article key={subject._id} className="subject">
              <header className="subject-heading">
                <span className="brand-icon" aria-hidden="true"><BookIcon /></span>
                <div>
                  <h3>{subject.title}</h3>
                  <p>{subject.units.length} {subject.units.length === 1 ? "unit" : "units"}</p>
                </div>
              </header>
              {subject.units.map(unit => (
                <StudyUnit key={unit._id} unit={unit} busy={busy}
                  onTopicChange={(topic, checked) => toggle(subject._id, unit._id, topic, checked)}
                  onLoadNotes={async () => {
                    const { notes } = await request("/" + subject._id + "/units/" + unit._id + "/notes", "POST", {});
                    updateUnit(subject._id, unit._id, current => ({ ...current, notes }));
                  }}
                  onExpired={onExpired} />
              ))}
            </article>
          ))}
        </section>
      </main>
  );
}

function StudyUnit({ unit, busy, onTopicChange, onLoadNotes, onExpired }) {
  const requested = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadNotes() {
    if (requested.current || unit.notes) return;
    requested.current = true;
    setLoading(true);
    setError("");
    try {
      await onLoadNotes();
    } catch (failure) {
      requested.current = false;
      if (failure.status === 401) onExpired();
      else setError(failure.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <details className="unit" onToggle={event => {
      if (event.currentTarget.open && !error) void loadNotes();
    }}>
      <summary>
        <span className="unit-title">{unit.title}</span>
        <span className="unit-count">{unit.topics.filter(topic => topic.completed).length} / {unit.topics.length}</span>
      </summary>
      <div className="unit-body">
        <ul className="topics">
          {unit.topics.map(topic => (
            <li key={topic._id}>
              <label className="topic">
                <input type="checkbox" checked={topic.completed} disabled={busy}
                  onChange={event => onTopicChange(topic._id, event.target.checked)} />
                <span>{topic.title}</span>
              </label>
            </li>
          ))}
        </ul>
        {loading && <p role="status" className="status">Generating notes for this unit…</p>}
        {error && <>
          <p role="alert" className="error">{error}</p>
          <button type="button" className="notes-button" onClick={loadNotes}>Retry notes</button>
        </>}
        {unit.notes && <Notes notes={unit.notes} />}
      </div>
    </details>
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
