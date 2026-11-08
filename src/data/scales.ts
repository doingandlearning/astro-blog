// Scale and arpeggio requirements for Em's flashcards.
// To add a new instrument or grade: add an entry to `instruments` and a
// builder function below, then add it to the `scaleCards` array.

export type InstrumentId = "cello" | "piano" | "flute";

export interface Instrument {
  id: InstrumentId;
  label: string;
}

export interface ScaleCard {
  id: string;
  instrument: InstrumentId;
  group: string;
  title: string;
  details: { label: string; value: string }[];
}

export const instruments: Instrument[] = [
  { id: "cello", label: "Cello, Grade 5" },
  { id: "piano", label: "Piano, Grade 5" },
  { id: "flute", label: "Flute, Grade 7" },
];

type Detail = { label: string; value: string };

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/♭/g, "b")
    .replace(/♯/g, "sharp")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function make(
  instrument: InstrumentId,
  group: string,
  title: string,
  details: Detail[],
): ScaleCard {
  return { id: `${instrument}-${slug(title)}`, instrument, group, title, details };
}

// ---------------------------------------------------------------- Cello, Grade 5

function celloCards(): ScaleCard[] {
  const cards: ScaleCard[] = [];
  const scaleBow = "Separate bows or slurred (2 beats to a bow), examiner's choice";
  const scaleNotes = "Even notes or long tonic, candidate's choice";
  const arpBow = "Separate bows or slurred (3 notes to a bow), examiner's choice";
  const domBow = "Separate bows or slurred (4 notes to a bow), examiner's choice";
  const chromBow = "Separate bows or slurred (4 notes to a bow), examiner's choice";

  const scale = (key: string, quality: "major" | "minor", octaves: string) => {
    const details: Detail[] = [{ label: "Octaves", value: octaves }];
    if (quality === "minor") {
      details.push({ label: "Form", value: "Harmonic or melodic, candidate's choice" });
    }
    details.push({ label: "Bowing", value: scaleBow }, { label: "Notes", value: scaleNotes });
    cards.push(make("cello", "Scales", `${key} ${quality} scale`, details));
  };
  ["E♭", "E", "A♭", "A"].forEach((k) => scale(k, "major", "2"));
  ["E", "G", "A"].forEach((k) => scale(k, "minor", "2"));
  scale("C", "major", "3");

  const arp = (key: string, quality: "major" | "minor", octaves: string) =>
    cards.push(
      make("cello", "Arpeggios", `${key} ${quality} arpeggio`, [
        { label: "Octaves", value: octaves },
        { label: "Bowing", value: arpBow },
        { label: "Notes", value: "Even notes" },
      ]),
    );
  ["E♭", "E", "A♭", "A"].forEach((k) => arp(k, "major", "2"));
  ["E", "G", "A"].forEach((k) => arp(k, "minor", "2"));
  arp("C", "major", "3");

  const dom = (key: string, octaves: string) =>
    cards.push(
      make("cello", "Dominant sevenths", `Dominant seventh in ${key}`, [
        { label: "Octaves", value: octaves },
        { label: "Ending", value: "Resolving on the tonic" },
        { label: "Bowing", value: domBow },
        { label: "Notes", value: "Even notes" },
      ]),
    );
  dom("B♭", "1");
  dom("F", "2");
  dom("G", "2");

  ["C", "G"].forEach((k) =>
    cards.push(
      make("cello", "Diminished sevenths", `Diminished seventh starting on ${k} (open string)`, [
        { label: "Octaves", value: "1" },
        { label: "Bowing", value: "Separate bows" },
        { label: "Notes", value: "Even notes" },
      ]),
    ),
  );

  ["C", "C♯", "D"].forEach((k) =>
    cards.push(
      make("cello", "Chromatic scales", `Chromatic scale starting on ${k}`, [
        { label: "Octaves", value: "2" },
        { label: "Bowing", value: chromBow },
        { label: "Notes", value: "Even notes" },
      ]),
    ),
  );
  return cards;
}

// ---------------------------------------------------------------- Piano, Grade 5

