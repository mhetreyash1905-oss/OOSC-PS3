import urllib.request
import urllib.parse
import re

acts = {
    "UP": "U.P. Urban Buildings (Regulation of Letting, Rent and Eviction) Act, 1972 filetype:pdf",
    "RJ": "Rajasthan Rent Control Act, 2001 filetype:pdf",
    "KA": "Karnataka Rent Act, 1999 filetype:pdf",
    "DL": "Delhi Rent Control Act, 1958 filetype:pdf",
    "TN": "Tamil Nadu Buildings (Lease and Rent Control) Act, 1960 filetype:pdf"
}

def search_ddg(query):
    req = urllib.request.Request(
        'https://lite.duckduckgo.com/lite/', 
        data=f'q={urllib.parse.quote(query)}'.encode(), 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    try:
        with urllib.request.urlopen(req) as r:
            html = r.read().decode()
            links = re.findall(r'href=[\"\'](https?://[^\/]+[^\"\']+?\.pdf)[\"\']', html, re.IGNORECASE)
            return links
    except Exception as e:
        return str(e)

for state, query in acts.items():
    print(f"--- {state} ---")
    print(search_ddg(query))
