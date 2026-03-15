import urllib.request
import re
import json
import os
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin

base_url = "https://www.gk-p.jp/mhcard/?pref="
out_dir = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/src/data"
img_dir = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/public/images/web"

os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

cards = []
card_id = 1

for pref_code in range(1, 48):
    code = f"{pref_code:02d}"
    url = base_url + code
    print(f"Fetching prefecture {code} from {url}")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 ManholeAppBot/1.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        table = soup.find('table', class_='table1 cr')
        if not table:
            print(f"  No table found for {code}")
            continue
            
        rows = table.find_all('tr')
        current_pref_name = "Unknown"
        
        for row in rows[1:]: # skip header
            ths = row.find_all('th')
            tds = row.find_all('td')
            
            # If the row has a 'th', it's defining the prefecture name (rowspan)
            if ths and len(ths) > 0:
                current_pref_name = ths[0].get_text(strip=True)
                
            if len(tds) >= 4:
                # Based on header: '', 市町村, マンホールカード(img), 弾数, 発行年月日, 配布場所...
                city_text = tds[0].get_text(separator=" ", strip=True).split(' ')[0] # take first part to avoid parenthesized codes
                
                img_tag = tds[1].find('img')
                img_url = ""
                if img_tag and img_tag.get('src'):
                    img_url = img_tag['src']
                    if not img_url.startswith('http'):
                        img_url = urljoin(url, img_url)
                        
                edition = tds[2].get_text(strip=True)
                
                # We won't download the images sequentially here to save time for testing, let's just save the URLs first,
                # or download them directly if it's fast. Let's just create the JSON first to verify.
                cards.append({
                    "id": f"card-{card_id}",
                    "prefecture": current_pref_name,
                    "city": city_text,
                    "edition": edition,
                    "remoteImageUrl": img_url,
                    "imageUrl": f"/images/web/card_{card_id}.jpg"
                })
                card_id += 1
                
    except Exception as e:
        print(f"Error on {code}: {e}")
        
    time.sleep(0.5)

json_path = os.path.join(out_dir, "scraped_cards.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"Successfully scraped {len(cards)} cards. Saved JSON to {json_path}")
