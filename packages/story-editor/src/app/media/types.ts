export type ContentType = 'image' | 'video' | 'git' | 'sticker';

export type Provider = {
  displayName: string;
  contentTypeFilter?: ContentType;
  supportsCategories: boolean;
  requiresAuthorAttribution: boolean;
  attributionComponent: () => React.Component;
  fetchMediaErrorMessage: string;
  fetchCategoriesErrorMessage?: string;
  defaultPreviewWidth?: number;
};

export type Providers = Record<string, Provider>;

export type Media3pMedia = {
  name: string;
  provider: string;
  type: 'IMAGE' | 'VIDEO';
  author: { displayName: string; url: string };
  description?: string;
  createTime: string;
  registerUsageUrl: string;
  imageUrls: Record<string, ImageUrl>[] | undefined;
  videoUrls: Record<string, VideoUrl>[] | undefined;
  updateTime?: string;
  blurHash?: string;
};

export type ImageUrl = {
  imageName?: string;
  url: string;
  sourceUrl: string;
  file: string;
  mimeType: string;
  width: number;
  height: number;
};

export type VideoUrl = {
  file: string;
  mimeType: string;
  width: number;
  height: number;
  duration: number;
};

export type ImageSize = {
  file: string;
  sourceUrl: string;
  mimeType: string;
  width: number;
  height: number;
};

export type MediaUrls = Media3pMedia['imageUrls'] | Media3pMedia['videoUrls'];

export type ImageSizes = Record<string, ImageSize>;
