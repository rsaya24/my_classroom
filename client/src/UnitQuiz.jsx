import { useState } from "react";
import { makeQuiz } from "./unitQuiz.js";

export default function UnitQuiz({ chapter, subject, unit }) {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const normalize = value => (value || "").trim().toLowerCase();
  const correct = (q, i) => normalize(answers[i]) === normalize(q.answer);
  function start() {
    setQuestions(makeQuiz(chapter));
    setAnswers({});
    setSubmitted(false);
  }
  return <section className="unit-quiz" aria-label={subject + " " + unit + " quiz"}>
    <h3>{unit} quiz</h3>
    {!questions && <button type="button" className="secondary-button" onClick={start}>Start quiz</button>}
    {questions?.length === 0 && <p>This unit needs more note text to create a quiz.</p>}
    {questions?.length > 0 && <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
      {questions.map((q, i) => <fieldset key={i} disabled={submitted}>
        <legend>{i + 1}. {q.prompt}</legend>
        {q.excerpt && <blockquote>{q.excerpt}</blockquote>}
        {q.options ? q.options.map(option => <label key={option}>
          <input type="radio" name={"quiz-" + i} required checked={answers[i] === option}
            onChange={() => setAnswers(previous => ({ ...previous, [i]: option }))} /> {option}
        </label>) : <input aria-label={"Answer to question " + (i + 1)} required pattern=".*\S.*" value={answers[i] || ""}
          onChange={event => setAnswers({ ...answers, [i]: event.target.value })} />}
        {submitted && <div className="quiz-feedback"><strong>{correct(q, i) ? "Correct" : "Correct answer: " + q.answer}</strong>
          <p>From {q.title}</p><blockquote>{q.evidence}</blockquote></div>}
      </fieldset>)}
      {submitted ? <div><p role="status"><strong>Your score: {questions.filter(correct).length} / {questions.length}</strong></p>
        <button type="button" className="secondary-button" onClick={start}>Try again</button></div> :
        <button className="notes-button" type="submit">Check answers</button>}
    </form>}
  </section>;
}
