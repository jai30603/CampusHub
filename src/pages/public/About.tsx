import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';

export const About: React.FC = () => {
  return (
    <Container className="py-12 space-y-10 max-w-4xl">
      <PageHeader
        title="About CampusHub"
        description="Simplifying campus commerce and building local student trust across India"
      />

      {/* Why the Project Exists / Vision */}
      <Card className="overflow-hidden border-border hover:border-primary/30 transition-all">
        <CardContent className="pt-8 px-6 sm:px-8 space-y-6 leading-relaxed">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">The CampusHub Vision</h2>
          <p className="text-sm text-muted-foreground">
            CampusHub is an exclusive peer-to-peer campus marketplace designed specifically for colleges and universities in India. The platform exists to address a common student challenge: textbooks, calculators, engineering tools, lab manuals, and hostel gear are expensive to purchase brand-new, yet students who graduate or finish semesters have no easy, secure way to pass them down.
          </p>
          <p className="text-sm text-muted-foreground">
            By limiting platform registration to verified university email addresses, CampusHub builds a circle of trust directly on campus. Students can list items they no longer need, negotiate prices in a secure environment, and arrange for simple on-campus handovers — eliminating packing, shipping fees, and public classified site safety hazards.
          </p>
        </CardContent>
      </Card>

      {/* Project Evolution */}
      <Card className="overflow-hidden border-border hover:border-primary/30 transition-all">
        <CardContent className="pt-8 px-6 sm:px-8 space-y-6 leading-relaxed">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Project Evolution & Architecture</h2>
          <p className="text-sm text-muted-foreground">
            Originally developed in the third year of engineering under the name <strong className="text-foreground font-semibold">Student Saver</strong>, the project was initially built with a basic feature set focused solely on textbook exchanges between seniors and juniors.
          </p>
          <p className="text-sm text-muted-foreground">
            Recognizing the broader needs of student life, the platform was completely redesigned and renamed to <strong className="text-foreground font-semibold">CampusHub</strong>. The v1.0.0 architecture has been completely rewritten from scratch using a modern high-performance stack:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Frontend:</strong> React 19, TypeScript, Tailwind CSS v4, React Router v7, and Lucide React.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Backend:</strong> FastAPI (Python 3.12) REST API structured around clean repository patterns.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Database:</strong> PostgreSQL (via Supabase in production) utilizing SQLAlchemy 2.0 ORM and Alembic migrations.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Storage:</strong> Cloudinary integration for secure and responsive student media uploads.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* About the Developer */}
      <Card className="overflow-hidden border-border hover:border-primary/30 transition-all bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardContent className="pt-8 px-6 sm:px-8 space-y-6 leading-relaxed">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">About the Developer</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center border border-primary/20 shrink-0">
              JS
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Jailingam Santhanakumar</h3>
              <p className="text-sm text-muted-foreground">
                Jailingam is a passionate software engineer specializing in Full Stack Web Development, Python Backend Engineering, and UI/UX Design. Driven by continuous learning and software craftsmanship, he builds applications that combine architectural clean-code practices with polished user interfaces.
              </p>
              <p className="text-xs text-muted-foreground/80 italic">
                Development Note: AI tools were leveraged as intelligent coding assistants during research, architectural planning, UI micro-interaction refinement, and documentation phases. The final application design, database schema structure, feature implementation, and overall project direction were fully designed, managed, and executed by the developer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

