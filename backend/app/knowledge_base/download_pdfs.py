import os
import requests
import urllib3

# Disable SSL warnings because Indian Govt sites often have expired certs
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

pdf_sources = {
    # Consumer & Digital
    'consumer_protection_act_2019.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/15256/1/a2019-35.pdf',
    'dpdp_act_2023.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/19412/1/a2023-22.pdf',
    'it_act_2000.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1999/3/a2000-21.pdf',
    
    # Vehicles & Labour
    'motor_vehicles_act_1988.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1798/1/a1988-59.pdf',
    'industrial_disputes_act_1947.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1110/1/a1947-14.pdf',
    'maternity_benefit_act_1961.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1695/1/a1961-53.pdf',
    
    # Welfare, Disability & Education
    'rpwd_act_2016.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/2155/1/a2016-49.pdf',
    'nfsa_act_2013.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/2113/1/a2013-20.pdf',
    'rte_act_2009.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1825/1/a2009-35.pdf',
    
    # Environment
    'air_pollution_act_1981.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1389/1/a1981-14.pdf',
    'water_pollution_act_1974.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/1494/1/a1974-06.pdf',
    'bns_2023.pdf': 'https://www.indiacode.nic.in/bitstream/123456789/19418/1/a2023-45.pdf'
}

raw_dir = r'C:\Users\Asus\Desktop\OOSCPS#\backend\app\knowledge_base\raw_sources'
os.makedirs(raw_dir, exist_ok=True)

for name, url in pdf_sources.items():
    print(f'Downloading {name}...')
    try:
        response = requests.get(url, verify=False, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200 and b'%PDF' in response.content[:10]:
            with open(os.path.join(raw_dir, name), 'wb') as f:
                f.write(response.content)
            print(f'  -> Success ({len(response.content)} bytes)')
        else:
            print(f'  -> Failed: Status {response.status_code}, not a PDF')
    except Exception as e:
        print(f'  -> Error: {e}')
