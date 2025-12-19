"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "MedSim",
    subtitle: "Virtual Patient Simulator",
    period: "Jan 2025 – Present",
    description:
      "Comprehensive medical simulation platform with AI-powered evaluation capabilities. Re-architected into microservices with Hybrid RAG pipeline on GCP.",
    features: [
      "Microservices architecture with React.js & FastAPI",
      "Hybrid RAG pipeline using Vertex AI Vector Search & Gemini 2.5 Pro",
      "Automated OSCE-style evaluation engine for real-time clinical performance analysis",
      "Containerized deployment on Google Cloud Run with optimized cold-start",
    ],
    technologies: [
      "React.js",
      "FastAPI",
      "GCP",
      "Vertex AI",
      "RAG",
      "Docker",
      "Cloud Run",
    ],
    status: "Active",
    github: "#",
    demo: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            <span className="text-primary">03.</span> Featured Projects
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-primary" size={24} />
                        {project.status && (
                          <span className="bg-primary text-primary-foreground text-xs font-mono px-2 py-1 rounded">
                            {project.status}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-3xl text-secondary font-mono mb-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-lg text-foreground/70 mb-2">
                        {project.subtitle}
                      </CardDescription>
                      <p className="text-sm text-foreground/60 font-mono">{project.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary"
                        asChild
                      >
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github size={20} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary"
                        asChild
                      >
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={20} />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-foreground/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-background border border-border rounded-md text-xs font-mono text-foreground/70 hover:border-accent hover:text-accent transition-colors"
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

