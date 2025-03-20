
import Navigation from '@/components/Navigation/Navigation';
import NewQuestionPage from '@/components/NewQuestion/NewQuestion';


export default async function NySpuriningPage({
  params,
}: {
  params: Promise<{ flokkur: string }>;
}) {
  const { flokkur } = await params;

  return (
    <div>
      <Navigation />
      <NewQuestionPage slug={flokkur} />
    </div>
  );
}