import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, FileText, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/notes" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center animate-slide-up">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary shadow-glow mb-6">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            NoteMark
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A beautiful, distraction-free space for your notes and bookmarks. 
            Organize your thoughts, save important links, and find everything instantly.
          </p>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-gradient text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-20">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Notes</h2>
            <p className="text-muted-foreground">
              Write and organize your thoughts with beautiful, simple notes. 
              Add tags to keep everything organized and searchable.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Bookmark className="w-7 h-7 text-accent" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Bookmarks</h2>
            <p className="text-muted-foreground">
              Save important links with descriptions and tags. 
              Never lose track of that article or resource again.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-muted-foreground text-sm">
          <p>Built with care for your productivity</p>
        </div>
      </div>
    </div>
  );
}
