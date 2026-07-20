import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormInput } from '@/components/auth/FormInput';
import { SelectField } from '@/components/auth/SelectField';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { AvatarUploader } from '@/components/dashboard/AvatarUploader';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import { CheckCircle2, User, Mail, GraduationCap, Star, ShieldCheck, Bookmark } from 'lucide-react';

const COLLEGE_OPTIONS = [
  { label: 'IIT Bombay', value: 'IIT Bombay' },
  { label: 'BITS Pilani', value: 'BITS Pilani' },
  { label: 'NIT Trichy', value: 'NIT Trichy' },
  { label: 'Delhi University', value: 'Delhi University' },
  { label: 'IIT Madras', value: 'IIT Madras' },
];

const YEAR_OPTIONS = [
  { label: 'Freshman (1st Year)', value: 'Freshman (1st Year)' },
  { label: 'Sophomore (2nd Year)', value: 'Sophomore (2nd Year)' },
  { label: 'Junior (3rd Year)', value: 'Junior (3rd Year)' },
  { label: 'Senior (4th Year)', value: 'Senior (4th Year)' },
  { label: 'Graduate / Postgraduate', value: 'Graduate / Postgraduate' },
];

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [college, setCollege] = useState('IIT Bombay');
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('Senior (4th Year)');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reputation Summary states
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0.0);
  const [completedDeals, setCompletedDeals] = useState(0);
  const [starDistribution, setStarDistribution] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  // Fetch latest profile details from FastAPI backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiRequest('/users/profile');
        if (response.success && response.data) {
          const u = response.data;
          setFullName(u.full_name);
          setEmail(u.email);
          setCollege(u.college || 'IIT Bombay');
          setDepartment(u.department || '');
          setAcademicYear(u.academic_year || '');
          if (u.avatar) {
            setAvatarUrl(u.avatar);
          }

          // Fetch reputation stats
          const repResponse = await apiRequest(`/reviews/user/${u.id}`);
          if (repResponse.success && repResponse.data) {
            const data = repResponse.data;
            setReviews(data.reviews || []);
            setTotalReviews(data.total_reviews || 0);
            setAverageRating(data.average_rating || 0.0);
            setStarDistribution(data.star_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
            setCompletedDeals(data.completed_deals || 0);
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: fullName,
          college: college,
          department: department,
          academic_year: academicYear,
          avatar: avatarUrl,
        }),
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Profile"
        description="View and update your student account information and public campus card"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar Uploader & Rating Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AvatarUploader
                currentAvatarUrl={avatarUrl}
                onAvatarUpdated={(newUrl) => setAvatarUrl(newUrl)}
              />
            </CardContent>
          </Card>

          {/* Reputation Stats Summary Card */}
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0 pb-2 border-b border-border/80">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Reputation Summary</span>
                <span className="text-[10px] text-muted-foreground">{completedDeals} completed deals</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-foreground">{averageRating}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/35'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{totalReviews} reviews received</span>
                </div>
              </div>

              {/* Star Progress Distribution Bars */}
              <div className="space-y-2 pt-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = starDistribution[stars] || 0;
                  const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right font-bold">{stars}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-muted-foreground text-[10px] font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form & Recent Reviews */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Personal Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <ErrorMessage title="Update Error" message={error} />}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                />

                <FormInput
                  label="University Email (.edu)"
                  value={email}
                  disabled
                  helperText="Email address cannot be changed."
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="College / Campus"
                    options={COLLEGE_OPTIONS}
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                  <SelectField
                    label="Academic Year"
                    options={YEAR_OPTIONS}
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  />
                </div>

                <FormInput
                  label="Department / Major"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                />

                <div className="pt-2">
                  <LoadingButton type="submit" variant="primary" isLoading={isLoading}>
                    Save Profile Changes
                  </LoadingButton>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Historical Reviews List Card */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold">Peer Reviews Received</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4 divide-y divide-border/60">
              {reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  You haven't received any peer reviews yet. Complete sales/reservations to build your reputation score.
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{rev.reviewer?.full_name}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {rev.listing && (
                      <p className="text-[10px] text-primary font-semibold">
                        Item: {rev.listing.title}
                      </p>
                    )}

                    {rev.comment && (
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
