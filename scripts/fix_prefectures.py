import json
import urllib.request
import urllib.parse
import time
import collections

with open('/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Hardcoded well-known fixes for special ones
manual_fixes = {
    '東京23区': '東京都',
    '東京': '東京都',
}

unique_cities = list(set([c['city'] for c in cards]))

def get_prefecture(city_name):
    if city_name in manual_fixes:
        return manual_fixes[city_name]
    
    url = "https://mreversegeocoder.osm.org/nominatim-ac/search?q=" + urllib.parse.quote(city_name + " 日本") + "&format=json&addressdetails=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        if data and len(data) > 0:
            address = data[0].get('address', {})
            # Nominatim usually has 'province' or 'state' for prefectures in Japan
            if 'province' in address:
                return address['province']
            if 'state' in address:
                return address['state']
            if 'region' in address:
                return address['region']
    except Exception as e:
        pass
    return None

import sys

cache = {}
fixed_count = 0
for i, city in enumerate(unique_cities):
    if i % 10 == 0:
        print(f"Resolving {i}/{len(unique_cities)}...", file=sys.stderr)
    pref = get_prefecture(city)
    time.sleep(0.1) # Be nice
    if pref:
        cache[city] = pref

for card in cards:
    if card['city'] in cache:
        valid_pref = cache[card['city']]
        if valid_pref.endswith('県') or valid_pref.endswith('府') or valid_pref.endswith('都') or valid_pref == '北海道':
             card['prefecture'] = valid_pref
        elif valid_pref + "県" in ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]:
             # Nominatim might return without "県" sometimes, but usually it returns it.
             pass

with open('/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json', 'w', encoding='utf-8') as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print("Finished fixing prefectures.")
