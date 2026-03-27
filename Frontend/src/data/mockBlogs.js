export const mockBlogs = [
  {
    id: 1001,
    title: "The Future of Minimalist Design",
    description: "How less became more in the digital age of 2026.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    date: "Mar 12, 2026",
    likes: 120,
    dislikes: 5,
    saves: 45,
    author: {
      name: "Felix Montgomery",
      role: "Lead UI Designer",
      description: "Felix specializes in minimalist digital aesthetics and has transformed how leading tech companies approach white space.",
      seed: "Felix"
    }
  },
  {
    id: 1002,
    title: "React Compiler: Under the Hood",
    description: "Understanding how the new compiler optimizes your UI automatically.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    date: "Mar 10, 2026",
    likes: 10,
    dislikes: 50,
    saves: 2,
    author: {
      name: "Sarah Jenkins",
      role: "Core Developer",
      description: "Sarah is a performance enthusiast who loves tearing down JavaScript frameworks to understand what makes them tick.",
      seed: "Sarah"
    }
  },
  {
    id: 1003,
    title: "Sustainable Tech Ecosystems",
    description: "Building software that lasts longer and consumes less energy.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    category: "Environment",
    date: "Mar 08, 2026",
    likes: 125,
    dislikes: 70,
    saves: 88,
    author: {
      name: "David Chen",
      role: "Environmental Engineer",
      description: "David bridges the gap between software engineering and sustainable infrastructure, advocating for green computing.",
      seed: "David"
    }
  },
  {
    id: 1004,
    title: "The Ultimate Guide to Advanced CSS Architecture in 2026",
    description: "A deep dive into how large scalable applications structure their styling using modern native CSS features.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    date: "Mar 05, 2026",
    likes: 310,
    dislikes: 12,
    saves: 150,
    content: `
      <p>Cascading Style Sheets (CSS) have evolved significantly since their inception. In 2026, the way we structure our styling has shifted heavily towards leveraging native CSS capabilities over heavy preprocessors.</p>
      <br />
      <h3>The Rise of Native Features</h3>
      <p>Features like CSS Variables, native nesting, and wide gamut color spaces have made traditional tooling like SASS less necessary for many projects. Modern web applications require a thoughtful architectural approach that emphasizes predictability, reusability, and maintainability.</p>
      <br />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <br />
      <h3>Container Queries are the New Media Queries</h3>
      <p>Responsive design is no longer just about the viewport. With container queries, components can adapt to their parent container's size, unlocking a new level of modularity. This shift necessitates a reevaluation of how we name and scope our CSS classes.</p>
      <br />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
      <br />
      <p>Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.</p>
      <br />
      <h3>Conclusion</h3>
      <p>As we move forward, the focus must remain on creating styling architectures that are both flexible enough to accommodate changing design requirements and robust enough to avoid technical debt.</p>
    `
  },
  {
    id: 1005,
    title: "Understanding Serverless PostgreSQL at Scale",
    description: "How we migrated a million-dollar business to a fully serverless database model and saved 80% on costs.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    date: "Mar 01, 2026",
    likes: 450,
    dislikes: 3,
    saves: 210,
    content: `
      <p>Scaling a database is historically one of the most challenging aspects of web engineering. We recently migrated a high-traffic, million-dollar web application from a traditional provisioned PostgreSQL cluster to a fully serverless architecture.</p>
      <br />
      <h3>The Provisioning Problem</h3>
      <p>In traditional setups, you pay for peak capacity even during off-peak hours. This over-provisioning results in massive waste. Serverless databases solve this by scaling compute resources up and down seamlessly in response to workload demands.</p>
      <br />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum, purus sed finibus tempor, mauris odio dapibus est, non vulputate dui lectus scelerisque arcu. Integer sagittis in est nec varius. Maecenas ac erat non lorem aliquet blandit et eget risus. Vestibulum tristique sapien in tortor suscipit finibus.</p>
      <br />
      <h3>Connection Pooling the Serverless Way</h3>
      <p>When computing resources scale automatically, connection pooling becomes critical. Traditional connection pooling approaches like PgBouncer must be adapted for ephemeral serverless functions to avoid connection exhaustion.</p>
      <br />
      <p>Sed id ullamcorper dui. Sed sit amet justo nec elit consectetur eleifend in a neque. In hac habitasse platea dictumst. Morbi in rhoncus lorem. Aliquam elementum tristique massa, quis tristique orci sagittis et.</p>
      <br />
      <p>Curabitur eleifend, nulla convallis sollicitudin porta, nibh augue pretium odio, et vehicula velit arcu eu dui. Cras eu est tincidunt, efficitur velit ac, finibus dolor.</p>
      <br />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
      <br />
      <p>Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.</p>
      <br />
      <h3>The Bottom Line</h3>
      <p>Not only did we achieve perfectly elastic scaling, but we also reduced our monthly infrastructure bill by an astounding 80%.</p>
    `
  },
  {
    id: 1006,
    title: "The Immutable Architecture: Building for the Next Millennium",
    description: "A comprehensive, deep-dive manifesto on resilient software design, state management, and the philosophy of immutable infrastructure.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    category: "Architecture",
    date: "Feb 20, 2026",
    likes: 890,
    dislikes: 12,
    saves: 450,
    content: (() => {
      const paragraph = "The rapid evolution of technology has continually reshaped the landscape of software engineering and design conventions. As we push the boundaries of what is possible, the essential complexity of our systems increases exponentially. We must continuously adapt our paradigms, frameworks, and methodologies to manage this complexity, ensuring that our applications remain maintainable, scalable, and resilient in the face of ever-changing requirements. This requires not just technical acumen, but a deep understanding of human-computer interaction, system architecture, and the fundamental principles of computation. It is a journey of continuous learning and unyielding curiosity, where every solved problem reveals a new set of challenges waiting to be addressed. ";
      let html = "<h3>Introduction to Immutable Systems</h3><br/>";
      for (let i = 1; i <= 140; i++) {
        html += "<p>" + paragraph + "</p><br/>";
        if (i % 10 === 0 && i !== 140) {
          html += "<h3>Chapter " + (i / 10 + 1) + ": Deepening the Paradigm</h3><br/>";
        }
      }
      return html;
    })()
  },
  {
    id: 1007,
    title: "Quantum Computing: A Developer's Practical Guide",
    description: "An exhaustive exploration of quantum algorithms, qubit manipulation, and how traditional developers can prepare for the quantum shift.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    date: "Feb 15, 2026",
    likes: 1200,
    dislikes: 45,
    saves: 890,
    content: (() => {
      const paragraph = "Quantum mechanics introduces phenomena such as superposition and entanglement, which challenge our classical intuitions about computing. A qubit can exist in a state that is a complex linear combination of both zero and one, allowing quantum algorithms to explore vast solution spaces simultaneously. This fundamentally alters the computational complexity classes of many problems, turning intractable cryptographic puzzles into solvable functions. However, harnessing this power requires a complete reimagining of logic gates, error correction, and algorithm design. The transition from classical bits to quantum states is not merely a hardware upgrade, but a profound philosophical shift in how we approach problem-solving in computer science. ";
      let html = "<h3>The Quantum Dawn</h3><br/>";
      for (let i = 1; i <= 150; i++) {
        html += "<p>" + paragraph + "</p><br/>";
        if (i % 15 === 0 && i !== 150) {
          html += "<h3>Module " + (i / 15 + 1) + ": Advanced Quantum Mechanics</h3><br/>";
        }
      }
      return html;
    })()
  },
  {
    id: 1008,
    title: "Typography Rules for Modern UIs",
    description: "Choosing the perfect font pairing to maximize conversion rates and aesthetic appeal.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    date: "Jan 30, 2026",
    likes: 410,
    dislikes: 8,
    saves: 95,
    content: "<p>Typography is the foundation of digital design. An inappropriate font can severely impact readibility...</p>"
  },
  {
    id: 1009,
    title: "Dark Mode: Beyond Just Inverting Colors",
    description: "Why creating a true dark mode requires an entirely separate color palette and depth logic.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    date: "Jan 18, 2026",
    likes: 890,
    dislikes: 12,
    saves: 320,
    content: "<p>Creating an effective dark mode means rebuilding contrast rules from the ground up...</p>"
  },
  {
    id: 1010,
    title: "The Death of Localhost: Cloud Development Environments",
    description: "Why your next big project won't require a local environment setup at all.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    date: "Jan 10, 2026",
    likes: 1540,
    dislikes: 67,
    saves: 980,
    content: "<p>The era of spending days configuring local development environments is over...</p>"
  },
  {
    id: 1011,
    title: "Building Apps for a Zero-Carbon World",
    description: "Practical steps engineers can take to minimize data center energy consumption.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
    category: "Environment",
    date: "Jan 05, 2026",
    likes: 560,
    dislikes: 4,
    saves: 120,
    content: "<p>Every megabyte of data transferred requires electricity. We must build with efficiency first...</p>"
  },
  {
    id: 1012,
    title: "E-Waste and the Hardware Upgrade Cycle",
    description: "How bloated software forces users to upgrade perfectly good hardware prematurely.",
    image: "https://images.unsplash.com/photo-1611078488975-c15f9b4bc044?auto=format&fit=crop&q=80&w=800",
    category: "Environment",
    date: "Dec 20, 2025",
    likes: 720,
    dislikes: 34,
    saves: 215,
    content: "<p>When we write inefficient code, we don't just waste battery; we force hardware obsolescence...</p>"
  }
];