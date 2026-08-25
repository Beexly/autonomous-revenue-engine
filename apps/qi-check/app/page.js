"use client";

import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onScore(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, platform: "x" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "score_failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, letterSpacing: "-0.03em", marginBottom: 6 }}>qi-check</h1>
      <p style={{ color: "#b7b2a6", marginTop: 0 }}>
        Paste your draft. This scores first-screen density, bait, and Hold fitness.
        It does not write the post. It does not publish.
      </p>
      <form onSubmit={onScore}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="First line is the decision."
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#161616",
            color: "#e8e4d9",
            border: "1px solid #3a3a36",
            padding: 12,
            font: "15px/1.45 ui-sans-serif, system-ui, sans-serif",
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 12,
            padding: "10px 16px",
            background: "#e8e4d9",
            color: "#111",
            border: 0,
            fontWeight: 650,
            cursor: "pointer",
          }}
        >
          {busy ? "Scoring…" : "Score"}
        </button>
      </form>
      {error ? <p style={{ color: "#d46a6a" }}>{error}</p> : null}
      {result ? <Result data={result} /> : null}
    </main>
  );
}

function Result({ data }) {
  const scores = data.scores || {};
  return (
    <section style={{ marginTop: 28 }}>
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        {data.recommendation} · {data.total}
      </p>
      <p style={{ color: "#b7b2a6", marginTop: 0 }}>
        Hold floor {data.floors?.hold}. Soft floor {data.floors?.soft}.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {Object.entries(scores).map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: "4px 0", color: "#b7b2a6" }}>{k}</td>
              <td style={{ padding: "4px 0", textAlign: "right" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.firstScreenPreview ? (
        <p style={{ marginTop: 16, color: "#b7b2a6" }}>
          First screen: {data.firstScreenPreview}
        </p>
      ) : null}
      {Array.isArray(data.fixes) && data.fixes.length ? (
        <ol style={{ paddingLeft: 18 }}>
          {data.fixes.map((f, i) => (
            <li key={i} style={{ margin: "6px 0" }}>
              {f}
            </li>
          ))}
        </ol>
      ) : (
        <p>No fix list. Hold stands.</p>
      )}
    </section>
  );
}
