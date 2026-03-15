import json
import urllib.request
import re

print("Downloading city data...")
req = urllib.request.Request("https://raw.githubusercontent.com/geolonia/japanese-addresses/master/api/ja.json", headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req)
geo_data = json.loads(response.read().decode('utf-8'))

city_to_pref = {}
for pref, cities in geo_data.items():
    for city in cities:
        city_to_pref[city] = pref
        # Add a version without the ward if applicable (e.g., '福岡市' from '福岡市東区')
        if '区' in city and '市' in city:
            base_city = city.split('区')[0][:city.index('市')+1]
            if base_city not in city_to_pref:
                city_to_pref[base_city] = pref

with open('/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Special hardcodes
city_to_pref['東京23区'] = '東京都'
city_to_pref['特別区'] = '東京都'
city_to_pref['富士河口湖町'] = '山梨県'
city_to_pref['野田村'] = '岩手県'

for card in cards:
    c = card['city']
    if c in city_to_pref:
        card['prefecture'] = city_to_pref[c]
    else:
        # Fallback: Try finding if the city name matches the beginning
        found = False
        for k, v in city_to_pref.items():
            if c.startswith(k) or k.startswith(c) or (len(c) > 2 and c[:2] in k):
                # Don't blindly fall back if too short
                pass
        
        # Try finding anywhere
        for k, v in city_to_pref.items():
            if c in k and len(c) >= 2:
                card['prefecture'] = v
                found = True
                break

with open('/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data/parsed_cards.json', 'w', encoding='utf-8') as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print("Done. Re-saving JSON.")
