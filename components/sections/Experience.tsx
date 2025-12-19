"use client";

import { motion } from "framer-motion";
import { Building2, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experiences = [
  {
    title: "AI Research Intern",
    company: "Old Dominion University",
    location: "Norfolk, VA",
    period: "Jan 2025 – Present",
    current: true,
    achievements: [
      "Designed ML models using PyTorch for reliable AI systems",
      "Integrated RAG pipelines, improving model accuracy by 20%",
      "Conducted A/B testing and controlled experiments with statistical analysis",
      "Created data mining and drift detection algorithms with actionable visual reports",
      "Performed iterative model refinement leading to measurable performance improvements",
    ],
    technologies: ["PyTorch", "RAG", "A/B Testing", "Data Mining"],
  },
  {
    title: "Graduate Research Assistant",
    company: "Old Dominion University",
    location: "Norfolk, VA",
    period: "Aug 2023 – May 2025",
    current: false,
    achievements: [
      "Deployed infrastructure with Ansible/Terraform, reducing provisioning time by 40%",
      "Automated CI/CD pipelines with Jenkins, shortening deployment cycles by 30%",
      "Engineered monitoring solutions maintaining 99.9% uptime",
      "Resolved 100+ hardware and software issues across Windows, Linux, and MacOS",
      "Conducted routine system checks, patching, and updates for compliance",
    ],
    technologies: ["Ansible", "Terraform", "Jenkins", "Prometheus", "Grafana"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            <span className="text-primary">02.</span> Experience
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      {exp.current && (
                        <span className="inline-block bg-primary text-primary-foreground text-xs font-mono px-2 py-1 rounded mb-2">
                          Current
                        </span>
                      )}
                      <CardTitle className="text-2xl text-secondary font-mono mb-2">
                        {exp.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-foreground/70 mb-1">
                        <Building2 size={16} />
                        <span>{exp.company}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60 text-sm">
                        <Calendar size={14} />
                        <span className="font-mono">{exp.period}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-4">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="text-primary mt-0.5 flex-shrink-0"
                        />
                        <span className="text-foreground/80">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-background border border-border rounded-md text-xs font-mono text-foreground/70 hover:border-primary hover:text-primary transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

