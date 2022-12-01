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
