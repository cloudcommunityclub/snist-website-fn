/**
 * Blog post data — C3 Cloud Community Club
 *
 * To add a new post: append an object to the `BLOG_POSTS` array below.
 * For images: prefer hosting on /public/assets/blog/ and using a relative path.
 * Unsplash placeholders are used until real cover images are provided.
 *
 * Fields:
 *   id       — unique numeric ID (increment)
 *   title    — post title shown on the card
 *   excerpt  — 1–2 sentence summary shown on the card
 *   author   — author name (can be "C³ R&D Team", a person, etc.)
 *   date     — human-readable publish date, e.g. "Jan 05, 2026"
 *   readTime — e.g. "5 min read"
 *   category — must be one of BLOG_CATEGORIES (except "All")
 *   image    — URL string (relative /assets/... or absolute https://...)
 *   tags     — array of keyword strings shown as hashtag chips
 */

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "The Future of Cloud Computing: Serverless & Beyond",
        excerpt: "Exploring how serverless architecture is reshaping the way we build and deploy applications, focusing on cost-efficiency and scalability.",
        author: "Sathwiik B",
        date: "Oct 15, 2025",
        readTime: "5 min read",
        category: "Cloud",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        tags: ["Serverless", "AWS", "Architecture"]
    },
    {
        id: 2,
        title: "Building Microservices with Go and gRPC",
        excerpt: "A deep dive into constructing high-performance microservices using GoLang and gRPC, geared towards students entering the backend field.",
        author: "Nithin K",
        date: "Nov 02, 2025",
        readTime: "8 min read",
        category: "DevOps",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Golang", "Microservices", "Backend"]
    },
    {
        id: 3,
        title: "AI Agents: The Next Frontier in Automation",
        excerpt: "Understanding the rise of autonomous AI agents and how they differ from traditional chatbots — practical use cases and implementation strategies.",
        author: "C³ R&D Team",
        date: "Dec 10, 2025",
        readTime: "6 min read",
        category: "AI/ML",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop",
        tags: ["AI", "Automation", "Agents"]
    },
    {
        id: 4,
        title: "Open Source: Your Gateway to Big Tech",
        excerpt: "Why contributing to open source is the single best way to sharpen your skills and get noticed by top tech companies.",
        author: "Community Lead",
        date: "Jan 05, 2026",
        readTime: "4 min read",
        category: "Community",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Open Source", "Career", "Git"]
    }
];

/** Filter categories shown in the blog UI. "All" must remain first. */
export const BLOG_CATEGORIES = ["All", "Cloud", "AI/ML", "DevOps", "Community", "Security"] as const;
