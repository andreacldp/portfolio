// ─────────────────────────────────────────────────────────────
//  All site copy lives here. Edit this file to update the site.
//  Placeholders in [BRACKETS] still need a real value.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Andrea De la Peña Contreras',
  initials: 'ADPC',
  tagline: 'Data Science & Mathematical Engineering student',
  sub: 'Tecnológico de Monterrey · machine learning · optimization · data science',
  email: '[andrea.edlpc@hotmail.com]',
  github: 'https://github.com/andreacldp',
  githubLabel: 'github.com/andreacldp',
  linkedin: '[https://www.linkedin.com/in/andreacldp/]',
};

export const about = {
  paragraphs: [
    "I'm a fifth-semester Data Science & Mathematical Engineering student at Tecnológico de Monterrey and a Data Analysis Intern at CYDSA. I like problems where math meets messy, real-world data: building models that predict, and decisions that hold up under uncertainty.",
    "Lately I'm drawn to science-driven data, fields where a good model helps you see something that was hiding in the noise.",
  ],
  panel: [
    ['NAME', 'Andrea De la Peña Contreras'],
    ['PROGRAM', 'Data Science & Mathematical Eng.'],
    ['INSTITUTION', 'Tecnológico de Monterrey'],
    ['SEMESTER', '5th'],
    ['EXPECTED GRAD', 'Aug 2028'],
    ['CURRENT', 'Data Analysis Intern @ CYDSA'],
    ['BASE', 'Monterrey, MX · 25.68°N 100.31°W'],
    ['LANGUAGES', 'Spanish (native) · English (C1)'],
    ['FOCUS', 'ML · data science · deep learning · computer vision'],
    ['PRINCIPLES', 'curiosity · discipline · continuous improvement'],
  ],
  status: 'Currently exploring ML for scientific data',
};

// To add a project: copy one object, bump the id, pick a glyph
// ('seismic' | 'air' | 'spiral' | 'orbit').
export const projects = [
  {
    id: 'OBJ-001',
    title: 'Seismic Fault Detection',
    type: 'Deep learning · computer vision',
    field: 'Geosciences',
    status: 'In progress',
    description:
      'A PyTorch model that learns to detect geological faults in seismic images — a task usually done by hand by interpreters.',
    stack: ['Python', 'PyTorch', 'NumPy'],
    repo: '[LINK]',
    glyph: 'seismic',
  },
  {
    id: 'OBJ-002',
    title: 'SIMA Air Quality Analysis',
    type: 'Exploratory & statistical analysis',
    field: 'Environmental data',
    status: 'Complete',
    description:
      "Analysis of PM2.5 and PM10 concentrations across Monterrey's SIMA monitoring stations: how pollution changes by station and over time.",
    stack: ['Python', 'pandas', 'NumPy'],
    repo: '[LINK]',
    glyph: 'air',
  },
  {
    id: 'OBJ-003',
    title: 'Portfolio Website',
    type: 'Front-end · generative graphics',
    field: 'Design systems',
    status: 'Live',
    description:
      'This site. React + Vite, a custom token-based design system and a canvas-rendered Fibonacci galaxy — no UI libraries.',
    stack: ['React', 'Vite', 'Canvas API', 'CSS tokens'],
    repo: 'https://github.com/andreacldp/portfolio',
    glyph: 'spiral',
  },
];

export const experience = [
  {
    period: 'Present',
    kind: 'Industry',
    role: 'Data Analysis Intern',
    org: 'CYDSA',
    place: 'Monterrey, MX',
    description:
      'Exploratory analysis of sales and cost data with SQL and Python, turning raw tables into findings the business can act on.',
  },
  {
    period: 'Present',
    kind: 'Leadership',
    role: 'Finance Director',
    org: 'Data Science Club · Tec de Monterrey',
    place: 'Monterrey, MX',
    description:
      "Run the club's budget and finances, keeping events and workshops for the data science community funded and on track.",
  },
  {
    period: 'Previously',
    kind: 'Leadership',
    role: 'Finance Director',
    org: 'Women in Technology',
    place: 'Monterrey, MX',
    description:
      'Managed finances for a student organization that promotes women in tech careers.',
  },
];

export const skills = [
  { group: 'Languages', code: 'SYS-A', items: ['Python', 'SQL', 'R', 'pandas', 'NumPy'] },
  {
    group: 'Machine Learning',
    code: 'SYS-B',
    items: ['scikit-learn', 'PyTorch', 'Random Forest', 'XGBoost', 'KNN', 'Logistic regression', 'Linear programming · PuLP'],
  },
  { group: 'Tools', code: 'SYS-C', items: ['Excel · Power Query', 'Power BI', 'Git / GitHub', 'React + Vite'] },
];

export const contact = {
  lead: "Want to talk about a project, a dataset, or anything where models meet real data? Feel free to reach out.",
};
