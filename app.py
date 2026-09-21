"""
Jonayed Hossain — Portfolio
Flask application that renders a single-page, animated portfolio site.

All content (profile, skills, projects, publications, contact links) is
defined in Python below and passed into the Jinja2 template — edit the
data in this file to update the site; you shouldn't need to touch the
HTML for routine content changes.

Run:
    python app.py
Then open:
    http://127.0.0.1:5000
"""

from __future__ import annotations

import json
from datetime import datetime

from flask import Flask, render_template

app = Flask(__name__)


# --------------------------------------------------------------------------
# Content — edit this section to update the site.
# --------------------------------------------------------------------------

PROFILE = {
    "name": "Jonayed Hossain",
    "title": "AI/ML Engineer",
    "nav_logo": "JONAYED.HOSSAIN",
    "tagline": "AI / ML ENGINEER · DHAKA, BANGLADESH",
    "headline_line1": "Building systems that understand,",
    "headline_line2_prefix": "not just",
    "headline_highlight": "compute",
    "bio_short": (
        "Myself Jonayed Hossain from Dhaka, Bangladesh."
    ),
    "bio_paragraphs": [
        "I'm Jonayed Hossain. I completed SSC from Mowna High School, and "
        "completed HSC from B.N College, Dhaka. Now I'm a Computer Science "
        "&amp; Engineering graduate from <strong>North South University</strong>, "
        "Dhaka, with specialization in <strong>Artificial Intelligence and "
        "Machine Learning</strong>.",

        "Currently, I'm working on data for Data Analysis. Since I worked on "
        "AI and Machine Learning projects, my interest is in data — so that's "
        "why I analyze different types of data.",

        "My projects include School Management System, Bus-Ticket App, "
        "University AI Chatbot, and Healthcare Chatbot For Diabetes Mellitus "
        "(Hybrid Model). I've also published two conference papers — "
        "<em>Compact Vision Transformers For BFMRX Bone Fracture Detection</em> "
        "and <em>Blockchain Based Document Verification System Using Ethereum "
        "Smart Contracts and Cryptographic Hashing</em> — in SaTC 2026. I care "
        "about systems that are explainable, efficient, and genuinely useful — "
        "not just accurate on a benchmark.",

        "I'm a huge Barcelona fan. I'm a Messi fanboy.",
    ],
    "clock_city": "Dhaka",
    "clock_timezone": "Asia/Dhaka",
    "footer_city": "Dhaka",
    "contact_headline_prefix": "More Updates",
    "contact_headline_highlight": "Will Be",
    "contact_headline_suffix": "Come.",
}

TYPED_PHRASES = [
    "I worked on RAG and LLM based system.",
    "I worked on AI and Machine Learning.",
    "I worked on Data Analysis.",
]

TERMINAL_LINES = [
    # [text, style] — style is one of: c (comment), v (value), kv (key:value), status
    ["$ whoami", "c"],
    ["jonayed_hossain", "v"],
    ["", ""],
    ["degree      : B.Sc. CSE, NSU (2026)", "kv"],
    ["focus       : Data Analysis, AI & ML", "kv"],
    ["stack       : FastAPI · Vector DBs · LLMs", "kv"],
    ["publications: 2 × IEEE", "kv"],
    ["location    : Dhaka, BD", "kv"],
    ["status      : open_to_work", "status"],
]

STATS = [
    {"count": 2, "value": None, "label": "IEEE Publications"},
    {"count": 4, "value": None, "label": "Years Studying CSE"},
    {"count": None, "value": "AI & ML", "label": "Specialization"},
    {"count": None, "value": "Dhaka", "label": "Based in Bangladesh"},
]

ACHIEVEMENTS = [
    # Add certificates here later, e.g.:
    # {"title": "Certificate Name", "issuer": "Issuer", "image": "achievements/cert1.jpg"},
]

