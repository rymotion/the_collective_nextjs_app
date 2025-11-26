import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { PageLayout } from '@/components/layouts';
import PitchDetailClient from '@/components/pitch/PitchDetailClient';
import { PitchesService } from '@/services/pitches.service';

interface PitchPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function PitchPage({ params }: PitchPageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUser = session?.user;

  let pitch = null;

  try {
    pitch = await PitchesService.getPitch(id);
    if (!pitch) {
      notFound();
    }
  } catch (err) {
    console.error('Error loading pitch:', err);
    notFound();
  }

  const isOwner = currentUser?.id === pitch.author_id;

  return (
    <PageLayout maxWidth="normal">
      <PitchDetailClient pitch={pitch} isOwner={isOwner} />
    </PageLayout>
  );
}
