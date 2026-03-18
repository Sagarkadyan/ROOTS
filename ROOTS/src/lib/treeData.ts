export type TreeNodeChild = {
  id: string;
  label: string;
  color: string;
  estimatedHours?: number;
  difficulty?: string;
  description?: string;
  children?: TreeNodeChild[];
};

export type TreeDataRoot = {
  id: string;
  label: string;
  children: TreeNodeChild[];
};

export const treeData: TreeDataRoot = {
  id: "knowledge",
  label: "Knowledge",
  children: [
    {
      id: "web-dev",
      label: "Web Development",
      color: "#4ade80",
      estimatedHours: 120,
      difficulty: "Intermediate",
      description: "Master the art of building modern web applications from the ground up. Cover everything from semantic HTML to full-stack React applications.",
      children: [
        {
          id: "html",
          label: "HTML",
          color: "#4ade80",
          estimatedHours: 10,
          difficulty: "Beginner",
          description: "Learn the foundational language of the web. Understand semantic markup, accessibility, and document structure.",
          children: [
            { id: "semantic-html", label: "Semantic HTML", color: "#4ade80" },
            { id: "forms", label: "Forms & Inputs", color: "#4ade80" },
            { id: "accessibility", label: "Accessibility", color: "#4ade80" }
          ]
        },
        {
          id: "css",
          label: "CSS",
          color: "#4ade80",
          estimatedHours: 20,
          difficulty: "Beginner",
          description: "Style the web with precision. Learn layouts, animations, and responsive design principles that make UIs beautiful.",
          children: [
            { id: "flexbox", label: "Flexbox", color: "#4ade80" },
            { id: "grid", label: "CSS Grid", color: "#4ade80" },
            { id: "animations-css", label: "CSS Animations", color: "#4ade80" }
          ]
        },
        {
          id: "javascript",
          label: "JavaScript",
          color: "#4ade80",
          estimatedHours: 40,
          difficulty: "Intermediate",
          description: "The language of the web. Master JS fundamentals, async programming, and the DOM to build dynamic, interactive experiences.",
          children: [
            { id: "dom", label: "DOM Manipulation", color: "#4ade80" },
            { id: "async", label: "Async / Promises", color: "#4ade80" },
            { id: "es6", label: "ES6+ Features", color: "#4ade80" },
            {
              id: "frameworks",
              label: "Frameworks",
              color: "#4ade80",
              children: [
                { id: "react", label: "React", color: "#4ade80" },
                { id: "nextjs", label: "Next.js", color: "#4ade80" },
                { id: "vue", label: "Vue", color: "#4ade80" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "data-science",
      label: "Data Science",
      color: "#06b6d4",
      estimatedHours: 150,
      difficulty: "Advanced",
      description: "Unlock the power of data. Learn to analyze, visualize, and model datasets to uncover insights that drive real-world decisions.",
      children: [
        { id: "python", label: "Python", color: "#06b6d4", children: [
          { id: "numpy", label: "NumPy", color: "#06b6d4" },
          { id: "pandas", label: "Pandas", color: "#06b6d4" }
        ]},
        { id: "ml", label: "Machine Learning", color: "#06b6d4", children: [
          { id: "supervised", label: "Supervised Learning", color: "#06b6d4" },
          { id: "neural-nets", label: "Neural Networks", color: "#06b6d4" }
        ]},
        { id: "viz", label: "Data Visualization", color: "#06b6d4" }
      ]
    },
    {
      id: "design",
      label: "UI/UX Design",
      color: "#f59e0b",
      estimatedHours: 80,
      difficulty: "Beginner",
      description: "Design experiences that delight. Learn the principles of visual hierarchy, user psychology, and interaction design.",
      children: [
        { id: "figma", label: "Figma", color: "#f59e0b" },
        { id: "design-systems", label: "Design Systems", color: "#f59e0b" },
        { id: "typography", label: "Typography", color: "#f59e0b" },
        { id: "color-theory", label: "Color Theory", color: "#f59e0b" }
      ]
    },
    {
      id: "devops",
      label: "DevOps",
      color: "#a78bfa",
      estimatedHours: 100,
      difficulty: "Advanced",
      description: "Bridge development and operations. Learn CI/CD pipelines, containerization, and cloud infrastructure that powers modern software.",
      children: [
        { id: "docker", label: "Docker", color: "#a78bfa" },
        { id: "kubernetes", label: "Kubernetes", color: "#a78bfa" },
        { id: "cicd", label: "CI/CD", color: "#a78bfa" },
        { id: "cloud", label: "Cloud Platforms", color: "#a78bfa" }
      ]
    },
    {
      id: "cybersecurity",
      label: "Cybersecurity",
      color: "#f43f5e",
      estimatedHours: 130,
      difficulty: "Advanced",
      description: "Defend the digital world. Learn offensive and defensive security techniques, ethical hacking, and security architecture.",
      children: [
        { id: "networking", label: "Networking", color: "#f43f5e" },
        { id: "ethical-hacking", label: "Ethical Hacking", color: "#f43f5e" },
        { id: "cryptography", label: "Cryptography", color: "#f43f5e" }
      ]
    }
  ]
};
