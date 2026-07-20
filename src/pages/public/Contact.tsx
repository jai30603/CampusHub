import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <Container className="py-8 space-y-6 max-w-2xl">
      <PageHeader
        title="Contact & Support"
        description="Have questions or feedback? Reach out to the CampusHub team."
      />

      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Your Name" placeholder="Alex Student" />
          <Input label="University Email" type="email" placeholder="alex@campus.edu" />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Message</label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              rows={4}
              placeholder="How can we help you?"
            />
          </div>
          <Button variant="primary" className="w-full">
            Submit Message
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};
