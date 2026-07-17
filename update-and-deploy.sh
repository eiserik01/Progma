#!/bin/bash
# Zkopíruje nejnovější verzi projektu do ~/Progma/progma-web, nainstaluje
# závislosti a nasadí na GitHub Pages.
#
# JAK POUŽÍT:
#   1. Stáhněte a rozbalte nejnovější progma-website.zip (třeba do ~/Downloads).
#   2. V Terminálu se přepněte do rozbalené složky:
#        cd ~/Downloads/progma-website
#   3. Spusťte:
#        bash update-and-deploy.sh
#
# Skript nepřepíše váš node_modules ani .env.local (pokud už ho máte
# vytvořený s vašimi Supabase klíči) — ty zůstanou beze změny.

set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/Progma/progma-web"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Nenašel jsem složku $TARGET_DIR."
  echo "Pokud je váš projekt jinde, upravte proměnnou TARGET_DIR na začátku tohoto skriptu a spusťte znovu."
  exit 1
fi

echo "Kopíruji nejnovější soubory z:"
echo "  $SOURCE_DIR"
echo "do:"
echo "  $TARGET_DIR"
echo ""

rsync -av --exclude 'node_modules' --exclude '.env.local' --exclude '.git' "$SOURCE_DIR"/ "$TARGET_DIR"/

echo ""
echo "Instaluji závislosti (npm install)..."
cd "$TARGET_DIR"
npm install

echo ""
echo "Nasazuji na GitHub Pages (npm run deploy)..."
npm run deploy

echo ""
echo "Hotovo. Zkontrolujte web (může trvat minutu, než se změna projeví) a Settings → Pages, jestli je Source nastavený na 'Deploy from a branch' / větev 'gh-pages'."
