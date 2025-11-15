// Dummy AI suggestie generator op basis van profiel
import userProfile from "../data/userProfile";

export function getAISuggestie() {
  // Simpele suggestie: combineer profielvoorkeuren tot een zoekopdracht
  let parts = [];
  if (userProfile.functie) parts.push(userProfile.functie);
  if (userProfile.locatie) parts.push(userProfile.locatie);
  if (userProfile.categorieVoorkeur && userProfile.categorieVoorkeur.length)
    parts.push(userProfile.categorieVoorkeur[0]);
  return parts.join(" in ");
}
