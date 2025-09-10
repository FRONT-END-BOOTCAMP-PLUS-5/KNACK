import AiSearch from '@/components/ai-search/AiSearch';
import { createMetaData } from '@/utils/createMetaData';
import { Metadata } from 'next';

export const metadata: Metadata = createMetaData({
  title: 'AI SEARCH | KNACK',
  description: '이미지를 업로드해서 비슷한 상품을 찾아보세요.',
});

const AiSearchPage = () => {
  return <AiSearch />;
};

export default AiSearchPage;
