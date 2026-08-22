import os
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

mirrors = {
    'consumer_protection_act_2019.pdf': 'https://thc.nic.in/Central%20Governmental%20Acts/Consumer%20Protection%20Act,%202019.pdf',
    'dpdp_act_2023.pdf': 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf',
    'rte_act_2009.pdf': 'https://ncert.nic.in/pdf/rti/rte_act_2009.pdf',
    'motor_vehicles_act_1988.pdf': 'https://morth.nic.in/sites/default/files/motor_vehicles_act.pdf',
    'rpwd_act_2016.pdf': 'https://disabilityaffairs.gov.in/upload/uploadfiles/files/RPWD%20ACT%202016.pdf'
}

raw_dir = r'C:\Users\Asus\Desktop\OOSCPS#\backend\app\knowledge_base\raw_sources'
os.makedirs(raw_dir, exist_ok=True)

for name, url in mirrors.items():
    print(f'Fetching {name} from {url[:30]}...')
    try:
        r = requests.get(url, verify=False, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 200:
            with open(os.path.join(raw_dir, name), 'wb') as f:
                f.write(r.content)
            print(f'  -> OK ({len(r.content)} bytes)')
        else:
            print(f'  -> Failed with {r.status_code}')
    except Exception as e:
        print(f'  -> Error: {e}')
