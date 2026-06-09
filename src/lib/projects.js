// Single source of truth for all project checkpoints.
// Keyed by track slug, then by the lesson `order` the checkpoint sits at.
// To add a project, add an entry — SubmitPage picks it up automatically.

export const PROJECTS = {
  "html-css": {
    10: {
      trackId: "html-css",
      title: "Developer Profile Page",
      description:
        "Build a complete developer profile page using everything you've learned so far in the HTML & CSS track. Submit your GitHub repository link for AI review.",
      requirements: [
        "Your name and job title as the main heading",
        "A short bio paragraph about yourself",
        "A skills section using an unordered list",
        "Links to your GitHub and LinkedIn profiles",
        "A working contact form with name, email, and message fields",
        "Consistent CSS styling throughout the page",
        "Clean layout using Flexbox",
      ],
      tips: [
        "Push your project to a public GitHub repository",
        "Make sure your HTML file is named index.html",
        "Test your page in the browser before submitting",
        "Your AI reviewer will check for all requirements above",
      ],
    },
    21: {
      trackId: "html-css",
      title: "Responsive Business Landing Page",
      description:
        "Build a fully responsive landing page for a Ghanaian business of your choice — restaurant, startup, fashion brand, anything you care about.",
      requirements: [
        "A navigation bar that is sticky on scroll",
        "A hero section with headline, subheadline, and a call-to-action button",
        "A features or services section with at least three items in a grid",
        "A testimonial or social proof section",
        "A contact section with a working form",
        "A footer with links and copyright",
        "Responsive layout using media queries (looks good on mobile and desktop)",
        "CSS variables for your colour palette",
      ],
      tips: [
        "Push your project to a public GitHub repository",
        "Pick a business concept you actually care about — it shows",
        "Test on both a phone-width and desktop-width screen",
        "Use semantic HTML: header, nav, main, section, footer",
      ],
    },
    30: {
      trackId: "html-css",
      title: "Full Multi-Page Website",
      description:
        "Build a complete multi-page website for a Ghanaian business, organisation, or portfolio. This is your final HTML & CSS project.",
      requirements: [
        "At least 4 pages: Home, About, Services or Work, and Contact",
        "Shared navigation and footer across all pages",
        "Semantic HTML5 throughout",
        "CSS custom properties for the design system",
        "Responsive layout using Grid and Flexbox",
        "Keyboard accessible with ARIA labels on icon buttons",
        "All images have width and height (no layout shift)",
      ],
      tips: [
        "Build the shared nav and footer once, reuse on every page",
        "Define your colour palette and typography as variables first",
        "Use real content, not lorem ipsum",
        "Push the whole multi-page site to one public repository",
      ],
    },
  },

  "python-fundamentals": {
    10: {
      trackId: "python-fundamentals",
      title: "Student Grade Tracker",
      description:
        "Build a grade tracker that stores students and their scores, calculates statistics, and prints a formatted report. This is your first Python project.",
      requirements: [
        "Store student names and scores in a list of dictionaries",
        "A function that calculates each student's average",
        "A function that converts an average to a letter grade",
        "Find and display the top student",
        "Calculate and display the class average",
        "Clean, formatted report output",
      ],
      tips: [
        "Push your .py file to a public GitHub repository",
        "Use functions — don't put everything in one block",
        "Test with at least 5 students",
        "Handle the empty-list case so it doesn't crash",
      ],
    },
    21: {
      trackId: "python-fundamentals",
      title: "File Organiser Script",
      description:
        "Build a Python script that scans a folder, categorises files by type, and generates a report. Real automation that saves time.",
      requirements: [
        "Scan a directory and list all files",
        "Categorise files by extension (Images, Documents, Code, etc.)",
        "Generate a report of how many files are in each category",
        "Report the total size per category",
        "At least one extra feature: duplicate detection or a size summary",
        "Error handling for permission and missing-file issues",
      ],
      tips: [
        "Push your .py file to a public GitHub repository",
        "Use os.path.splitext() to read file extensions",
        "Preview what the script will do before moving anything",
        "Add a clear README explaining how to run it",
      ],
    },
    30: {
      trackId: "python-fundamentals",
      title: "Full Flask Web App",
      description:
        "Build a complete Flask web application with user authentication, a database, and multiple pages. This is your final Python project.",
      requirements: [
        "A Flask application backed by a SQLAlchemy database",
        "User registration and login with hashed passwords",
        "Session-based authentication",
        "A protected dashboard page (login required)",
        "At least one REST API endpoint",
        "Input validation on all forms",
        "Deployed live on Render or Railway — submit the live URL too",
      ],
      tips: [
        "Never store plain passwords — use werkzeug's generate_password_hash",
        "Test every route locally before deploying",
        "Add a Procfile and gunicorn for deployment",
        "Push to GitHub, then connect the repo to Render",
      ],
    },
  },
};

// Look up a project by track slug and checkpoint lesson order.
// Returns null if there's no project at that checkpoint.
export function getProject(trackSlug, order) {
  const track = PROJECTS[trackSlug];
  if (!track) return null;
  return track[Number(order)] || null;
}