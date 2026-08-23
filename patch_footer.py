import re

with open('frontend/components/Footer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace col 2
old_col2 = '''            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🤖</span> AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/action-plan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>⚡</span> Action Plan Builder
                </Link>
              </li>
              <li>
                <Link href="/application-generator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>📄</span> Application Generator
                </Link>
              </li>
              <li>
                <Link href="/rights-navigator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>⚖️</span> Rights Navigator
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🗂️</span> My Cases Tracker
                </Link>
              </li>
            </ul>'''

new_col2 = '''            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors flex items-center gap-1.5">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/action-plan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Action Plan Builder
                </Link>
              </li>
              <li>
                <Link href="/application-generator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Application Generator
                </Link>
              </li>
              <li>
                <Link href="/rights-navigator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Rights Navigator
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-white transition-colors flex items-center gap-1.5">
                  My Cases Tracker
                </Link>
              </li>
            </ul>'''

content = content.replace(old_col2, new_col2)

# Replace col 3
old_col3 = '''            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/document-analyzer" className="hover:text-white transition-colors">
                  🔍 Document Analyzer
                </Link>
              </li>
              <li>
                <Link href="/scheme-eligibility" className="hover:text-white transition-colors">
                  📋 Scheme Eligibility
                </Link>
              </li>
              <li>
                <Link href="/authority-finder" className="hover:text-white transition-colors">
                  🏛️ Authority Finder
                </Link>
              </li>
              <li>
                <Link href="/rti-guide" className="hover:text-white transition-colors">
                  📜 RTI Citizen Manual
                </Link>
              </li>
              <li>
                <Link href="/saved-documents" className="hover:text-white transition-colors">
                  📁 Saved Documents
                </Link>
              </li>
            </ul>'''

new_col3 = '''            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/document-analyzer" className="hover:text-white transition-colors">
                  Document Analyzer
                </Link>
              </li>
              <li>
                <Link href="/scheme-eligibility" className="hover:text-white transition-colors">
                  Scheme Eligibility
                </Link>
              </li>
              <li>
                <Link href="/authority-finder" className="hover:text-white transition-colors">
                  Authority Finder
                </Link>
              </li>
              <li>
                <Link href="/rti-guide" className="hover:text-white transition-colors">
                  RTI Citizen Manual
                </Link>
              </li>
              <li>
                <Link href="/saved-documents" className="hover:text-white transition-colors">
                  Saved Documents
                </Link>
              </li>
            </ul>'''

content = content.replace(old_col3, new_col3)

with open('frontend/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed emojis from footer links!")