function pianoCards(): ScaleCard[] {
  const cards: ScaleCard[] = [];
  const form = { label: "Form", value: "Harmonic or melodic, candidate's choice" };

  const similar = (key: string, quality: "major" | "minor") =>
    cards.push(
      make("piano", "Scales (similar motion)", `${key} ${quality} scale`, [
        { label: "Octaves", value: "2" },
        ...(quality === "minor" ? [form] : []),
        { label: "Touch", value: "Legato" },
        { label: "Hands", value: "Together" },
      ]),
    );
  ["A", "E", "B", "F♯", "D♭"].forEach((k) => similar(k, "major"));
  ["F♯", "C♯", "G♯", "E♭", "B♭"].forEach((k) => similar(k, "minor"));

  cards.push(
    make("piano", "Staccato scales", "A♭ major scale (staccato)", [
      { label: "Octaves", value: "2" },
      { label: "Touch", value: "Staccato" },
      { label: "Hands", value: "Separately" },
    ]),
    make("piano", "Staccato scales", "F minor scale (staccato)", [
      { label: "Octaves", value: "2" },
      form,
      { label: "Touch", value: "Staccato" },
      { label: "Hands", value: "Separately" },
    ]),
    make("piano", "Contrary-motion scales", "D♭ major scale (contrary motion)", [
      { label: "Octaves", value: "2" },
      { label: "Touch", value: "Legato" },
      { label: "Hands", value: "Starting on the tonic (unison)" },
    ]),
    make("piano", "Contrary-motion scales", "C♯ harmonic minor scale (contrary motion)", [
      { label: "Octaves", value: "2" },
      { label: "Touch", value: "Legato" },
      { label: "Hands", value: "Starting on the tonic (unison)" },
    ]),
    make("piano", "Chromatic contrary-motion scale", "Chromatic contrary-motion scale", [
      { label: "Start", value: "F♯ (left hand) and A♯ (right hand)" },
      { label: "Octaves", value: "2" },
      { label: "Touch", value: "Legato" },
      { label: "Hands", value: "Starting a major third apart" },
    ]),
  );

  const arp = (key: string, quality: "major" | "minor") =>
    cards.push(
      make("piano", "Arpeggios", `${key} ${quality} arpeggio`, [
        { label: "Octaves", value: "2" },
        { label: "Touch", value: "Legato" },
        { label: "Hands", value: "Together" },
      ]),
    );
  ["A", "E", "B", "F♯", "A♭", "D♭"].forEach((k) => arp(k, "major"));
  ["F♯", "C♯", "G♯", "E♭", "F", "B♭"].forEach((k) => arp(k, "minor"));

  cards.push(
    make("piano", "Diminished seventh", "Diminished seventh starting on B", [
      { label: "Octaves", value: "2" },
      { label: "Touch", value: "Legato" },
      { label: "Hands", value: "Separately" },
    ]),
  );
  return cards;
}

// ---------------------------------------------------------------- Flute, Grade 7

function fluteCards(): ScaleCard[] {
  const cards: ScaleCard[] = [];
  const articulation: Detail = {
    label: "Articulation",
    value: "A balance of legato-tongued, staccato and slurred is asked for",
  };
  const base = (): Detail[] => [{ label: "Octaves", value: "2" }, articulation];

  // "D♭/C♯" in the syllabus: D♭ major and C♯ minor.
  const majors = ["D♭", "E♭", "G", "A", "B"];
  const minors = ["C♯", "E♭", "G", "A", "B"];

  majors.forEach((k) =>
    cards.push(make("flute", "Scales", `${k} major scale`, base())),
  );
  minors.forEach((k) =>
    cards.push(
      make("flute", "Scales", `${k} minor scale`, [
        { label: "Octaves", value: "2" },
        { label: "Form", value: "Both harmonic and melodic" },
        articulation,
      ]),
    ),
  );

  cards.push(
    make("flute", "Extended-range scale", "F major extended-range scale", [
      { label: "Notation", value: "Printed in full in the Grade 7 syllabus book (ascending then descending)" },
      articulation,
    ]),
    make("flute", "Scale in thirds", "D major scale in thirds", base()),
  );

  ["C♯", "G", "A", "B"].forEach((k) =>
    cards.push(make("flute", "Chromatic scales", `Chromatic scale starting on ${k}`, base())),
  );

  majors.forEach((k) =>
    cards.push(make("flute", "Arpeggios", `${k} major arpeggio`, base())),
  );
  minors.forEach((k) =>
    cards.push(make("flute", "Arpeggios", `${k} minor arpeggio`, base())),
  );

  ["F♯", "C", "D", "E"].forEach((k) =>
    cards.push(
      make("flute", "Dominant sevenths", `Dominant seventh in ${k}`, [
        { label: "Octaves", value: "2" },
        { label: "Ending", value: "Resolving on the tonic" },
        articulation,
      ]),
    ),
  );

  ["C♯", "G", "A", "B"].forEach((k) =>
    cards.push(make("flute", "Diminished sevenths", `Diminished seventh starting on ${k}`, base())),
  );
  return cards;
}

export const scaleCards: ScaleCard[] = [...celloCards(), ...pianoCards(), ...fluteCards()];
