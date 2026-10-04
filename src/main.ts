import "./style.css";

type Category = { id: string; name: string; icon: string; description: string };
type Exercise = { id: string; name: string; muscle: string; categoryId: string; icon: string };
type SetEntry = { kg: number; reps: number };
type WorkoutItem = { exerciseName: string; sets: SetEntry[] };
type Session = { date: string; items: WorkoutItem[] };
type AppData = { favorites: string[]; customExercises: Exercise[]; sessions: Session[] };
type BackupDocument = { format: "gym-notes-backup"; version: 1; exportedAt: string; data: AppData };
type Page = "home" | "categories" | "exercises" | "workout" | "history" | "favorites";

const categories: Category[] = [
  { id: "dumbbells", name: "Haltères", icon: "🏋️", description: "Poids libres" },
  { id: "barbell", name: "Barre", icon: "🏋️‍♂️", description: "Barre et disques" },
  { id: "machine", name: "Machine", icon: "⚙️", description: "Machines guidées" },
  { id: "bodyweight", name: "Sans équipement", icon: "🤸", description: "Poids du corps" },
  { id: "cables", name: "Câbles", icon: "🔗", description: "Poulies et câbles" },
  { id: "kettlebell", name: "Kettlebell", icon: "🔔", description: "Poids russes" },
];
const exercises: Exercise[] = [
  ["Développé couché", "Poitrine", "barbell", "🛏️"], ["Presse à jambes", "Jambes", "machine", "🦵"],
  ["Tirage vertical", "Dos", "cables", "↘️"], ["Curl biceps", "Bras", "dumbbells", "💪"],
  ["Élévations latérales", "Épaules", "dumbbells", "🙌"], ["Squat", "Jambes", "barbell", "🏋️"],
  ["Pompes", "Poitrine", "bodyweight", "🤸"], ["Soulevé de terre", "Dos", "barbell", "🏋️"],
  ["Extension triceps", "Bras", "cables", "🔗"], ["Fentes", "Jambes", "bodyweight", "🦵"],
  ["Développé épaules", "Épaules", "machine", "🙌"], ["Goblet squat", "Jambes", "kettlebell", "🔔"],
].map(([name, muscle, categoryId, icon], index) => ({ id: `builtin-${index}`, name: name!, muscle: muscle!, categoryId: categoryId!, icon: icon! }));

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
let selectedExercise: Exercise | undefined;
let searchText = "";
let weightKg = 20;
const view = document.querySelector<HTMLElement>("#view")!;
const toastElement = document.querySelector<HTMLElement>("#toast")!;
const allExercises = (): Exercise[] => [...exercises, ...data.customExercises];
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
function categoryCard(category: Category): string {
  return `<button class="category" data-category="${category.id}"><span class="emoji">${category.icon}</span><b>${safe(category.name)}</b><small>${safe(category.description)}</small></button>`;
}
function exerciseCard(exercise: Exercise): string {
  const favorite = data.favorites.includes(exercise.id);
  const category = categories.find(item => item.id === exercise.categoryId);
  return `<div class="card row"><div class="thumb">${exercise.icon}</div><div class="grow" data-exercise="${exercise.id}" style="cursor:pointer"><h3>${safe(exercise.name)}</h3><span class="muted">${safe(exercise.muscle)} · ${category?.name ?? "Autre"}</span></div><button class="textbutton" data-favorite="${exercise.id}" aria-label="Favori">${favorite ? "⭐" : "☆"}</button><button class="arrow" data-exercise="${exercise.id}" aria-label="Ouvrir">›</button></div>`;
}
function home(): string {
  const last = data.sessions.at(-1);
  const today = new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" }).format(new Date()).toUpperCase();
  return `<div class="eyebrow">${today}</div><h1 class="heading">Prêt à bouger ?</h1><p class="sub">Une série à la fois. Ta progression t’attend.</p><div class="hero"><div class="eyebrow">${last ? "DERNIÈRE SÉANCE" : "TA SÉANCE DU JOUR"}</div><h2>${last ? safe(last.date) : "On commence ?"}</h2><p>${last ? `${last.items.reduce((total, item) => total + item.sets.length, 0)} séries enregistrées` : "Choisis un exercice et note tes séries."}</p><button class="button" data-action="start">＋ &nbsp; Commencer une séance</button></div><div class="sectionhead"><h3>Catégories</h3><button class="textbutton" data-page="categories">Tout voir →</button></div><div class="grid">${categories.slice(0, 4).map(categoryCard).join("")}</div><div class="sectionhead"><h3>Raccourcis</h3></div><div class="card row" data-page="favorites" style="cursor:pointer"><div class="thumb">⭐</div><div class="grow"><h3>Mes favoris</h3><span class="muted">${data.favorites.length} exercice(s) enregistré(s)</span></div><span class="muted">→</span></div>`;
}
function categoriesPage(): string {
  return `${header("Exercices", "Choisis une catégorie")}<input class="search" data-search placeholder="⌕  Rechercher un exercice" value="${safe(searchText)}"><div class="grid">${categories.map(categoryCard).join("")}</div><button class="button secondary full" data-action="add-exercise" style="margin-top:16px">＋ Créer un exercice</button>`;
}
function exerciseList(): string {
  const category = categories.find(item => item.id === selectedCategoryId);
  const list = allExercises().filter(item => item.categoryId === selectedCategoryId && item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
  return `${header(category?.name ?? "Exercices", "Choisis ton exercice")}<input class="search" data-search placeholder="⌕  Rechercher" value="${safe(searchText)}"><div class="sectionhead"><h3>Exercices</h3><button class="textbutton" data-action="add-exercise">＋ Ajouter</button></div>${list.map(exerciseCard).join("") || `<div class="empty">Aucun exercice trouvé.</div>`}`;
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
  return `${header(exercise.name, "Nouvelle séance")}<div class="card row"><div class="thumb">${exercise.icon}</div><div class="grow"><h3>${safe(exercise.name)}</h3><span class="muted">${previous ? "Dernière séance · valeurs préremplies" : "Ajoute tes séries ci-dessous"}</span></div><button class="textbutton" data-favorite="${exercise.id}">${data.favorites.includes(exercise.id) ? "⭐" : "☆"}</button></div><div class="card"><div class="sectionhead" style="margin-top:0"><h3>Poids de la série</h3><span class="tag">KG + LB</span></div><div class="units"><div class="unit"><span class="inputlabel">Kilogrammes</span><strong data-kg-out>${format(weightKg)} kg</strong></div><div class="unit"><span class="inputlabel">Livres</span><strong data-lb-out>${format(pounds(weightKg))} lb</strong></div></div><div class="units"><label><span class="inputlabel">Entrer kg</span><input data-weight-kg type="number" step="0.1" inputmode="decimal" value="${weightKg}"></label><label><span class="inputlabel">Ou entrer lb</span><input data-weight-lb type="number" step="0.1" inputmode="decimal" placeholder="${format(pounds(weightKg))}"></label></div></div><div class="card"><div class="sectionhead" style="margin-top:0"><h3>Séries</h3><button class="textbutton" data-action="add-set">＋ Ajouter une série</button></div><div data-sets>${rows}</div></div><button class="button full" data-action="save-workout">✓ &nbsp; Enregistrer la séance</button>`;
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
  const muscle = window.prompt("Groupe musculaire :", "Autre")?.trim() || "Autre";
  const categoryId = page === "exercises" ? selectedCategoryId : "bodyweight";
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
  const categoryId = target.closest<HTMLElement>("[data-category]")?.dataset.category;
  const exerciseId = target.closest<HTMLElement>("[data-exercise]")?.dataset.exercise;
  const favoriteId = target.closest<HTMLElement>("[data-favorite]")?.dataset.favorite;
  const nextPage = target.closest<HTMLElement>("[data-page]")?.dataset.page as Page | undefined;
  if (action === "back") back();
  else if (action === "start") go("categories");
  else if (action === "add-exercise") addCustomExercise();
  else if (action === "add-set") addSet();
  else if (action === "save-workout") saveWorkout();
  else if (action === "export-backup") void exportBackup();
  else if (action === "choose-backup") view.querySelector<HTMLInputElement>("[data-backup-file]")?.click();
  else if (favoriteId) toggleFavorite(favoriteId);
  else if (categoryId) { selectedCategoryId = categoryId; searchText = ""; go("exercises"); }
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

