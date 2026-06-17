import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Elegant Serif + Depth Design System
 * - Warm cream background with deep charcoal text
 * - Signature teal accent for highlights and CTAs
 * - Playfair Display serif for headlines, Inter sans-serif for body
 * - Subtle shadows and layered depth throughout
 * - Smooth scroll reveals and hover animations
 */

interface SkillCategory {
  category: string;
  skills: string[];
}

interface Project {
  title: string;
  description: string;
  tags: string[];
}

export default function Home() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  const skillCategories: SkillCategory[] = [
    {
      category: "Frontend",
      skills: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
      category: "Backend",
      skills: ["C Language", "Problem Solving", "Data Structures"],
    },
    {
      category: "Tools",
      skills: ["Git", "VS Code", "Web Development"],
    },
  ];

  const projects: Project[] = [
    {
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio showcasing projects and skills with elegant design principles.",
      tags: ["HTML", "CSS", "JavaScript"],
    },
    {
      title: "Problem Solving Projects",
      description:
        "Various algorithmic challenges and data structure implementations in C.",
      tags: ["C", "Algorithms", "Problem Solving"],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "about",
        "skills",
        "education",
        "projects",
        "contact",
      ];
      const newVisible = new Set<string>();

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.75) {
            newVisible.add(section);
          }
        }
      });

      setVisibleSections(newVisible);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663698702264/2aGwyK3arsapUYEJFiMCmp/portfolio-logo-9HjWcAG7QpKmVJVmdomajj.webp"
              alt="Navin"
              className="w-8 h-8"
            />
            <span className="font-serif font-bold text-lg">Navin</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Skills
            </a>
            <a
              href="#education"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Education
            </a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className={`relative overflow-hidden transition-opacity duration-1000 ${
          visibleSections.has("hero") ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663698702264/2aGwyK3arsapUYEJFiMCmp/hero-background-n2aPdGCZMjcijiARLx6DR9.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Name & Intro */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                Mohd. Navin
              </h1>
              <p className="text-xl text-muted-foreground mt-2" style={{color: '#213533'}}>
                Sarvr Ansari
              </p>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Diploma Student in Computer Science & Engineering. Passionate
              about crafting elegant digital experiences through clean code and
              thoughtful design.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10"
              >
                View Projects
              </Button>
            </div>
          </div>

          {/* Right: Profile Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-80 md:w-72 md:h-96">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
              {/* Photo frame with shadow */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                <img
                  src="/manus-storage/IMG-20250912-WA0000(1)_9f853c0e.jpg"
                  alt="Mohd. Navin Sarvr Ansari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accent Divider */}
      <div className="container py-8">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663698702264/2aGwyK3arsapUYEJFiMCmp/accent-divider-j6QQpLNsEm5ksWWoDpHatC.webp"
          alt="divider"
          className="w-full h-1 opacity-60"
        />
      </div>

      {/* About Section */}
      <section
        id="about"
        className={`container py-16 md:py-24 transition-all duration-1000 transform ${
          visibleSections.has("about")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-4xl font-serif font-bold mb-12 relative pb-4">
          About Me
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary rounded-full" />
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              I'm a Diploma student in Computer Science & Engineering at
              Government Polytechnic Mau, passionate about building elegant and
              efficient digital solutions.
            </p>
            <p>
              With a strong foundation in web development, programming, and
              problem-solving, I'm committed to continuous learning and
              delivering high-quality work.
            </p>
            <p>
              I believe in writing clean, maintainable code and creating
              user-centric experiences that make a difference.
            </p>
          </div>
          <Card className="p-8 bg-secondary/50 border-border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">
              Quick Facts
            </h3>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>
                  <strong>Education:</strong> Diploma in CSE, Government
                  Polytechnic Mau
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>
                  <strong>Focus:</strong> Web Development & Problem Solving
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>
                  <strong>Status:</strong> Available for freelance & full-time
                  roles
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>
                  <strong>Passion:</strong> Clean code & elegant design
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className={`container py-16 md:py-24 transition-all duration-1000 transform ${
          visibleSections.has("skills")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-4xl font-serif font-bold mb-12 relative pb-4">
          Skills
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary rounded-full" />
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <Card
              key={idx}
              className={`p-8 bg-white border-border shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 transform ${
                visibleSections.has("skills")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <h3 className="font-serif text-xl font-bold mb-6 text-primary">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className={`container py-16 md:py-24 transition-all duration-1000 transform ${
          visibleSections.has("education")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-4xl font-serif font-bold mb-12 relative pb-4">
          Education
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary rounded-full" />
        </h2>
        <Card className="p-8 bg-secondary/30 border-primary/30 shadow-md">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-serif font-bold text-primary">
                📚
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Diploma in Computer Science & Engineering
              </h3>
              <p className="text-primary font-semibold mt-2">
                Government Polytechnic Mau
              </p>
              <p className="text-foreground/70 mt-3">
                Pursuing a comprehensive diploma program with focus on web
                development, programming fundamentals, and problem-solving
                skills.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className={`container py-16 md:py-24 transition-all duration-1000 transform ${
          visibleSections.has("projects")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-4xl font-serif font-bold mb-12 relative pb-4">
          Projects
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary rounded-full" />
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <Card
              key={idx}
              className={`p-8 border-border shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 transform ${
                visibleSections.has("projects")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {project.title}
              </h3>
              <p className="text-foreground/70 mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto"
              >
                Learn More
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`container py-16 md:py-24 transition-all duration-1000 transform ${
          visibleSections.has("contact")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-4xl font-serif font-bold mb-12 relative pb-4">
          Get in Touch
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary rounded-full" />
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              I'm always interested in hearing about new projects and
              opportunities. Feel free to reach out if you'd like to
              collaborate or just say hello!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <a
                  href="mailto:navinsarvr2006@gmail.com"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  navinsarvr2006@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Github className="w-6 h-6 text-primary" />
                <a
                  href="#"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  github.com/navin
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Linkedin className="w-6 h-6 text-primary" />
                <a
                  href="https://www.linkedin.com/in/mohd-navin-sarvar-ansari-0552b3402/"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  linkedin.com/in/navin
                </a>
              </div>
            </div>
          </div>
          <Card className="p-8 bg-primary/5 border-primary/30 shadow-md">
            <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">
              Send a Message
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-none"
                  placeholder="Your message..."
                  rows={4}
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 bg-secondary/20">
        <div className="container text-center text-foreground/60 text-sm">
          <p>
            © 2026 Mohd. Navin Sarvr Ansari. Crafted with care and clean code.
          </p>
        </div>
      </footer>
    </div>
  );
}
