// Po `vite build --config vite.admin.config.js` skončí výstup jako
// dist-admin/admin.html. Když ale admin.progma.cz nasadíte jako samostatný
// projekt/site, hosting očekává, že se na "/" bude servírovat index.html —
// proto ho tady přejmenujeme.
import { existsSync, renameSync } from "node:fs";

const from = "dist-admin/admin.html";
const to = "dist-admin/index.html";

if (existsSync(from)) {
  renameSync(from, to);
  console.log(`Přejmenováno: ${from} -> ${to}`);
} else {
  console.warn(`Soubor ${from} nenalezen — proběhl build:admin v pořádku?`);
  process.exit(1);
}
