"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/in/soumith29", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/s0umith29", label: "GitHub" },
  { icon: Mail, href: "mailto:soumith.odu@gmail.com", label: "Email" },
];

const stats = [
  { value: "20%", label: "Model Accuracy Improvement" },
  { value: "40%", label: "Faster Provisioning" },
  { value: "99.9%", label: "System Uptime" },
];

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-secondary mb-4"
          >
            <span className="text-muted-foreground">const</span>{" "}
            <span className="text-accent">greeting</span> ={" "}
            <span className="text-yellow-400">"Hello, I'm"</span>;
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-4 font-mono"
          >
            <span className="text-primary">Sowmith</span>{" "}
            <span className="text-secondary">Kuppa</span>
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl font-mono text-foreground/80 mb-6"
          >
            AI/ML Engineer | MLOps Specialist | CKA Certified
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
          >
            Building reliable AI systems, scalable ML pipelines, and production-grade infrastructure.
            Passionate about the intersection of AI, cloud computing, and automation.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="text-3xl font-bold text-primary font-mono mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Button
              size="lg"
              className="font-mono"
              onClick={() => {
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-mono"
              onClick={() => {
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center gap-6"
          >
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-foreground/60 hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <Icon size={24} />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="text-primary" size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

