"use client";

import { motion } from "framer-motion";
import { Brain, Cloud, Code, Database, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    icon: Brain,
    title: "AI/ML",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Agentic AI",
      "RAG",
      "Scikit-learn",
      "Model Deployment",
      "Hyperparameter Tuning",
      "Apache Spark",
    ],
  },
  {
    icon: Cloud,
    title: "MLOps & Cloud",
    skills: [
      "Kubernetes (CKA)",
      "Docker",
      "Terraform",
      "Ansible",
      "Jenkins",
      "ArgoCD",
      "Helm",
      "GCP (Vertex AI, Cloud Run)",
      "AWS",
    ],
  },
  {
    icon: Code,
    title: "Programming",
    skills: [
      "Python",
      "Go",
      "SQL",
      "Bash",
      "PowerShell",
      "C++",
      "Java",
      "JavaScript",
      "TypeScript",
    ],
  },
  {
    icon: Database,
    title: "Data & Storage",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Google Cloud Storage",
      "Data Preprocessing",
      "Statistical Analysis",
    ],
  },
  {
    icon: Settings,
    title: "Observability",
    skills: [
      "Prometheus",
      "Grafana",
      "Datadog",
      "Monitoring & Alerting",
      "Performance Optimization",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            <span className="text-primary">04.</span> Technical Stack
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border hover:border-primary transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-background border border-border rounded-md">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <CardTitle className="text-xl font-mono text-secondary">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 bg-background border border-border rounded-md text-sm font-mono text-foreground/70 hover:border-primary hover:text-primary transition-colors cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

