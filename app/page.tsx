import AIChatbot from "@/components/AIChatbot";
import SkillIcon from "@/components/SkillIcon";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Marquee from "@/components/Marquee";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50 relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold">Sowmith Kuppa</div>
          <div className="hidden md:flex gap-8">
            <a href="#about" className="hover:text-foreground transition-colors text-white">About</a>
            <a href="#skills" className="hover:text-foreground transition-colors text-white">Skills</a>
            <a href="#experience" className="hover:text-foreground transition-colors text-white">Experience</a>
            <a href="#projects" className="hover:text-foreground transition-colors text-white">Projects</a>
            <a href="#contact" className="hover:text-foreground transition-colors text-white">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold mb-4 text-white">Hello, I&apos;m</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="block">SOWMITH</span>
              <span className="block">KUPPA</span>
            </h1>
            <p className="text-white mb-8 text-lg">
              Building reliable AI and RAG systems with scalable MLOps infrastructure.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://github.com/s0umith29"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/soumith29"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a
                href="mailto:soumith.odu@gmail.com"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
              <a
                href="https://drive.google.com/file/d/1LnBKLfM-9wan8AT5oaNB89a0YJBijpZT/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center mt-32 md:mt-40">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/portfolio/assets/Picture.jpeg"
                alt="Sowmith Kuppa"
                fill
                className="rounded-full object-cover border-4 border-foreground"
                style={{ transform: "scale(0.85)" }}
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">About</h2>
          <div className="w-24 h-1 bg-foreground mb-8" />
          <div className="space-y-6 text-white">
            <p>
              Hi there! I&apos;m Sowmith Kuppa, an M.Sc. in Computer Science graduate from Old Dominion University, where my focus lies in machine learning, MLOps, and reliable AI systems.
            </p>
            <p>
              I&apos;ve built and deployed deep learning models in PyTorch and TensorFlow, designed Retrieval-Augmented Generation (RAG) pipelines, and developed data-driven experiments that improved model performance and research outcomes. My recent work combines AI reliability, cloud automation, and data engineering, turning complex research ideas into scalable, production-ready systems.
            </p>
            <p>
              Before diving into AI, I worked in IT consulting and systems administration, where I managed large-scale Windows and Linux environments, automated infrastructure with Ansible and Terraform, and led CI/CD initiatives using Jenkins and Kubernetes. That background gives me a strong understanding of real-world system reliability and the importance of clean, automated deployment pipelines.
            </p>
            <p>
              I&apos;m passionate about building responsible, reproducible AI solutions, from data preprocessing to monitoring and model refinement and I&apos;m always looking for ways to bridge research, automation, and practical impact.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Skills</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="mb-12">
            <Marquee speed={60} className="py-4">
              {["PyTorch", "TensorFlow", "Kubernetes", "Docker", "Terraform", "Ansible", "Jenkins", "GCP", "AWS", "Python", "Go", "PostgreSQL", "MySQL", "Prometheus", "Grafana", "ArgoCD", "Helm", "Java", "GitLab"].map((skill) => (
                <div key={skill} className="bg-border border border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-foreground transition-colors shrink-0 w-32">
                  <SkillIcon name={skill} size={32} />
                  <div className="text-sm font-medium">{skill}</div>
                </div>
              ))}
            </Marquee>
          </div>

          <Marquee speed={50} className="py-4">
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Machine Learning & AI</h3>
              <div className="flex flex-wrap gap-3">
                {["PyTorch", "TensorFlow", "Scikit-learn"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["RAG", "Agentic AI", "Model Deployment", "Hyperparameter Tuning", "ML Pipeline Automation", "Apache Spark"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Data Science & Analytics</h3>
              <div className="flex flex-wrap gap-3">
                {["Python", "Pandas", "NumPy"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["Data Preprocessing", "Statistical Analysis", "Data Visualization"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">MLOps & Automation</h3>
              <div className="flex flex-wrap gap-3">
                {["Kubernetes", "Docker", "Terraform", "Ansible", "Jenkins", "ArgoCD", "Helm", "GitLab"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["GitLab CI/CD", "Canary/Blue-Green Deployments"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Cloud & Containerization</h3>
              <div className="flex flex-wrap gap-3">
                {["GCP", "AWS", "Kubernetes", "Docker"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["Cloud Run", "Cloud Storage", "Vertex AI", "Vector Search", "GKE"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Databases</h3>
              <div className="flex flex-wrap gap-3">
                {["PostgreSQL", "MySQL"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["Google Cloud Storage"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Programming Languages</h3>
              <div className="flex flex-wrap gap-3">
                {["Python", "Go", "Java", "JavaScript", "HTML", "CSS", "Bash", "C++"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["SQL", "PowerShell"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Observability & Monitoring</h3>
              <div className="flex flex-wrap gap-3">
                {["Prometheus", "Grafana"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["ML Monitoring", "Datadog"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 shrink-0 w-80 mr-6">
              <h3 className="text-xl font-semibold mb-4">Collaboration & Workflow Tools</h3>
              <div className="flex flex-wrap gap-3">
                {["JIRA"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-background rounded">
                    <SkillIcon name={skill} size={20} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
                {["ServiceNow", "SharePoint"].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-background rounded text-sm">{skill}</span>
                ))}
              </div>
            </div>
          </Marquee>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="space-y-12">
            <div className="border-l-2 border-foreground pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-foreground rounded-full" />
              <div className="mb-2">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">Current</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">AI Research Intern</h3>
              <p className="text-white mb-2">Old Dominion University</p>
              <p className="text-white mb-4">January 2025 - Present (1 year)</p>
              <p className="text-white mb-4">Norfolk, Virginia, United States</p>
              <ul className="space-y-2 text-white">
                <li>• Designed and implemented machine learning models using PyTorch to support research on reliable AI systems, focusing on model robustness and performance evaluation.</li>
                <li>• Developed and integrated Retrieval-Augmented Generation (RAG) pipelines to enhance dataset quality and context relevance, improving model accuracy and research insights by 20%.</li>
                <li>• Created data mining and drift detection algorithms to analyze large datasets, generating actionable visual reports to monitor and explain model behavior over time.</li>
                <li>• Performed iterative model refinement and testing, leading to measurable improvements in performance and contributing to findings on reliable and scalable AI techniques.</li>
              </ul>
            </div>

            <div className="border-l-2 border-border pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-border rounded-full" />
              <h3 className="text-2xl font-semibold mb-2">Graduate Research Assistant</h3>
              <p className="text-white mb-2">Old Dominion University</p>
              <p className="text-white mb-4">October 2023 - May 2025 (1 year 8 months)</p>
              <p className="text-white mb-4">Norfolk, Virginia, United States</p>
              <div className="space-y-4 text-white">
                <div>
                  <p className="font-medium mb-2">Key Responsibilities:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Kubernetes: Hands-on experience with Jenkins job configurations, pipelines, and plugins</li>
                    <li>Infrastructure as Code: Terraform for provisioning VMs and managing multi-provider environments</li>
                    <li>Containerization: Docker, Container Orchestration, Debugging Docker logs</li>
                    <li>Configuration Management: Ansible and Ansible-Lint for orchestration and automation</li>
                    <li>Monitoring: Zabbix, Graylog, Prometheus & Grafana for Cluster Monitoring</li>
                    <li>Windows/Windows Server: Active Directory, GPO Configurations, DNS & DHCP, SCCM</li>
                    <li>Resolved 100+ tickets related to computer networks, configurations and hardware troubleshooting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-border pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-border rounded-full" />
              <h3 className="text-2xl font-semibold mb-2">Machine Learning Intern</h3>
              <p className="text-white mb-2">Campalin Innovations</p>
              <p className="text-white mb-4">July 2022 - September 2022 (3 months)</p>
              <ul className="space-y-2 text-white">
                <li>• Developed an AI customer support chatbot using a RAG pipeline with a ChromaDB vector database for efficient knowledge retrieval, integrated with a React.js and CSS frontend, reducing average response time by ~50%.</li>
                <li>• Implemented a Node.js backend to manage conversation workflows, API requests, and response selection, handling simulated user queries with ~85% correct response accuracy.</li>
                <li>• Collaborated with mentors and teammates to optimize data preprocessing, improve model performance, and enhance UI/UX, resulting in a 30% reduction in repetitive support queries during testing.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Projects</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* MedSim */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <div className="mb-4">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">Active</span>
              </div>
              <h3 className="text-3xl font-semibold mb-2">MedSim</h3>
              <p className="text-white mb-2">Virtual Patient Simulator | Jan 2025 – Present</p>
              <p className="text-white mb-6">
                Comprehensive medical simulation platform with AI-powered evaluation capabilities. 
                Re-architected into microservices with Hybrid RAG pipeline on GCP.
              </p>
              <ul className="space-y-2 text-white mb-6">
                <li>• Microservices architecture with React.js & FastAPI</li>
                <li>• Hybrid RAG pipeline using Vertex AI Vector Search & Gemini 2.5 Pro</li>
                <li>• Automated OSCE-style evaluation engine for real-time clinical performance analysis</li>
                <li>• Containerized deployment on Google Cloud Run with optimized cold-start</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                {["React.js", "FastAPI", "GCP", "Vertex AI", "RAG", "Docker", "Cloud Run"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-border rounded text-sm">{tech}</span>
                ))}
              </div>
            </div>

            {/* Clinical-Copilot */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <div className="mb-4">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">AI/ML</span>
              </div>
              <h3 className="text-3xl font-semibold mb-2">Clinical-Copilot</h3>
              <p className="text-white mb-2">AI-Powered Clinical Assistant | Oct 2025</p>
              <p className="text-white mb-6">
                Advanced AI system designed to assist healthcare professionals with clinical decision-making 
                and medical knowledge retrieval.
              </p>
              <ul className="space-y-2 text-white mb-6">
                <li>• AI-powered clinical assistance and decision support</li>
                <li>• Medical knowledge retrieval and processing</li>
                <li>• Python-based implementation</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python", "AI", "ML", "Healthcare"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-border rounded text-sm">{tech}</span>
                ))}
              </div>
              <a
                href="https://github.com/s0umith29/Clinical-Copilot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline inline-flex items-center gap-2"
              >
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Manuscript */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <div className="mb-4">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">AI Agent</span>
              </div>
              <h3 className="text-3xl font-semibold mb-2">Manuscript</h3>
              <p className="text-white mb-2">AI Agent for Documentation | Sep 2025</p>
              <p className="text-white mb-6">
                An AI-agent for internal documentation and querying. Streamlines knowledge management 
                and enables intelligent document search and retrieval.
              </p>
              <ul className="space-y-2 text-white mb-6">
                <li>• AI-powered document querying and retrieval</li>
                <li>• Internal documentation management system</li>
                <li>• Intelligent search and knowledge extraction</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                {["AI", "Documentation", "NLP", "Search"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-border rounded text-sm">{tech}</span>
                ))}
              </div>
              <a
                href="https://github.com/s0umith29/Manuscript"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline inline-flex items-center gap-2"
              >
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* AI-monitoring */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <div className="mb-4">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">MLOps</span>
              </div>
              <h3 className="text-3xl font-semibold mb-2">AI-monitoring</h3>
              <p className="text-white mb-2">MLOps Infrastructure | Feb 2025</p>
              <p className="text-white mb-6">
                Learning MLOps with Kubeflow and DevOps principles. Comprehensive monitoring and 
                management solution for machine learning workflows in production.
              </p>
              <ul className="space-y-2 text-white mb-6">
                <li>• Kubeflow-based MLOps pipeline</li>
                <li>• DevOps principles for ML lifecycle management</li>
                <li>• Production-ready monitoring and orchestration</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Kubeflow", "MLOps", "Kubernetes", "DevOps"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-border rounded text-sm">{tech}</span>
                ))}
              </div>
              <a
                href="https://github.com/s0umith29/AI-monitoring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline inline-flex items-center gap-2"
              >
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Transgaurd */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <div className="mb-4">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">AI/ML</span>
              </div>
              <h3 className="text-3xl font-semibold mb-2">Transgaurd</h3>
              <p className="text-white mb-2">Fraud Detection AI Model | Jun 2022</p>
              <p className="text-white mb-6">
                An artificial intelligence model detecting if a transaction is fraudulent or not using 
                transaction details. Machine learning-based fraud detection system.
              </p>
              <ul className="space-y-2 text-white mb-6">
                <li>• AI-powered fraud detection using transaction data</li>
                <li>• Machine learning classification model</li>
                <li>• Real-time transaction analysis</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python", "Machine Learning", "AI", "Fraud Detection"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-border rounded text-sm">{tech}</span>
                ))}
              </div>
              <a
                href="https://github.com/s0umith29/Transgaurd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline inline-flex items-center gap-2"
              >
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Education</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="space-y-8">
            <div className="border-l-2 border-foreground pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-foreground rounded-full" />
              <div className="text-sm text-white mb-2">2023 - 2025</div>
              <h3 className="text-2xl font-semibold mb-2">Master of Science - MS, Computer Science</h3>
              <p className="text-white mb-2">Old Dominion University</p>
              <p className="text-white">August 2023 - May 2025</p>
            </div>

            <div className="border-l-2 border-border pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-border rounded-full" />
              <div className="text-sm text-white mb-2">2019 - 2023</div>
              <h3 className="text-2xl font-semibold mb-2">Bachelor of Technology - BTech, Computer Science</h3>
              <p className="text-white mb-2">National Institute of Technology Puducherry</p>
              <p className="text-white">August 2019 - May 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-6 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Certifications</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-border border border-border rounded-lg p-6 hover:border-foreground transition-colors">
              <h3 className="text-xl font-semibold mb-2">CKA: Certified Kubernetes Administrator</h3>
              <p className="text-white mb-2">The Linux Foundation</p>
              <p className="text-sm text-white">April 2025</p>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 hover:border-foreground transition-colors">
              <h3 className="text-xl font-semibold mb-2">Networking Essentials</h3>
              <p className="text-white mb-2">Professional Certification</p>
              <p className="text-sm text-white">June 2022</p>
            </div>
            <div className="bg-border border border-border rounded-lg p-6 hover:border-foreground transition-colors">
              <h3 className="text-xl font-semibold mb-2">Introduction to Cybersecurity Tools & Cyber Attacks</h3>
              <p className="text-white mb-2">Professional Certification</p>
              <p className="text-sm text-white">July 2022</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Get in touch</h2>
          <div className="w-24 h-1 bg-foreground mb-12" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a
              href="mailto:soumith.odu@gmail.com"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-border rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Email</h3>
                <p className="text-white">soumith.odu@gmail.com</p>
              </div>
            </a>
            
            <a
              href="https://linkedin.com/in/soumith29"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-border rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">LinkedIn</h3>
                <p className="text-white">Connect with me professionally</p>
              </div>
            </a>
            
            <a
              href="https://github.com/s0umith29"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-border rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">GitHub</h3>
                <p className="text-white">Check out my code repositories</p>
              </div>
            </a>
            
            <a
              href="tel:+17577989998"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-border rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Phone</h3>
                <p className="text-white">+1 (757) 798-9998</p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="border border-border rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-2">Send a Message</h3>
            <p className="text-white mb-6">Have a project in mind? Let&apos;s discuss it.</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full bg-border border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full bg-border border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  rows={5}
                  placeholder="Tell me about your project or just say hello..."
                  className="w-full bg-border border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-foreground text-background rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://linkedin.com/in/soumith29"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://github.com/s0umith29"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="mailto:soumith.odu@gmail.com"
              className="text-white hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
          <p className="text-white">&copy; 2025 Sowmith Kuppa. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </main>
  );
}
 
