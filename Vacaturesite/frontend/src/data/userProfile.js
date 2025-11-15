// Dummy gebruikersprofiel voor AI-matching
// Plaats dit bestand in frontend/src/data/userProfile.js


const userProfile = {
  naam: "Sanne de Zorgtopper",
  functie: "Verpleegkundige",
  locatie: "Breda",
  categorieVoorkeur: ["Verpleegkundige", "Zorgassistent"],
  ervaring: "3 jaar",
  diploma: ["MBO-V", "VIG"],
  opleidingsniveau: "MBO-4",
  interesses: ["thuiszorg", "ouderen", "teamwerk"],
  specialisaties: ["wondzorg", "ouderenzorg"],
  contractVoorkeur: ["Vast", "Parttime"],
  sectorVoorkeur: ["VVT", "GGZ"],
  talen: ["Nederlands", "Engels"],
  softSkills: ["communicatief", "stressbestendig", "samenwerken"],
  beschikbaarheid: "24-32 uur",
  beschikbaarheidPerDag: {
    maandag: true,
    dinsdag: true,
    woensdag: false,
    donderdag: true,
    vrijdag: true,
    zaterdag: false,
    zondag: false
  },
  mobiliteit: ["auto", "fiets"],
  rijbewijs: true,
  werkvorm: ["op locatie", "hybride"],
  beschikbaarVanaf: "2025-12-01",
  // Voeg meer profielvelden toe indien gewenst
};

export default userProfile;
