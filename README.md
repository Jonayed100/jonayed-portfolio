# Jonayed Hossain — Portfolio (Flask)

A single-page, animated portfolio site. The animated frontend (particle
network, custom cursor, glitch text, command palette, skill radar chart,
3D-tilt project cards) is the same as before — it's now served by a small
**Python/Flask** app instead of being a standalone HTML file, and all the
content lives in Python (`app.py`) rather than hardcoded in the markup.

```
portfolio-flask/
├── app.py                 # Flask app — all site content lives here
├── requirements.txt
├── templates/
│   └── index.html         # Jinja2 template (structure only, no hardcoded content)
├── static/
│   ├── css/style.css       # All styling
│   └── js/main.js          # All interactivity (cursor, palette, canvas, radar…)
├── .vscode/
│   ├── launch.json          # Run/debug config for VS Code
│   └── settings.json
└── .gitignore
```

## Run it in VS Code

1. **Open the folder** — `File → Open Folder…` → select `portfolio-flask/`.

2. **Install the Python extension** (if you don't have it) — search
   "Python" by Microsoft in the Extensions panel (`Ctrl+Shift+X` /
   `Cmd+Shift+X`).

3. **Create a virtual environment** (recommended). Open a terminal in VS
   Code (`` Ctrl+` ``) and run:

   ```bash
   python -m venv .venv
   ```

   VS Code should prompt you to select it as the workspace interpreter —
   click "Yes." If it doesn't, open the Command Palette (`Ctrl+Shift+P`),
   run `Python: Select Interpreter`, and pick `.venv`.

4. **Install dependencies:**

   ```bash
   # macOS/Linux
   source .venv/bin/activate
   # Windows
   .venv\Scripts\activate

   pip install -r requirements.txt
   ```

5. **Run it:**

   - Press `F5` (uses the included `launch.json`), **or**
   - In the terminal: `python app.py`

6. Open **http://127.0.0.1:5000** in your browser.

The app runs with `debug=True`, so editing `app.py`, the template, or the
static files auto-reloads the server.

## Editing content

Everything you'd normally want to change — name, bio, skills, projects,
publications, contact links — is defined as plain Python data structures
at the top of `app.py` (`PROFILE`, `SKILLS`, `PROJECTS`, `PUBLICATIONS`,
`CONTACT_LINKS`, etc.). Edit those and refresh the page; you shouldn't
need to touch `templates/index.html` or the CSS/JS for routine updates.

To add your real links, update `CONTACT_LINKS` in `app.py` (email,
LinkedIn, GitHub) and drop your resume PDF into `static/` as
`resume.pdf`.

## Deploying

This is a standard Flask app, so it deploys anywhere Python apps run:
Render, Railway, Fly.io, PythonAnywhere, or a VPS behind gunicorn/nginx.
For production, don't use the Flask dev server — run it with gunicorn,
e.g.:

```bash
pip install gunicorn
gunicorn app:app
```
