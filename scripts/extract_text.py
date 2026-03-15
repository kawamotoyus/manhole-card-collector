import pdfplumber
import re
import json

pdf_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/dist/official/ManholeCard.pdf"

cards = []
current_prefecture = "Unknown"

# List of Japanese prefectures to match against headers
prefectures = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県", "沖縄県"]
# Some parts of the pdf use regional headers like "関東" instead of perfectures directly.
regions = ["東北", "関東", "北陸", "中部", "近畿", "中国", "四国", "九州", "沖縄"]

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if not text: continue
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Try to catch prefectures or block names from the line
            if len(line) < 10:  # Could be a region or prefecture header
                for p in prefectures:
                    if p in line:
                        current_prefecture = p
                        break
            
            # Find all instances of "CityName 第X弾"
            matches = re.finditer(r'([^\s]+?)\s*(第\d+弾)', line)
            for m in matches:
                city = m.group(1)
                edition = m.group(2)
                # Cleanup typical noise
                city = city.replace('「', '').replace('第', '')
                if '弾' in city: continue
                if city in regions or city in prefectures: continue
                cards.append({
                    "id": f"card-{len(cards)+1}",
                    "prefecture": current_prefecture, # Might be inaccurate without NLP but let's try
                    "city": city,
                    "edition": edition,
                    "imageUrl": ""
                })

import os
out_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(cards)} cards to {out_path}")
