import "./style.css";

type Category = { id: string; name: string; icon: string; description: string };
type Exercise = { id: string; name: string; muscle: string; categoryId: string; icon: string };
type SetEntry = { kg: number; reps: number };
type WorkoutItem = { exerciseName: string; sets: SetEntry[] };
type Session = { date: string; items: WorkoutItem[] };
type AppData = { favorites: string[]; customExercises: Exercise[]; sessions: Session[] };
type BackupDocument = { format: "gym-notes-backup"; version: 1; exportedAt: string; data: AppData };
type Page = "home" | "categories" | "exercises" | "workout" | "history" | "favorites";
type FilterType = "equipment" | "muscle";

const categories: Category[] = [
  { id: "dumbbells", name: "Haltères", icon: "🏋️", description: "Poids libres" },
  { id: "barbell", name: "Barre", icon: "🏋️‍♂️", description: "Barre et disques" },
  { id: "machine", name: "Machine", icon: "⚙️", description: "Machines guidées" },
  { id: "bodyweight", name: "Sans équipement", icon: "🤸", description: "Poids du corps" },
  { id: "cables", name: "Câbles", icon: "🔗", description: "Poulies et câbles" },
  { id: "kettlebell", name: "Kettlebell", icon: "🔔", description: "Poids russes" },
];
const muscleGroups: Category[] = [
  { id: "Pectoraux", name: "Pectoraux", icon: "🫁", description: "Poitrine" },
  { id: "Dos & trapèzes", name: "Dos & trapèzes", icon: "🧍", description: "Largeur et épaisseur" },
  { id: "Épaules", name: "Épaules", icon: "🙌", description: "Deltoïdes" },
  { id: "Biceps", name: "Biceps", icon: "💪", description: "Avant du bras" },
  { id: "Triceps", name: "Triceps", icon: "💪", description: "Arrière du bras" },
  { id: "Avant-bras", name: "Avant-bras", icon: "✊", description: "Poigne et poignets" },
  { id: "Quadriceps", name: "Quadriceps", icon: "🦵", description: "Avant des cuisses" },
  { id: "Ischio-jambiers & fessiers", name: "Ischio-jambiers & fessiers", icon: "🏃", description: "Arrière des jambes" },
  { id: "Mollets", name: "Mollets", icon: "🦶", description: "Bas des jambes" },
  { id: "Abdominaux & gainage", name: "Abdominaux & gainage", icon: "🧘", description: "Centre du corps" },
];
const exercises: Exercise[] = [
  ["Développé couché", "Poitrine", "barbell", "🛏️"], ["Presse à jambes", "Jambes", "machine", "🦵"],
  ["Tirage vertical", "Dos", "cables", "↘️"], ["Curl biceps", "Bras", "dumbbells", "💪"],
  ["Élévations latérales", "Épaules", "dumbbells", "🙌"], ["Squat", "Jambes", "barbell", "🏋️"],
  ["Pompes", "Poitrine", "bodyweight", "🤸"], ["Soulevé de terre", "Dos", "barbell", "🏋️"],
  ["Extension triceps", "Bras", "cables", "🔗"], ["Fentes", "Jambes", "bodyweight", "🦵"],
  ["Développé épaules", "Épaules", "machine", "🙌"], ["Goblet squat", "Jambes", "kettlebell", "🔔"],
].map(([name, muscle, categoryId, icon], index) => ({ id: `builtin-${index}`, name: name!, muscle: muscle!, categoryId: categoryId!, icon: icon! }));

