export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold">Sowmith Kuppa</div>
          <div className="flex gap-8">
            <a href="#about" className="hover:text-foreground transition-colors text-muted">About</a>
            <a href="#experience" className="hover:text-foreground transition-colors text-muted">Experience</a>
            <a href="#projects" className="hover:text-foreground transition-colors text-muted">Projects</a>
            <a href="#contact" className="hover:text-foreground transition-colors text-muted">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI/ML Engineer
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-8">
            Building reliable AI systems, scalable ML pipelines, and production-grade infrastructure
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 py-3 bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              Get In Touch
            </a>
            <a
              href="#projects"
              className="px-6 py-3 border border-border rounded hover:bg-border transition-colors"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">About</h2>
          <div className="space-y-6 text-muted">
            <p>
              I&apos;m a Master&apos;s student in Computer Science at Old Dominion University, 
              currently working as an AI Research Intern. My work focuses on building reliable 
              AI systems, implementing RAG pipelines, and developing scalable machine learning solutions.
            </p>
            <p>
              I specialize in the full ML lifecycle - from model development and training to 
              deployment and monitoring. I&apos;m passionate about MLOps, cloud infrastructure, 
              and automation, always looking for ways to make systems more efficient and maintainable.
            </p>
          </div>
          
          <div className="mt-12 p-6 border border-border rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Education</h3>
            <div>
              <h4 className="text-xl font-medium mb-2">M.Sc. in Computer Science</h4>
              <p className="text-muted mb-2">Old Dominion University, Norfolk, VA</p>
              <p className="text-muted mb-4">Aug 2023 – May 2025 | GPA: 3.84/4.0</p>
              <div>
                <p className="font-medium mb-2">Relevant Coursework:</p>
                <ul className="list-disc list-inside text-muted space-y-1">
                  <li>MLOps for Generative AI</li>
                  <li>Natural Language Processing</li>
                  <li>Intro to Data Science and Analytics</li>
                  <li>Cybersecurity Fundamentals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Experience</h2>
          
          <div className="space-y-12">
            {/* Job 1 */}
            <div className="border-l-2 border-foreground pl-6">
              <div className="mb-2">
                <span className="bg-foreground text-background px-2 py-1 rounded text-sm">Current</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">AI Research Intern</h3>
              <p className="text-muted mb-4">Old Dominion University, Norfolk, VA | Jan 2025 – Present</p>
              <ul className="space-y-2 text-muted">
                <li>• Designed ML models using PyTorch for reliable AI systems</li>
                <li>• Integrated RAG pipelines, improving model accuracy by 20%</li>
                <li>• Conducted A/B testing and controlled experiments with statistical analysis</li>
                <li>• Created data mining and drift detection algorithms with actionable visual reports</li>
                <li>• Performed iterative model refinement leading to measurable performance improvements</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">PyTorch</span>
                <span className="px-3 py-1 bg-border rounded text-sm">RAG</span>
                <span className="px-3 py-1 bg-border rounded text-sm">A/B Testing</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Data Mining</span>
              </div>
            </div>

            {/* Job 2 */}
            <div className="border-l-2 border-border pl-6">
              <h3 className="text-2xl font-semibold mb-2">Graduate Research Assistant</h3>
              <p className="text-muted mb-4">Old Dominion University, Norfolk, VA | Aug 2023 – May 2025</p>
              <ul className="space-y-2 text-muted">
                <li>• Deployed infrastructure with Ansible/Terraform, reducing provisioning time by 40%</li>
                <li>• Automated CI/CD pipelines with Jenkins, shortening deployment cycles by 30%</li>
                <li>• Engineered monitoring solutions maintaining 99.9% uptime</li>
                <li>• Resolved 100+ hardware and software issues across Windows, Linux, and MacOS</li>
                <li>• Conducted routine system checks, patching, and updates for compliance</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">Ansible</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Terraform</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Jenkins</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Prometheus</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Grafana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Projects</h2>
          
          <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
            <div className="mb-2">
              <span className="bg-foreground text-background px-2 py-1 rounded text-sm">Active</span>
            </div>
            <h3 className="text-3xl font-semibold mb-2">MedSim</h3>
            <p className="text-muted mb-2">Virtual Patient Simulator | Jan 2025 – Present</p>
            <p className="text-muted mb-6">
              Comprehensive medical simulation platform with AI-powered evaluation capabilities. 
              Re-architected into microservices with Hybrid RAG pipeline on GCP.
            </p>
            <ul className="space-y-2 text-muted mb-6">
              <li>• Microservices architecture with React.js & FastAPI</li>
              <li>• Hybrid RAG pipeline using Vertex AI Vector Search & Gemini 2.5 Pro</li>
              <li>• Automated OSCE-style evaluation engine for real-time clinical performance analysis</li>
              <li>• Containerized deployment on Google Cloud Run with optimized cold-start</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-border rounded text-sm">React.js</span>
              <span className="px-3 py-1 bg-border rounded text-sm">FastAPI</span>
              <span className="px-3 py-1 bg-border rounded text-sm">GCP</span>
              <span className="px-3 py-1 bg-border rounded text-sm">Vertex AI</span>
              <span className="px-3 py-1 bg-border rounded text-sm">RAG</span>
              <span className="px-3 py-1 bg-border rounded text-sm">Docker</span>
              <span className="px-3 py-1 bg-border rounded text-sm">Cloud Run</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Skills</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">AI/ML</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">PyTorch</span>
                <span className="px-3 py-1 bg-border rounded text-sm">TensorFlow</span>
                <span className="px-3 py-1 bg-border rounded text-sm">RAG</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Scikit-learn</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Agentic AI</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">MLOps & Cloud</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">Kubernetes (CKA)</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Docker</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Terraform</span>
                <span className="px-3 py-1 bg-border rounded text-sm">GCP</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Jenkins</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Programming</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">Python</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Go</span>
                <span className="px-3 py-1 bg-border rounded text-sm">SQL</span>
                <span className="px-3 py-1 bg-border rounded text-sm">JavaScript</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Bash</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Observability</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-border rounded text-sm">Prometheus</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Grafana</span>
                <span className="px-3 py-1 bg-border rounded text-sm">Datadog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-muted mb-12 text-lg">
            I&apos;m always open to discussing new opportunities, interesting projects, 
            or collaborating on AI/ML initiatives. Let&apos;s build something amazing together.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="mailto:soumith.odu@gmail.com"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted">soumith.odu@gmail.com</p>
            </a>
            
            <a
              href="tel:+17577989998"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted">+1 (757) 798-9998</p>
            </a>
            
            <a
              href="https://linkedin.com/in/soumith29"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">LinkedIn</h3>
              <p className="text-muted">linkedin.com/in/soumith29</p>
            </a>
            
            <a
              href="https://github.com/s0umith29"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-border rounded-lg hover:border-foreground transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">GitHub</h3>
              <p className="text-muted">github.com/s0umith29</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-muted">
          <p>&copy; 2025 Sowmith Kuppa. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
