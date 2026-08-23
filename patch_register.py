import re

with open('frontend/app/register/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add phone state
content = content.replace(
    "const [lastName, setLastName] = useState('');",
    "const [lastName, setLastName] = useState('');\n  const [phone, setPhone] = useState('');"
)

# 2. Add to validation
content = content.replace(
    "if (!email || !password || !confirmPassword || !firstName || !lastName) {",
    "if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {"
)

# 3. Add to API call
content = content.replace(
    "body: { first_name: firstName, last_name: lastName, gender },",
    "body: { first_name: firstName, last_name: lastName, gender, phone: phone },"
)

# 4. Add the input field in UI
input_field = '''              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Mobile Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="Mobile Number"
                />
              </div>'''

content = content.replace(
    '''                />
              </div>''',
    '''                />
''' + input_field,
    1 # replace only the first occurrence which is after lastName
)

with open('frontend/app/register/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added mobile number to register page!")