// Noms de la banque Espace Musculation; le matériel est classé pour les filtres de GYM NOTES.
const sourceExercises: Exercise[] = [
  ["Développé couché", "Pectoraux", "barbell", "🛏️"],
  ["Développé incliné", "Pectoraux", "barbell", "🏋️"],
  ["Développé décliné", "Pectoraux", "barbell", "🏋️"],
  ["Écartés haltères", "Pectoraux", "dumbbells", "🏋️"],
  ["Écartés poulies", "Pectoraux", "cables", "🔗"],
  ["Pec-deck", "Pectoraux", "machine", "⚙️"],
  ["Pompes", "Pectoraux", "bodyweight", "🤸"],
  ["Traction", "Dos & trapèzes", "bodyweight", "🤸"],
  ["Rowing barre", "Dos & trapèzes", "barbell", "🏋️"],
  ["Soulevé de terre", "Dos & trapèzes", "barbell", "🏋️"],
  ["Shrug", "Dos & trapèzes", "dumbbells", "🏋️"],
  ["Tirage vertical", "Dos & trapèzes", "cables", "🔗"],
  ["Tirage horizontal", "Dos & trapèzes", "cables", "🔗"],
  ["Extension lombaire", "Dos & trapèzes", "bodyweight", "🤸"],
  ["Pullover", "Dos & trapèzes", "dumbbells", "🏋️"],
  ["Shrug incliné haltères", "Dos & trapèzes", "dumbbells", "🏋️"],
  ["Rowing barre T", "Dos & trapèzes", "barbell", "🏋️"],
  ["Rowing haltère", "Dos & trapèzes", "dumbbells", "🏋️"],
  ["Tirage horizontal haut", "Dos & trapèzes", "cables", "🔗"],
  ["Rowing deux haltères", "Dos & trapèzes", "dumbbells", "🏋️"],
  ["Extension lombaire couché", "Dos & trapèzes", "bodyweight", "🤸"],
  ["Développé épaules", "Épaules", "dumbbells", "🏋️"],
  ["Élévation latérale", "Épaules", "dumbbells", "🏋️"],
  ["Élévation frontale", "Épaules", "dumbbells", "🏋️"],
  ["Oiseau haltères", "Épaules", "dumbbells", "🏋️"],
  ["Tirage menton", "Épaules", "barbell", "🏋️"],
  ["Rowing assis", "Épaules", "machine", "⚙️"],
  ["Oiseau à la poulie", "Épaules", "cables", "🔗"],
  ["Élévation frontale inclinée", "Épaules", "dumbbells", "🏋️"],
  ["Curl à la barre", "Biceps", "barbell", "🏋️"],
  ["Curl haltères", "Biceps", "dumbbells", "🏋️"],
  ["Curl poulie", "Biceps", "cables", "🔗"],
  ["Dips", "Triceps", "bodyweight", "🤸"],
  ["Kickback", "Triceps", "dumbbells", "🏋️"],
  ["Développé à la barre", "Triceps", "barbell", "🏋️"],
  ["Extension assis", "Triceps", "dumbbells", "🏋️"],
  ["Extension couché", "Triceps", "barbell", "🏋️"],
  ["Dips entre deux bancs", "Triceps", "bodyweight", "🤸"],
  ["Extension à la poulie", "Triceps", "cables", "🔗"],
  ["Flexion aux haltères", "Avant-bras", "dumbbells", "🏋️"],
  ["Flexion barre pronation", "Avant-bras", "barbell", "🏋️"],
  ["Flexion barre supination", "Avant-bras", "barbell", "🏋️"],
  ["Squat", "Quadriceps", "barbell", "🏋️"],
  ["Leg extension", "Quadriceps", "machine", "⚙️"],
  ["Hack squat", "Quadriceps", "machine", "⚙️"],
  ["Presse à cuisses", "Quadriceps", "machine", "⚙️"],
  ["Squat barre guidée", "Quadriceps", "machine", "⚙️"],
  ["Montée sur banc", "Quadriceps", "bodyweight", "🤸"],
  ["Sissy squat", "Quadriceps", "bodyweight", "🤸"],
  ["Soulevé de terre jambes tendues", "Ischio-jambiers & fessiers", "barbell", "🏋️"],
  ["Leg curl debout", "Ischio-jambiers & fessiers", "machine", "⚙️"],
  ["Good morning", "Ischio-jambiers & fessiers", "barbell", "🏋️"],
  ["Leg curl assis", "Ischio-jambiers & fessiers", "machine", "⚙️"],
  ["Fentes", "Ischio-jambiers & fessiers", "bodyweight", "🤸"],
  ["Mollets à la presse", "Mollets", "machine", "⚙️"],
  ["Élévation à 45°", "Mollets", "machine", "⚙️"],
  ["Mollets assis", "Mollets", "machine", "⚙️"],
  ["Mollets debout", "Mollets", "bodyweight", "🤸"],
  ["Crunch", "Abdominaux & gainage", "bodyweight", "🤸"],
  ["Crunch à la poulie", "Abdominaux & gainage", "cables", "🔗"],
  ["Gainage", "Abdominaux & gainage", "bodyweight", "🤸"],
  ["Relevés de jambes", "Abdominaux & gainage", "bodyweight", "🤸"],
  ["Flexions latérales", "Abdominaux & gainage", "dumbbells", "🏋️"],
  ["Rotation avec bâton", "Abdominaux & gainage", "bodyweight", "🤸"],
].map(([name, muscle, categoryId, icon], index) => ({ id: `catalog-${index}`, name: name!, muscle: muscle!, categoryId: categoryId!, icon: icon! }));

