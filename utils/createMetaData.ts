import { META_DATA } from '@/constraint/metaData';
import { Metadata } from 'next';

interface IProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export const createMetaData = (metaDataProps: IProps = {}) => {
  const { title, description, ogImage } = metaDataProps;

  const TITLE = title || META_DATA.title;
  const DESCRIPTION = description || META_DATA.description;
  const OG_IMAGE = ogImage || META_DATA.ogImage;

  const metaData: Metadata = {
    metadataBase: new URL(META_DATA.baseUrl),
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: OG_IMAGE,
      siteName: META_DATA.siteName,
      type: 'website',
      url: META_DATA.url,
    },
    twitter: {
      title: TITLE,
      description: DESCRIPTION,
      images: {
        url: OG_IMAGE,
      },
    },
  };

  return metaData;
};
