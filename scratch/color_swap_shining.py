import os
import re

# Redefining color conversion mapping to achieve a shining gold effect:
# 1. Main gold (#D4AF37) -> Shining Bright Gold (#FFDF00)
# 2. Dark gold (#B8860B) -> Vibrant Gold (#E5A93C)
# 3. Light gold (#F0E68C) -> Radiant Soft Gold (#FFF275)
# 4. Bright gold (#FFD700) -> Ultra Shining Gold (#FFE338)
# 5. Glow gold (#DAA520) -> Vivid Amber Gold (#FFBF00)
# 6. Light gold border (#E6CA65) -> Pale Shining Gold (#F4E07B)
# 7. RGBA gold (212, 175, 55) -> RGBA shining gold (255, 223, 0)
# 8. RGBA alternate gold (240, 230, 140) -> RGBA soft shining gold (255, 242, 117)

replacements = [
    # Hex codes (case insensitive)
    (re.compile(r'#D4AF37', re.I), '#FFDF00'),
    (re.compile(r'#B8860B', re.I), '#E5A93C'),
    (re.compile(r'#F0E68C', re.I), '#FFF275'),
    (re.compile(r'#FFD700', re.I), '#FFE338'),
    (re.compile(r'#DAA520', re.I), '#FFBF00'),
    (re.compile(r'#E6CA65', re.I), '#F4E07B'),
    
    # RGBA strings
    (re.compile(r'rgba\(212,\s*175,\s*55'), 'rgba(255, 223, 0'),
    (re.compile(r'rgba\(212,175,55'), 'rgba(255,223,0'),
    (re.compile(r'rgba\(240,\s*230,\s*140'), 'rgba(255, 242, 117'),
    (re.compile(r'rgba\(240,230,140'), 'rgba(255,242,117'),
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

print("Shining gold theme migration completed!")
