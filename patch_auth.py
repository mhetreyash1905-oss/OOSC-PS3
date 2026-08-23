import re

with open('backend/app/auth/models.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'gender: Optional[str] = "prefer-not-to-say"',
    'gender: Optional[str] = "prefer-not-to-say"\n    phone: Optional[str] = None'
)

with open('backend/app/auth/models.py', 'w', encoding='utf-8') as f:
    f.write(content)

with open('backend/app/auth/router.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'gender = profile.gender or "prefer-not-to-say"',
    'gender = profile.gender or "prefer-not-to-say"\n    phone = profile.phone or ""'
)

content = content.replace(
    '"gender": gender,',
    '"gender": gender,\n        "phone": phone,'
)

with open('backend/app/auth/router.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated backend auth models and router for phone number!")
