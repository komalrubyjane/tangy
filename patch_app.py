import re

with open("App.jsx", "r") as f:
    content = f.read()

# 1. Add import
content = content.replace(
    'import EventDetails from "./src/pages/EventDetails";',
    'import EventDetails from "./src/pages/EventDetails";\nimport VolunteerDetails from "./src/pages/VolunteerDetails";'
)

# 2. Update scrollTo
old_scroll = """  const scrollTo = (id) => {
    const target = id.toLowerCase();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 120);
      setMenuOpen(false);
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };"""

new_scroll = """  const scrollTo = (id) => {
    if (id === "Volunteer") {
      navigate("/volunteer");
      window.scrollTo(0, 0);
      setMenuOpen(false);
      return;
    }
    const target = id.toLowerCase();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 120);
      setMenuOpen(false);
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };"""

content = content.replace(old_scroll, new_scroll)

# 3. Add route
old_routes = """        <Route path="/events/:slug" element={<EventDetails />} />
      </Routes>"""

new_routes = """        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/volunteer" element={<VolunteerDetails />} />
      </Routes>"""

content = content.replace(old_routes, new_routes)

with open("App.jsx", "w") as f:
    f.write(content)

