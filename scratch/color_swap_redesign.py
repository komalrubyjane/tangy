import os
import re

# Redesigning colors for modern concert poster aesthetic:
# Backgrounds: #080808 (Main surface), #111111 (Secondary surface), #181818 (Card surface)
# Text: #FFFFFF (Primary), #A4A4A4 (Secondary)
# Accents: #2A593E (Tangy Green), #C8FF2B (Neon Lime Accent), #FF2E52 (Accent Red)
# We will target previous shining gold colors:
# #FFDF00 -> #C8FF2B (Neon Lime Accent)
# #E5A93C -> #2A593E (Tangy Green)
# #FFF275 -> #FFFFFF (Primary white)
# #FFE338 -> #C8FF2B (Neon Lime Accent)
# #FFBF00 -> #FF2E52 (Accent Red)
# #F4E07B -> #A4A4A4 (Secondary Text)
# #E5C07B -> #C8FF2B
# #F3E5AB -> #2A593E
# #050505 -> #080808
# #070707 -> #080808
# #0a0a0a -> #080808
# #090909 -> #111111
# #0d0d0d -> #111111
# #0f0f0f -> #111111
# #151515 -> #181818
# rgba(255, 223, 0 -> rgba(200, 255, 43
# rgba(255,223,0 -> rgba(200,255,43

replacements = [
    # Backgrounds
    (re.compile(r'#050505', re.I), '#080808'),
    (re.compile(r'#070707', re.I), '#080808'),
    (re.compile(r'#0a0a0a', re.I), '#080808'),
    (re.compile(r'#090909', re.I), '#111111'),
    (re.compile(r'#0d0d0d', re.I), '#111111'),
    (re.compile(r'#0f0f0f', re.I), '#111111'),
    (re.compile(r'#151515', re.I), '#181818'),
    (re.compile(r'rgba\(8,8,12,0.92\)'), 'rgba(24,24,24,0.92)'),
    (re.compile(r'rgba\(8,8,12,0.8\)'), 'rgba(24,24,24,0.8)'),
    (re.compile(r'rgba\(8,8,12,0.7\)'), 'rgba(24,24,24,0.7)'),
    (re.compile(r'rgba\(8,8,12,0.45\)'), 'rgba(24,24,24,0.45)'),

    # Accents
    (re.compile(r'#FFDF00', re.I), '#C8FF2B'),
    (re.compile(r'#E5A93C', re.I), '#2A593E'),
    (re.compile(r'#FFF275', re.I), '#FFFFFF'),
    (re.compile(r'#FFE338', re.I), '#C8FF2B'),
    (re.compile(r'#FFBF00', re.I), '#FF2E52'),
    (re.compile(r'#F4E07B', re.I), '#A4A4A4'),
    (re.compile(r'#E5C07B', re.I), '#C8FF2B'),
    (re.compile(r'#F3E5AB', re.I), '#2A593E'),
    
    # RGBA strings
    (re.compile(r'rgba\(255,\s*223,\s*0'), 'rgba(200, 255, 43'),
    (re.compile(r'rgba\(255,223,0'), 'rgba(200,255,43'),
]

files_to_update = [
    "App.jsx",
    "TangySessions.jsx",
    "TangyArtistPortal.jsx",
    "AdminDashboard.jsx",
    "PaymentModal.jsx",
    "src/components/AdminDashboard.jsx",
    "src/components/ArtistRegister.jsx",
    "src/components/ModalProvider.jsx",
    "src/components/Volunteer.jsx",
    "src/components/VolunteerForm.jsx",
    "src/components/ArtistDetails.jsx",
    "src/components/PaymentModal.jsx",
    "src/pages/EventDetails.jsx",
    "src/pages/VolunteerDetails.jsx",
    "src/store.js"
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        print(f"Processing: {filepath}")
        with open(filepath, 'r') as f:
            content = f.read()
        
        modified_content = content
        for pattern, replacement in replacements:
            modified_content = pattern.sub(replacement, modified_content)
        
        if modified_content != content:
            with open(filepath, 'w') as f:
                f.write(modified_content)
            print(f"Successfully updated colors in {filepath}")
        else:
            print(f"No match found in {filepath}")
    else:
        print(f"File not found: {filepath}")

print("Redesign color theme migration completed!")
