/**
 * Community Notes writer, stolen from twitter/communitynotes template
 * (jaybaxter 1952767869256908874) and soba_roblox's analyzer.
 *
 * Do not fork the GitHub Action. That needs X API keys and spends tokens.
 * This drafts. Owner pastes. 280 characters. One URL. Or no note.
 */

export type Note = {
  verdict: "note" | "no-note" | "not-enough";
  text: string;
};

const MAX = 280;

export function draftNote(claim: string, sources: string[]): Note {
  const urls = sources.map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s));
  if (!claim.trim()) return { verdict: "no-note", text: "NO NOTE NEEDED." };
  if (urls.length === 0) {
    return {
      verdict: "not-enough",
      text: "NOT ENOUGH EVIDENCE TO WRITE A GOOD COMMUNITY NOTE.",
    };
  }
  const body =
    claim.trim().replace(/\s+/g, " ") +
    " " +
    urls[0];
  if (body.length > MAX) {
    return {
      verdict: "not-enough",
      text: "NOT ENOUGH EVIDENCE TO WRITE A GOOD COMMUNITY NOTE.",
    };
  }
  return { verdict: "note", text: body };
}
