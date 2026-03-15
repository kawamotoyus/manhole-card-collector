import json
import os

json_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json"
with open(json_path, "r", encoding="utf-8") as f:
    cards = json.load(f)

for i, card in enumerate(cards):
    # Try mapping sequentially to card_{i}.jpeg, since we extracted page by page
    card["imageUrl"] = f"/images/extracted/card_{i}.jpeg"

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print("Mapped images to cards.")