const storageKey = "gym-notes-typescript";
const defaultData: AppData = { favorites: [], customExercises: [], sessions: [] };
function loadData(): AppData {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (saved && typeof saved === "object") return { ...defaultData, ...(saved as Partial<AppData>) };
  } catch { /* On repart avec des données vides si le stockage est illisible. */ }
  return { ...defaultData };
}
let data = loadData();
let page: Page = "home";
let selectedCategoryId = "";
let selectedFilterType: FilterType = "muscle";
let categoryMode: FilterType = "muscle";
let selectedEquipmentId = "";
let selectedExercise: Exercise | undefined;
let searchText = "";
let weightKg = 20;
const view = document.querySelector<HTMLElement>("#view")!;
const toastElement = document.querySelector<HTMLElement>("#toast")!;
const allExercises = (): Exercise[] => {
  const knownNames = new Set(exercises.map(exercise => exercise.name.toLocaleLowerCase("fr-CA")));
  const additions = sourceExercises.filter(exercise => !knownNames.has(exercise.name.toLocaleLowerCase("fr-CA")));
  return [...exercises, ...additions, ...data.customExercises];
};
const exerciseIllustrationSlugs: Record<string, string> = {
  "developpe couche": "bench-press", "presse a jambes": "leg-press", "tirage vertical": "lat-pulldown",
  "curl biceps": "bicep-curl", "elevations laterales": "lateral-raise", squat: "squat", pompes: "push-up",
  "souleve de terre": "deadlift", "extension triceps": "tricep-pushdown", fentes: "walking-lunge",
  "developpe epaules": "overhead-press", "goblet squat": "goblet-squat", "developpe incline": "incline-bench-press",
  "developpe decline": "decline-bench-press", "ecartes halteres": "dumbbell-fly", "ecartes poulies": "cable-fly",
  "pec-deck": "pec-deck", traction: "pull-up", "rowing barre": "barbell-row", shrug: "dumbbell-shrug",
  "tirage horizontal": "seated-row", "extension lombaire": "back-extension", "shrug incline halteres": "dumbbell-shrug",
  "rowing barre t": "t-bar-row", "rowing haltere": "one-arm-dumbbell-row", "tirage horizontal haut": "seated-row",
  "rowing deux halteres": "dumbbell-bent-over-row", "extension lombaire couche": "reverse-hyperextension",
  "elevation laterale": "lateral-raise", "elevation frontale": "front-raise", "oiseau halteres": "rear-delt-fly",
  "tirage menton": "upright-row", "rowing assis": "seated-row", "oiseau a la poulie": "cable-rear-delt-fly",
  "elevation frontale inclinee": "front-raise", "curl a la barre": "bicep-curl", "curl halteres": "bicep-curl",
  "curl poulie": "cable-curl", dips: "dip", kickback: "tricep-kickback", "developpe a la barre": "close-grip-bench-press",
  "extension assis": "dumbbell-overhead-tricep-extension", "dips entre deux bancs": "bench-dip",
  "extension a la poulie": "tricep-pushdown", "flexion aux halteres": "wrist-curl", "flexion barre pronation": "reverse-curl",
  "flexion barre supination": "bicep-curl", "leg extension": "leg-extension", "hack squat": "hack-squat",
  "presse a cuisses": "leg-press", "squat barre guidee": "smith-machine-squat", "montee sur banc": "step-up",
  "sissy squat": "sissy-squat", "souleve de terre jambes tendues": "romanian-deadlift", "leg curl debout": "leg-curl",
  "good morning": "good-morning", "leg curl assis": "seated-leg-curl", "mollets a la presse": "leg-press-calf-raise",
  "elevation a 45": "standing-calf-raise", "mollets assis": "seated-calf-raise", "mollets debout": "standing-calf-raise",
  crunch: "crunch", "crunch a la poulie": "cable-crunch", gainage: "plank", "releves de jambes": "lying-leg-raise",
  "flexions laterales": "dumbbell-side-bend", "rotation avec baton": "russian-twist",
};
function illustrationSlug(exercise: Exercise): string | undefined {
  const name = exercise.name.toLocaleLowerCase("fr-CA").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return exerciseIllustrationSlugs[name];
}
function exerciseArtwork(exercise: Exercise, frame: number): string | undefined {
  const slug = illustrationSlug(exercise);
  return slug ? `${import.meta.env.BASE_URL}exercises/${slug}/frame-${frame}.png` : undefined;
}
function exerciseThumbnail(exercise: Exercise): string {
  const image = exerciseArtwork(exercise, 1);
  return image ? `<img class="exercise-thumb" src="${image}" alt="Illustration de ${safe(exercise.name)}" loading="lazy">` : exerciseSilhouette(exercise);
}
function muscleGroupFor(exercise: Exercise): string {
  if (muscleGroups.some(group => group.id === exercise.muscle)) return exercise.muscle;
  const oldGroup = exercise.muscle.toLocaleLowerCase("fr-CA");
  if (oldGroup === "poitrine") return "Pectoraux";
  if (oldGroup === "dos") return "Dos & trapèzes";
  if (oldGroup === "épaules") return "Épaules";
  if (oldGroup === "bras") return exercise.name.toLocaleLowerCase("fr-CA").includes("curl") ? "Biceps" : "Triceps";
  if (oldGroup === "jambes") return /fente/i.test(exercise.name) ? "Ischio-jambiers & fessiers" : "Quadriceps";
  return exercise.muscle;
}
const saveData = (): void => localStorage.setItem(storageKey, JSON.stringify(data));
const format = (value: number): string => new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 1 }).format(value);
const pounds = (kg: number): number => kg * 2.20462262;
const safe = (value: string): string => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

