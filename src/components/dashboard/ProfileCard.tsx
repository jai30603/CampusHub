import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Mail, MapPin, GraduationCap, Calendar } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  email: string;
  college: string;
  department?: string;
  academicYear?: string;
  avatarUrl?: string;
  role?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  college,
  department,
  academicYear,
  avatarUrl,
  role = 'Student',
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent" />
      <CardHeader className="p-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end gap-4">
        <div className="w-20 h-20 rounded-full border-4 border-card bg-primary/10 text-primary font-bold text-xl flex items-center justify-center -mt-10 overflow-hidden shrink-0 shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            name.substring(0, 2).toUpperCase()
          )}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            <Badge variant="secondary" className="text-[10px]">
              {role}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {email}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 space-y-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent/50">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <MapPin className="w-4 h-4 text-primary" /> College / Campus
          </span>
          <span className="font-semibold text-foreground">{college}</span>
        </div>

        {department && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent/50">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <GraduationCap className="w-4 h-4 text-primary" /> Department
            </span>
            <span className="font-semibold text-foreground">{department}</span>
          </div>
        )}

        {academicYear && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent/50">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Calendar className="w-4 h-4 text-primary" /> Academic Year
            </span>
            <span className="font-semibold text-foreground">{academicYear}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent/50">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Account Status
          </span>
          <span className="font-bold text-emerald-500">Verified Student</span>
        </div>
      </CardContent>
    </Card>
  );
};
