import os
import re

# Redefining color conversion mapping to achieve the elegant champagne metallic gold gradient effect:
# 1. Main gold (#FFDF00) -> Metallic Soft Gold (#E5C07B)
# 2. Dark gold (#E5A93C) -> Warm Bronze/Brass (#D4AF37)
# 3. Light gold (#FFF275) -> Champagne gold (#F3E5AB)
# 4. Bright gold (#FFE338) -> Bright Brass (#F9E0A2)
# 5. Glow gold (#FFBF00) -> Gold Foil Glow (#E6CA65)
# 6. Light gold border (#F4E07B) -> Pale Champagne (#F7E7C4)
# 7. RGBA gold (255, 223, 0) -> RGBA champagne gold (229, 192, 123)
# 8. RGBA alternate gold (255, 242, 117) -> RGBA pale gold (243, 229, 171)

replacements = [
    # Hex codes (case insensitive)
    (re.compile(r'#FFDF00', re.I), '#E5C07B'),
    (re.compile(r'#E5A93C', re.I), '#D4AF37'),
    (re.compile(r'#FFF275', re.I), '#F3E5AB'),
    (re.compile(r'#FFE338', re.I), '#F9E0A2'),
    (re.compile(r'#FFBF00', re.I), '#E6CA65'),
    (re.compile(r'#F4E07B', re.I), '#F7E7C4'),
    
    # RGBA strings
    (re.compile(r'rgba\(255,\s*223,\s*0'), 'rgba(229, 192, 123'),
    (re.compile(r'rgba\(255,223,0'), 'rgba(229,192,123'),
    (re.compile(r'rgba\(255,\s*242,\s*117'), 'rgba(243, 229, 171'),
    (re.compile(r'rgba\(255,242,117'), 'rgba(243,229,171'),
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
            print(f"No gold matches found in {filepath}")
    else:
        print(f"File not found: {filepath}")

print("Champagne metallic gold theme migration completed!")
