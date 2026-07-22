import re

with open("src/pages/VolunteerDetails.jsx", "r") as f:
    content = f.read()

# 1. Add import
content = content.replace(
    'import { volunteerService } from "../services/volunteerService";',
    'import { volunteerService } from "../services/volunteerService";\nimport VolunteerForm from "../components/VolunteerForm";'
)

# 2. Remove the inline form logic
# The inline form is inside <section id="apply-section"> ... </section>
# Let's replace the entire content of that section

old_apply_section_regex = r'<section id="apply-section".*?</section>'
new_apply_section = """<section id="apply-section" style={{ padding: "100px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="Step Into The Magic" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}>APPLY TO JOIN THE CREW</h2>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <VolunteerForm />
          </motion.div>
        </div>
      </section>"""

content = re.sub(old_apply_section_regex, new_apply_section, content, flags=re.DOTALL)

# Remove the state variables from VolunteerDetails since VolunteerForm handles them now
state_regex = r'  // Form State.*?const fieldStyle = [^}]+};\n'
content = re.sub(state_regex, '', content, flags=re.DOTALL)

with open("src/pages/VolunteerDetails.jsx", "w") as f:
    f.write(content)

