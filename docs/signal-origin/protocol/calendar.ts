import { RAY, type Episode, type Residue } from "./continuity.ts";
import { qcShot, type Shot } from "./shot.ts";

export type Day = {
  d: number;
  episode: Episode;
  shot: Shot;
};

const DAYS: { beat: string; motion: string; inspect: string }[] = [
  {
    beat: "Parked under the oak on 1488. Stanley on the dash.",
    motion: "He shuts the door and doesn't look at the camera.",
    inspect: "Oak. Dash cup. Dent on the rear passenger door.",
  },
  {
    beat: "Oak still in frame. He left the Stanley in the cupholder.",
    motion: "He reaches for the Stanley, stops, looks once.",
    inspect: "Same oak. Same dent. Thumb on the lid.",
  },
  {
    beat: "He's scraping grass off the trimmer housing.",
    motion: "One scrape. That's the clip.",
    inspect: "Grass on the housing. Hands. Dent.",
  },
  {
    beat: "Paper square in the window. $350. Live Friday.",
    motion: "He tapes it, steps back.",
    inspect: "Handwriting. Tape wrinkle. Oak shadow on the hood.",
  },
  {
    beat: "Rain. He waits in the cab. Oak dripping on the windshield.",
    motion: "Wiper once. He doesn't get out.",
    inspect: "Drip path. Stanley still in the cupholder.",
  },
  {
    beat: "Plaza. He sets the trimmer in the bed.",
    motion: "Sets it. Looks once.",
    inspect: "Hands on the shaft. Plaza tile. Dent.",
  },
  {
    beat: "Back at the oak. Dent's still there. That's the week.",
    motion: "He leans on the tailgate and that's it.",
    inspect: "Dent. Oak. Faded navy shirt, same as day one.",
  },
];

export function week(): Day[] {
  let residue: Residue[] = [{ id: "oak", object: "oak", lastSeen: "day 1" }];
  return DAYS.map((row, i) => {
    const n = i + 1;
    const copy =
      RAY.name +
      ", day " +
      n +
      ". " +
      row.beat +
      " Same white F-150. He'll say give me ten.";
    residue = [
      { id: "oak", object: "oak", lastSeen: "day " + n },
      { id: "dent", object: "dent", lastSeen: "day " + n },
    ];
    const episode: Episode = {
      n,
      when: "day " + n,
      beat: row.beat,
      residue,
      copy,
    };
    const shot: Shot = {
      set: "Kingwood. Live oak on 1488 in the left of frame. White F-150.",
      wardrobe: "Faded navy work shirt. Dent on the rear passenger door.",
      motion: row.motion,
      inspect: row.inspect,
      seconds: 9,
      phone: "No caption. No music.",
    };
    return { d: n, episode, shot };
  });
}

export function weekQc() {
  return week().map((day) => ({
    d: day.d,
    copy: day.episode.copy,
    shot: day.shot,
    qc: qcShot(day.shot),
  }));
}