PROJECTS = [
    {
        "title": "School Management System",
        "description": (
            "A system for managing student records, attendance, results and "
            "administrative workflows for a school."
        ),
        "tags": ["Web App", "Database"],
    },
    {
        "title": "Bus-Ticket App",
        "description": (
            "An application for browsing routes, booking seats, and managing "
            "bus ticket purchases."
        ),
        "tags": ["Booking System", "Web App"],
    },
    {
        "title": "University AI Chatbot",
        "description": (
            "An AI-powered chatbot built to answer university-related queries "
            "for students and visitors."
        ),
        "tags": ["AI", "Chatbot"],
    },
    {
        "title": "Healthcare Chatbot For Diabetes Mellitus (Hybrid Model)",
        "description": (
            "A hybrid-model healthcare chatbot focused on supporting users "
            "with diabetes mellitus-related queries."
        ),
        "tags": ["Healthcare AI", "Hybrid Model"],
    },
    {
        "title": "Compact Vision Transformers For BFMRX Bone Fracture Detection",
        "description": (
            "A compact vision transformer approach for detecting bone "
            "fractures from medical imaging — published as an IEEE conference "
            "paper."
        ),
        "tags": ["Computer Vision", "Vision Transformers", "Medical Imaging"],
    },
    {
        "title": (
            "Blockchain Based Document Verification System Using Ethereum "
            "Smart Contracts and Cryptographic Hashing"
        ),
        "description": (
            "A document verification system built on Ethereum smart contracts "
            "and cryptographic hashing — published as an IEEE conference paper."
        ),
        "tags": ["Blockchain", "Ethereum", "Smart Contracts"],
    },
]

PUBLICATIONS = [
    {
        "title": "Compact Vision Transformers For BFMRX Bone Fracture Detection",
        "venue": "IEEE · SaTC 2026",
        "description": (
            "A compact vision transformer approach for bone fracture detection "
            "from medical imaging."
        ),
        "url": "https://ieeexplore.ieee.org/document/11542386",
    },
    {
        "title": (
            "Blockchain Based Document Verification System Using Ethereum "
            "Smart Contracts and Cryptographic Hashing"
        ),
        "venue": "IEEE · SaTC 2026",
        "description": (
            "A document verification framework using Ethereum smart contracts "
            "and cryptographic hashing to establish tamper-proof, "
            "decentralized validation of documents."
        ),
        "url": "https://ieeexplore.ieee.org/document/11542278",
    },
]

# Contact links.
CONTACT_LINKS = [
    {
        "label": "Email",
        "hint": "SEND A MESSAGE",
        "url": "mailto:linkedinn05@gmail.com"
    },
    {
        "label": "LinkedIn",
        "hint": "CONNECT",
        "url": (
            "https://www.linkedin.com/in/jonayed-hossain-1b032139"
            "?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
        ),
    },
]

NAV_SECTIONS = [
    {"label": "About", "id": "#about"},
    {"label": "Achievements", "id": "#achievements"},
    {"label": "Work", "id": "#work"},
    {"label": "Research", "id": "#research"},
    {"label": "Contact", "id": "#contact"},
]


# --------------------------------------------------------------------------
# Route
# --------------------------------------------------------------------------

@app.route("/")
def index():
    # Data passed straight to the client-side JS (typing effect, clock,
    # command palette, radar chart) as a single JSON blob.
    site_data = {
        "typed_phrases": TYPED_PHRASES,
        "clock_city": PROFILE["clock_city"],
        "clock_timezone": PROFILE["clock_timezone"],
        "nav_sections": NAV_SECTIONS,
    }

    return render_template(
        "index.html",
        profile=PROFILE,
        stats=STATS,
        achievements=ACHIEVEMENTS,
        projects=PROJECTS,
        publications=PUBLICATIONS,
        contact_links=CONTACT_LINKS,
        current_year=datetime.now().year,
        terminal_lines_json=json.dumps(TERMINAL_LINES),
        site_data_json=json.dumps(site_data),
    )


if __name__ == "__main__":
    app.run(debug=True)