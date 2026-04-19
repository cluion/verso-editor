export interface Template {
  id: string
  name: string
  category: string
  html: string
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    category: 'general',
    html: '<p></p>',
  },
  {
    id: 'report',
    name: 'Report',
    category: 'business',
    html: '<h1>Report Title</h1><h2>Executive Summary</h2><p>Summary content here...</p><h2>Introduction</h2><p>Introduction content here...</p><h2>Findings</h2><p>Findings content here...</p><h2>Conclusion</h2><p>Conclusion content here...</p>',
  },
  {
    id: 'letter',
    name: 'Formal Letter',
    category: 'business',
    html: '<p>Dear [Recipient],</p><p></p><p>[Body text]</p><p></p><p>Sincerely,<br>[Your Name]</p>',
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    category: 'business',
    html: '<h1>Meeting Notes</h1><p><strong>Date:</strong> [Date]</p><p><strong>Attendees:</strong> [List]</p><h2>Agenda</h2><ol><li>Topic 1</li><li>Topic 2</li></ol><h2>Action Items</h2><ul><li>[ ] Item 1 — @person</li><li>[ ] Item 2 — @person</li></ul>',
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'content',
    html: '<h1>[Blog Post Title]</h1><p><em>Published on [Date]</em></p><p>Introduction paragraph...</p><h2>Section 1</h2><p>Content...</p><h2>Section 2</h2><p>Content...</p><h2>Conclusion</h2><p>Wrapping up...</p>',
  },
  {
    id: 'readme',
    name: 'README',
    category: 'technical',
    html: "<h1>Project Name</h1><p>Brief description of the project.</p><h2>Installation</h2><pre><code>npm install project-name</code></pre><h2>Usage</h2><pre><code>import { something } from 'project-name'</code></pre><h2>Contributing</h2><p>Contributions are welcome!</p><h2>License</h2><p>MIT</p>",
  },
]

export function getTemplates(category?: string): Template[] {
  if (!category) return TEMPLATES
  return TEMPLATES.filter((t) => t.category === category)
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function getCategories(): string[] {
  return [...new Set(TEMPLATES.map((t) => t.category))]
}
