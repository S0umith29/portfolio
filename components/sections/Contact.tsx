"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "soumith.odu@gmail.com",
    href: "mailto:soumith.odu@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (757) 798-9998",
    href: "tel:+17577989998",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/soumith29",
    href: "https://linkedin.com/in/soumith29",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/s0umith29",
    href: "https://github.com/s0umith29",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            <span className="text-primary">05.</span> Get In Touch
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting projects, or
            collaborating on AI/ML initiatives. Let&apos;s build something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="border-border hover:border-primary transition-all duration-300 h-full cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background border border-border rounded-md">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-mono text-lg font-semibold text-foreground mb-1">
                          {method.label}
                        </h3>
                        <p className="text-sm text-foreground/70">{method.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

