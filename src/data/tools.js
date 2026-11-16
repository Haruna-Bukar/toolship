import {
  FileText,
  Share2,
  Mail,
  ShoppingBag,
  Users,
  ListTree,
  Code2,
  GraduationCap,
  PenLine,
  Megaphone,
} from "lucide-react";

// One array drives the whole grid. Set live: true when a tool is ready.
export const tools = [
  { slug: "resume-optimizer", title: "AI Resume Optimizer", description: "Tailor your resume to any job description in seconds", icon: FileText, live: true },
  { slug: "caption-generator", title: "AI Social Media Caption Generator", description: "Create engaging captions for Instagram, X & LinkedIn", icon: Share2, live: true },
  { slug: "email-reply-writer", title: "AI Email Reply Writer", description: "Draft professional email replies instantly", icon: Mail, live: false },
  { slug: "product-description-writer", title: "AI Product Description Writer", description: "Write compelling product descriptions that convert", icon: ShoppingBag, live: true },
  { slug: "meeting-summarizer", title: "AI Meeting Summarizer", description: "Turn meeting transcripts into clear summaries", icon: Users, live: false },
  { slug: "blog-outliner", title: "AI Blog Post Outliner", description: "Generate structured outlines for blog posts", icon: ListTree, live: false },
  { slug: "code-commenter", title: "AI Code Commenter", description: "Add clear comments and docs to your code", icon: Code2, live: false },
  { slug: "study-notes-generator", title: "AI Study Notes Generator", description: "Transform notes & lessons into study-ready summaries", icon: GraduationCap, live: false },
  { slug: "cover-letter-writer", title: "AI Cover Letter Writer", description: "Craft tailored cover letters for any role", icon: PenLine, live: false },
  { slug: "ad-copy-generator", title: "AI Ad Copy Generator", description: "Create high-converting ad copy for campaigns", icon: Megaphone, live: false },
];