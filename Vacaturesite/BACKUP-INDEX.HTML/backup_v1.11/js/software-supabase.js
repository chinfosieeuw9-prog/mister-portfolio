import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./js/supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const folders = [
  { key: "system-tools", label: "System Tools" },
  { key: "netwerk-tools", label: "Netwerk Tools" },
  { key: "security-tools", label: "Security Tools" },
  { key: "archives", label: "Archives" },
  { key: "software", label: "Software" }
];

document.addEventListener("DOMContentLoaded", () => {
  const tabContainer = document.getElementById("software-tabs");
  const listContainer = document.getElementById("software-list");
  if (!tabContainer || !listContainer) return;

  // Tabs aanmaken
  tabContainer.innerHTML = "";
  folders.forEach((folder, i) => {
    const btn = document.createElement("button");
    btn.textContent = folder.label;
    btn.className = "software-tab-btn" + (i === 0 ? " active" : "");
    btn.onclick = () => selectTab(folder.key);
    tabContainer.appendChild(btn);
  });
  // Init
  selectTab(folders[0].key);

  async function selectTab(folderKey) {
    // Tab highlight
    Array.from(tabContainer.children).forEach(btn => btn.classList.remove("active"));
    const idx = folders.findIndex(f => f.key === folderKey);
    if (idx >= 0) tabContainer.children[idx].classList.add("active");
    // Lijst laden
    listContainer.innerHTML = "<li>Laden...</li>";
    const { data, error } = await supabase.storage.from("Bestanden").list(folderKey, { limit: 100 });
    if (error || !data) {
      listContainer.innerHTML = `<li>Fout bij laden van bestanden.</li>`;
      return;
    }
    if (data.length === 0) {
      listContainer.innerHTML = `<li>Geen bestanden gevonden in deze categorie.</li>`;
      return;
    }
    listContainer.innerHTML = "";
    data.forEach(file => {
      const li = document.createElement("li");
      li.className = "software-list-item";
      // Naam
      const name = document.createElement("span");
      name.textContent = file.name;
      li.appendChild(name);
      // Download
      const a = document.createElement("a");
      a.href = supabase.storage.from("Bestanden").getPublicUrl(folderKey + "/" + file.name).publicUrl;
      a.textContent = "Download";
      a.className = "software-action";
      a.setAttribute("download", file.name);
      a.style.marginLeft = "12px";
      li.appendChild(a);
      // Datum
      if (file.created_at) {
        const date = new Date(file.created_at);
        const dateStr = date.toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        const dateSpan = document.createElement('span');
        dateSpan.textContent = " (" + dateStr + ")";
        dateSpan.style.color = '#aaa';
        dateSpan.style.fontSize = '0.95em';
        dateSpan.style.marginLeft = '8px';
        li.appendChild(dateSpan);
      }
      listContainer.appendChild(li);
    });
  }
});