function showToast(message: string): void {
  toastElement.textContent = message;
  toastElement.style.display = "block";
  window.setTimeout(() => { toastElement.style.display = "none"; }, 1800);
}
function go(next: Page): void { page = next; render(); }
function back(): void { go(page === "workout" ? "exercises" : page === "exercises" ? "categories" : "home"); }
function header(title: string, subtitle: string): string {
  return `<div class="screenhead"><button class="back" data-action="back" aria-label="Retour">←</button><div><h1>${safe(title)}</h1><p>${safe(subtitle)}</p></div></div>`;
}
function categoryCard(category: Category, filterType: FilterType = "equipment"): string {
  return `<button class="category" data-filter-id="${safe(category.id)}" data-filter-type="${filterType}"><span class="emoji">${category.icon}</span><b>${safe(category.name)}</b><small>${safe(category.description)}</small></button>`;
}
function exerciseSilhouette(exercise: Exercise): string {
  const name = exercise.name.toLocaleLowerCase("fr-CA");
  // Des poses dessinées en SVG, choisies selon le mouvement pour rester nettes sur téléphone.
  let pose = "press";
  if (/traction|tirage vertical/.test(name)) pose = "pullup";
  else if (/rowing|tirage horizontal/.test(name)) pose = "row";
  else if (/squat|fente|montée sur banc|hack|presse à jambes|presse à cuisses|leg extension|leg curl/.test(name)) pose = "legs";
  else if (/soulevé de terre|good morning|extension lombaire/.test(name)) pose = "hinge";
  else if (/crunch|gainage|relevés de jambes|flexions latérales|rotation/.test(name)) pose = "core";
  else if (/curl|flexion aux haltères/.test(name)) pose = "curl";
  else if (/élévation|oiseau|tirage menton/.test(name)) pose = "raise";
  else if (/extension triceps|extension assis|extension couché|extension à la poulie|kickback|dips/.test(name)) pose = "triceps";
  else if (/écartés|pec-deck|pompes/.test(name)) pose = "chest";

  const poses: Record<string, string> = {
    press: `<path d="M15 22h50"/><circle cx="40" cy="21" r="6"/><path d="M40 28v17m0-12-12-8m12 8 12-8M40 45 28 57m12-12 12 12M13 18v8m54-8v8"/><path d="M22 14h36"/>`,
    chest: `<path d="M12 43h56"/><circle cx="28" cy="32" r="5"/><path d="M33 34h17m-9 0-12 11m21-11 12 11M38 34l-8-13m12 13 9-13"/><path d="M25 17h30"/>`,
    pullup: `<path d="M14 11h52M21 11v48m38-48v48"/><circle cx="40" cy="23" r="5"/><path d="M40 29v15m0-12-11-9m11 9 11-9M40 44 31 57m9-13 9 13"/>`,
    row: `<path d="M11 18h58"/><circle cx="37" cy="24" r="5"/><path d="m34 30-9 12 14 5m-14-5-12 12m26-7 12 10m-14-10 8-10 13-7m-13 7 10 5"/><path d="M13 49h13"/>`,
    legs: `<circle cx="39" cy="14" r="5"/><path d="m38 20-5 15 12 8m-12-8-11 9m11-9 12-2m0 10-5 16m5-16 13 12M18 17h44"/>`,
    hinge: `<circle cx="49" cy="19" r="5"/><path d="m45 24-15 12 13 8m-13-8-13 6m13-6-7 19m7-19 16 12 12 9m-12-9 7-11"/><path d="M12 54h56"/>`,
    core: `<path d="M13 50h54"/><circle cx="28" cy="34" r="5"/><path d="m33 36 17 3 9 9m-25-12-10 12m26-9 5-13m-5 13-8 10"/>`,
    curl: `<circle cx="37" cy="17" r="5"/><path d="M37 23v19m0-12-10 9m10-9 10-5m-10 17-11 14m11-14 11 14m-21-18 7-7m18-6-4-7"/><path d="M49 9v14m-4-11h8"/>`,
    raise: `<circle cx="39" cy="17" r="5"/><path d="M39 23v21m0-15-18-8m18 8 18-8M39 44 27 58m12-14 12 14"/><path d="M15 17h8m34 0h8"/>`,
    triceps: `<circle cx="39" cy="16" r="5"/><path d="M39 22v22m0-16-13 5 10 8m3-13 12 7m-12 7-12 14m12-14 12 14"/><path d="M51 14v13m-4-10h8"/>`,
  };
  return `<svg class="exercise-silhouette" viewBox="0 0 80 68" role="img" aria-label="Silhouette : ${safe(exercise.name)}" focusable="false">${poses[pose]}</svg>`;
}
function exerciseCard(exercise: Exercise): string {
  const favorite = data.favorites.includes(exercise.id);
  const category = categories.find(item => item.id === exercise.categoryId);
  return `<div class="card row"><div class="thumb">${exerciseThumbnail(exercise)}</div><div class="grow" data-exercise="${exercise.id}" style="cursor:pointer"><h3>${safe(exercise.name)}</h3><span class="muted">${safe(muscleGroupFor(exercise))} · ${category?.name ?? "Autre"}</span></div><button class="textbutton" data-favorite="${exercise.id}" aria-label="Favori">${favorite ? "⭐" : "☆"}</button><button class="arrow" data-exercise="${exercise.id}" aria-label="Ouvrir">›</button></div>`;
}
function home(): string {
  const last = data.sessions.at(-1);
  const today = new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" }).format(new Date()).toUpperCase();
  return `<div class="eyebrow">${today}</div><h1 class="heading">Prêt à bouger ?</h1><p class="sub">Une série à la fois. Ta progression t’attend.</p><div class="hero"><div class="eyebrow">${last ? "DERNIÈRE SÉANCE" : "TA SÉANCE DU JOUR"}</div><h2>${last ? safe(last.date) : "On commence ?"}</h2><p>${last ? `${last.items.reduce((total, item) => total + item.sets.length, 0)} séries enregistrées` : "Choisis un exercice et note tes séries."}</p><button class="button" data-action="start">＋ &nbsp; Commencer une séance</button></div><div class="sectionhead"><h3>Parties du corps</h3><button class="textbutton" data-page="categories">Tout voir →</button></div><div class="grid">${muscleGroups.slice(0, 4).map(group => categoryCard(group, "muscle")).join("")}</div><div class="sectionhead"><h3>Raccourcis</h3></div><div class="card row" data-page="favorites" style="cursor:pointer"><div class="thumb">⭐</div><div class="grow"><h3>Mes favoris</h3><span class="muted">${data.favorites.length} exercice(s) enregistré(s)</span></div><span class="muted">→</span></div>`;
}
function categoriesPage(): string {
  const filters = categoryMode === "muscle" ? muscleGroups : categories;
  const matchingExercises = searchText ? allExercises().filter(item => item.name.toLocaleLowerCase("fr-CA").includes(searchText.toLocaleLowerCase("fr-CA"))) : [];
  const cards = searchText ? matchingExercises.map(exerciseCard).join("") || `<div class="empty">Aucun exercice trouvé.</div>` : `<div class="grid">${filters.map(category => categoryCard(category, categoryMode)).join("")}</div>`;
  return `${header("Exercices", "Trouve par muscle ou par matériel")}<div class="filter-switch"><button data-filter-mode="muscle" class="${categoryMode === "muscle" ? "selected" : ""}">Groupe musculaire</button><button data-filter-mode="equipment" class="${categoryMode === "equipment" ? "selected" : ""}">Matériel</button></div><input class="search" data-search placeholder="⌕  Rechercher un exercice" value="${safe(searchText)}">${cards}<button class="button secondary full" data-action="add-exercise" style="margin-top:16px">＋ Créer un exercice</button>`;
}
function exerciseList(): string {
  const filter = (selectedFilterType === "muscle" ? muscleGroups : categories).find(item => item.id === selectedCategoryId);
  const list = allExercises().filter(item => (selectedFilterType === "muscle" ? muscleGroupFor(item) === selectedCategoryId && (!selectedEquipmentId || item.categoryId === selectedEquipmentId) : item.categoryId === selectedCategoryId) && item.name.toLocaleLowerCase("fr-CA").includes(searchText.toLocaleLowerCase("fr-CA")));
  const equipmentFilters = selectedFilterType === "muscle" ? `<div class="equipment-filters" aria-label="Filtrer par matériel"><button data-equipment-filter="" class="${selectedEquipmentId === "" ? "selected" : ""}">Tout</button>${categories.filter(item => ["dumbbells", "barbell", "machine", "bodyweight"].includes(item.id)).map(item => `<button data-equipment-filter="${item.id}" class="${selectedEquipmentId === item.id ? "selected" : ""}">${safe(item.name)}</button>`).join("")}</div>` : "";
  return `${header(filter?.name ?? "Exercices", selectedFilterType === "muscle" ? "Choisis le matériel, puis ton exercice" : "Exercices avec ce matériel")}<input class="search" data-search placeholder="⌕  Rechercher" value="${safe(searchText)}">${equipmentFilters}<div class="sectionhead"><h3>Exercices</h3><button class="textbutton" data-action="add-exercise">＋ Ajouter</button></div>${list.map(exerciseCard).join("") || `<div class="empty">Aucun exercice trouvé avec ce matériel.</div>`}`;
}
function workoutPage(): string {
  const exercise = selectedExercise;
  if (!exercise) return "";
  const history = data.sessions.flatMap(session => session.items).filter(item => item.exerciseName === exercise.name);
  const previous = history.at(-1);
  const rows = Array.from({ length: Math.max(3, previous?.sets.length ?? 0) }, (_, index) => {
    const set = previous?.sets[index];
    return `<div class="setrow"><span class="setnum">${index + 1}</span><input data-set-kg type="number" step="0.1" inputmode="decimal" value="${set?.kg ?? weightKg}" aria-label="Poids en kg"><input data-set-reps type="number" inputmode="numeric" value="${set?.reps ?? 10}" aria-label="Répétitions"></div>`;
  }).join("");
  const frames = [1, 2, 3].map((frame, index) => {
    const image = exerciseArtwork(exercise, frame);
    return image ? `<div class="exercise-frame"><img src="${image}" alt="${safe(exercise.name)} — étape ${index + 1}" loading="lazy"><span>${["Départ", "Mouvement", "Retour"][index]}</span></div>` : "";
  }).join("");
  const favoriteButton = `<button class="textbutton" data-favorite="${exercise.id}" aria-label="Favori">${data.favorites.includes(exercise.id) ? "⭐" : "☆"}</button>`;
  const illustrationPanel = frames
    ? `<div class="card exercise-demo"><div class="sectionhead" style="margin-top:0"><div><h3>${safe(exercise.name)}</h3><span class="muted">Les étapes du mouvement</span></div>${favoriteButton}</div><div class="exercise-frames">${frames}</div><a class="art-credit" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">Illustrations : Bryl Lim / Everkinetic · CC BY-SA 4.0</a></div>`
    : `<div class="card row"><div class="thumb">${exerciseSilhouette(exercise)}</div><div class="grow"><h3>${safe(exercise.name)}</h3><span class="muted">${previous ? "Dernière séance · valeurs préremplies" : "Ajoute tes séries ci-dessous"}</span></div>${favoriteButton}</div>`;
  return `${header(exercise.name, "Nouvelle séance")}${illustrationPanel}<div class="card"><div class="sectionhead" style="margin-top:0"><h3>Poids de la série</h3><span class="tag">KG + LB</span></div><div class="units"><div class="unit"><span class="inputlabel">Kilogrammes</span><strong data-kg-out>${format(weightKg)} kg</strong></div><div class="unit"><span class="inputlabel">Livres</span><strong data-lb-out>${format(pounds(weightKg))} lb</strong></div></div><div class="units"><label><span class="inputlabel">Entrer kg</span><input data-weight-kg type="number" step="0.1" inputmode="decimal" value="${weightKg}"></label><label><span class="inputlabel">Ou entrer lb</span><input data-weight-lb type="number" step="0.1" inputmode="decimal" placeholder="${format(pounds(weightKg))}"></label></div></div><div class="card"><div class="sectionhead" style="margin-top:0"><h3>Séries</h3><button class="textbutton" data-action="add-set">＋ Ajouter une série</button></div><div data-sets>${rows}</div></div><button class="button full" data-action="save-workout">✓ &nbsp; Enregistrer la séance</button>`;
}
function historyPage(): string {
  const sessions = [...data.sessions].reverse();
  const content = sessions.map(session => `<div class="card"><div class="historyrow"><h3>${safe(session.date)}</h3><span class="tag">${session.items.reduce((total, item) => total + item.sets.length, 0)} séries</span></div>${session.items.map(item => `<div class="historyrow"><div><b>${safe(item.exerciseName)}</b><div class="muted">${item.sets.map(set => `${format(set.kg)} kg / ${format(pounds(set.kg))} lb × ${set.reps}`).join(" · ")}</div></div></div>`).join("")}</div>`).join("");
  return `${header("Historique", "Tes séances enregistrées")}<div class="card backup-card"><h3>Garder une copie de tes données</h3><p class="muted">Enregistre un fichier sur ton téléphone pour pouvoir retrouver tes séances plus tard.</p><button class="button full" data-action="export-backup">⬇ &nbsp; Sauvegarder dans Fichiers</button><button class="button secondary full" data-action="choose-backup" style="margin-top:9px">↥ &nbsp; Restaurer depuis un fichier</button><input data-backup-file class="file-picker" type="file" accept=".json,application/json" aria-label="Choisir une sauvegarde GYM NOTES"></div>${content || `<div class="empty">Aucune séance pour le moment. Enregistre ton premier entraînement pour voir ta progression ici.</div>`}`;
}
function render(): void {
  document.querySelectorAll<HTMLButtonElement>(".tabs button").forEach(button => button.classList.toggle("active", button.dataset.page === (page === "exercises" ? "categories" : page)));
  switch (page) {
    case "home": view.innerHTML = home(); break;
    case "categories": view.innerHTML = categoriesPage(); break;
    case "exercises": view.innerHTML = exerciseList(); break;
    case "workout": view.innerHTML = workoutPage(); break;
    case "history": view.innerHTML = historyPage(); break;
    case "favorites": view.innerHTML = `${header("Mes favoris", "Tes exercices fréquents")}${allExercises().filter(item => data.favorites.includes(item.id)).map(exerciseCard).join("") || `<div class="empty">Ajoute un exercice avec ☆ pour le retrouver ici.</div>`}`; break;
  }
}
function toggleFavorite(id: string): void {
  data.favorites = data.favorites.includes(id) ? data.favorites.filter(item => item !== id) : [...data.favorites, id];
  saveData(); render();
}
function selectExercise(id: string): void {
  selectedExercise = allExercises().find(item => item.id === id);
  if (selectedExercise) { weightKg = data.sessions.flatMap(session => session.items).filter(item => item.exerciseName === selectedExercise?.name).at(-1)?.sets[0]?.kg ?? 20; go("workout"); }
}
function addCustomExercise(): void {
  const name = window.prompt("Nom de l’exercice :")?.trim();
  if (!name) return;
  const defaultMuscle = page === "exercises" && selectedFilterType === "muscle" ? selectedCategoryId : "Autre";
  const muscle = window.prompt("Groupe musculaire :", defaultMuscle)?.trim() || defaultMuscle;
  const categoryId = page === "exercises" && selectedFilterType === "equipment" ? selectedCategoryId : "bodyweight";
  data.customExercises.push({ id: `custom-${Date.now()}`, name, muscle, categoryId, icon: categories.find(item => item.id === categoryId)?.icon ?? "🏋️" });
  saveData(); showToast("Exercice ajouté"); render();
}
function addSet(): void {
  const holder = view.querySelector<HTMLElement>("[data-sets]");
  if (!holder) return;
  const index = holder.querySelectorAll("[data-set-kg]").length + 1;
  holder.insertAdjacentHTML("beforeend", `<div class="setrow"><span class="setnum">${index}</span><input data-set-kg type="number" step="0.1" inputmode="decimal" value="${weightKg}" aria-label="Poids en kg"><input data-set-reps type="number" inputmode="numeric" value="10" aria-label="Répétitions"></div>`);
}
function saveWorkout(): void {
  if (!selectedExercise) return;
  const rows = [...view.querySelectorAll<HTMLElement>(".setrow")];
  const sets = rows.map(row => ({ kg: Number(row.querySelector<HTMLInputElement>("[data-set-kg]")?.value) || 0, reps: Number(row.querySelector<HTMLInputElement>("[data-set-reps]")?.value) || 0 }));
  const date = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  let session = data.sessions.at(-1);
  if (!session || session.date !== date) { session = { date, items: [] }; data.sessions.push(session); }
  session.items.push({ exerciseName: selectedExercise.name, sets });
  saveData(); showToast("Séance enregistrée ✓"); window.setTimeout(() => go("home"), 500);
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isBackupDocument(value: unknown): value is BackupDocument {
  if (!isRecord(value) || value.format !== "gym-notes-backup" || value.version !== 1 || typeof value.exportedAt !== "string" || !isRecord(value.data)) return false;
  const backupData = value.data;
  if (!Array.isArray(backupData.favorites) || !backupData.favorites.every(item => typeof item === "string")) return false;
  if (!Array.isArray(backupData.customExercises) || !backupData.sessions || !Array.isArray(backupData.sessions)) return false;
  const exercisesAreValid = backupData.customExercises.every((item: unknown) => isRecord(item)
    && ["id", "name", "muscle", "categoryId", "icon"].every(key => typeof item[key] === "string"));
  const sessionsAreValid = backupData.sessions.every((session: unknown) => isRecord(session)
    && typeof session.date === "string" && Array.isArray(session.items)
    && session.items.every((item: unknown) => isRecord(item) && typeof item.exerciseName === "string"
      && Array.isArray(item.sets) && item.sets.every((set: unknown) => isRecord(set)
        && typeof set.kg === "number" && Number.isFinite(set.kg) && typeof set.reps === "number" && Number.isFinite(set.reps))));
  return exercisesAreValid && sessionsAreValid;
}
async function exportBackup(): Promise<void> {
  const backup: BackupDocument = { format: "gym-notes-backup", version: 1, exportedAt: new Date().toISOString(), data };
  const fileName = `gym-notes-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([JSON.stringify(backup, null, 2)], fileName, { type: "application/json" });
  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "Sauvegarde GYM NOTES" });
      showToast("Choisis « Enregistrer dans Fichiers »");
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url; link.download = fileName; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Fichier de sauvegarde téléchargé");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    showToast("Impossible de créer la sauvegarde");
  }
}
async function restoreBackup(file: File | undefined): Promise<void> {
  if (!file) return;
  try {
    const parsed: unknown = JSON.parse(await file.text());
    if (!isBackupDocument(parsed)) throw new Error("invalid backup");
    if (!window.confirm("Restaurer cette sauvegarde remplacera les données actuelles de GYM NOTES sur cet appareil. Continuer ?")) return;
    data = parsed.data;
    saveData(); showToast("Sauvegarde restaurée ✓"); render();
  } catch {
    showToast("Ce fichier n’est pas une sauvegarde GYM NOTES valide");
  }
}

view.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
  const filterId = target.closest<HTMLElement>("[data-filter-id]")?.dataset.filterId;
  const filterType = target.closest<HTMLElement>("[data-filter-id]")?.dataset.filterType as FilterType | undefined;
  const filterMode = target.closest<HTMLElement>("[data-filter-mode]")?.dataset.filterMode as FilterType | undefined;
  const exerciseId = target.closest<HTMLElement>("[data-exercise]")?.dataset.exercise;
  const favoriteId = target.closest<HTMLElement>("[data-favorite]")?.dataset.favorite;
  const equipmentFilter = target.closest<HTMLElement>("[data-equipment-filter]")?.dataset.equipmentFilter;
  const nextPage = target.closest<HTMLElement>("[data-page]")?.dataset.page as Page | undefined;
  if (action === "back") back();
  else if (action === "start") go("categories");
  else if (action === "add-exercise") addCustomExercise();
  else if (action === "add-set") addSet();
  else if (action === "save-workout") saveWorkout();
  else if (action === "export-backup") void exportBackup();
  else if (action === "choose-backup") view.querySelector<HTMLInputElement>("[data-backup-file]")?.click();
  else if (filterMode) { categoryMode = filterMode; searchText = ""; render(); }
  else if (equipmentFilter !== undefined) { selectedEquipmentId = equipmentFilter; render(); }
  else if (favoriteId) toggleFavorite(favoriteId);
  else if (filterId && filterType) { selectedCategoryId = filterId; selectedFilterType = filterType; selectedEquipmentId = ""; searchText = ""; go("exercises"); }
  else if (exerciseId) selectExercise(exerciseId);
  else if (nextPage) go(nextPage);
});
view.addEventListener("change", event => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.matches("[data-backup-file]")) {
    void restoreBackup(target.files?.[0]);
    target.value = "";
  }
});
document.querySelectorAll<HTMLButtonElement>(".tabs button").forEach(button => button.addEventListener("click", () => go((button.dataset.page ?? "home") as Page)));
view.addEventListener("input", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.matches("[data-search]")) {
    searchText = target.value;
    const cursor = target.selectionStart;
    render();
    const input = view.querySelector<HTMLInputElement>("[data-search]");
    input?.focus(); if (cursor !== null) input?.setSelectionRange(cursor, cursor);
  } else if (target.matches("[data-weight-kg]")) {
    const value = Number(target.value); if (!Number.isFinite(value)) return;
    weightKg = value;
    view.querySelector<HTMLElement>("[data-kg-out]")!.textContent = `${format(weightKg)} kg`;
    view.querySelector<HTMLElement>("[data-lb-out]")!.textContent = `${format(pounds(weightKg))} lb`;
    view.querySelectorAll<HTMLInputElement>("[data-set-kg]").forEach(input => { input.value = String(weightKg); });
  } else if (target.matches("[data-weight-lb]")) {
    const value = Number(target.value); if (!Number.isFinite(value)) return;
    weightKg = value / 2.20462262;
    view.querySelector<HTMLElement>("[data-kg-out]")!.textContent = `${format(weightKg)} kg`;
    view.querySelector<HTMLElement>("[data-lb-out]")!.textContent = `${format(value)} lb`;
    view.querySelectorAll<HTMLInputElement>("[data-set-kg]").forEach(input => { input.value = String(weightKg); });
  }
});
render();


if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(error => console.error('Service worker registration failed:', error));
  });
}

