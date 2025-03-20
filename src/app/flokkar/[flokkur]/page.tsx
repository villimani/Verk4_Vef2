import { Category } from '@/components/Category/Category';
import Navigation from '@/components/Navigation/Navigation';
import Questions from '@/components/Questions/Questions';

export default async function FlokkaPage({
  params,
}: {
  params: Promise<{ flokkur: string }>;
}) {
  const { flokkur } = await params;

  return (
    <div>
      <Navigation />
      <Category slug={flokkur}/>
      <Questions slug={flokkur} />
    </div>
  );
}