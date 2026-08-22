import urllib.request, re, urllib.parse
def get_pdf(query):
    req = urllib.request.Request(f'https://lite.duckduckgo.com/lite/', data=f'q={urllib.parse.quote(query)}'.encode(), headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode()
        links = re.findall(r'href=[\"\'](https?://[^\/]+?\.pdf)[\"\']', html, re.IGNORECASE)
        return links
    except: return []
print('KA:', get_pdf('Karnataka Rent Act 1999 pdf'))
print('DL:', get_pdf('Delhi Rent Control Act 1958 pdf'))
