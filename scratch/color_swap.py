import os
import re

# Color conversion mapping:
# 1. Main purple accent (8B5CF6) -> Gold (D4AF37)
# 2. Dark purple accent (6d28d9) -> Dark Gold / Bronze (B8860B)
# 3. Light purple / Lavender (a78bfa) -> Light Gold (F0E68C)
# 4. Bright Violet (a855f7) -> Bright Gold / Amber (FFD700)
# 5. Accent glow purple (7C3AED) -> Gold glow (DAA520)
# 6. Light purple border c084fc -> Gold border (E6CA65)
# 7. RGBA purple (139, 92, 246) -> RGBA gold (212, 175, 55)
# 8. RGBA alternate (167, 139, 250) -> RGBA alternate gold (240, 230, 140)

replacements = [
    # Hex codes (case insensitive)
    (re.compile(r'#8B5CF6', re.I), '#D4AF37'),
    (re.compile(r'#6[dD]28[dD]9', re.I), '#B8860B'),
    (re.compile(r'#a78bfa', re.I), '#F0E68C'),
    (re.compile(r'#a855f7', re.I), '#FFD700'),
    (re.compile(r'#7[cC]3[aA][eE][dD]', re.I), '#DAA520'),
    (re.compile(r'#c084fc', re.I), '#E6CA65'),
    
    # RGBA strings
    (re.compile(r'rgba\(139,\s*92,\s*246'), 'rgba(212, 175, 55'),
    (re.compile(r'rgba\(139,92,246'), 'rgba(212,175,55'),
    (re.compile(r'rgba\(167,\s*139,\s*250'), 'rgba(240, 230, 140'),
    (re.compile(r'rgba\(167,139,250'), 'rgba(240,230,140'),
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
            print(f"No purple matches found in {filepath}")
    else:
        print(f"File not found: {filepath}")

print("Color theme migration completed!")
