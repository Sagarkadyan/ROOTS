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
      description: "Master the art of building modern web applications from the ground up.",
      children: [
        { "id": "html", "label": "HTML", "color": "#4ade80" },
        { "id": "css", "label": "CSS", "color": "#4ade80" },
        { "id": "javascript", "label": "JavaScript", "color": "#4ade80" }
      ]
    },
    {
      id: "data-science",
      label: "Data Science",
      color: "#06b6d4",
      estimatedHours: 150,
      difficulty: "Advanced",
      description: "Unlock the power of data through analysis and machine learning.",
      children: [
        { "id": "python", "label": "Python", "color": "#06b6d4" },
        { "id": "ml", "label": "Machine Learning", "color": "#06b6d4" },
        { "id": "stats", "label": "Statistics", "color": "#06b6d4" }
      ]
    },
    {
      id: "ui-ux",
      label: "UI/UX Design",
      color: "#f59e0b",
      estimatedHours: 80,
      difficulty: "Beginner",
      description: "Design beautiful and intuitive user experiences.",
      children: [
        { "id": "figma", "label": "Figma", "color": "#f59e0b" },
        { "id": "design-systems", "label": "Design Systems", "color": "#f59e0b" },
        { "id": "typography", "label": "Typography", "color": "#f59e0b" }
      ]
    },
    {
      id: "devops",
      label: "DevOps",
      color: "#a78bfa",
      estimatedHours: 100,
      difficulty: "Advanced",
      description: "Bridge the gap between development and operations.",
      children: [
        { "id": "docker", "label": "Docker", "color": "#a78bfa" },
        { "id": "kubernetes", "label": "Kubernetes", "color": "#a78bfa" },
        { "id": "cicd", "label": "CI/CD", "color": "#a78bfa" }
      ]
    },
    {
      id: "cybersecurity",
      label: "Cybersecurity",
      color: "#ef4444",
      estimatedHours: 130,
      difficulty: "Advanced",
      description: "Protect systems and networks from digital attacks.",
      children: [
        { "id": "networking", "label": "Networking", "color": "#ef4444" },
        { "id": "cryptography", "label": "Cryptography", "color": "#ef4444" },
        { "id": "ethical-hacking", "label": "Ethical Hacking", "color": "#ef4444" }
      ]
    }
  ]
};
