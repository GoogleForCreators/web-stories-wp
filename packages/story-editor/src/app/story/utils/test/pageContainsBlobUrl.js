import pageContainsBlobUrl from '../pageContainsBlobUrl';

describe('pageContainsBlobUrl', () => {
  it('should find resource entry with blob url', () => {
    const pages = [
      {
        elements: [
          {
            resource: {
              src: 'https://example.com/bcee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              src: 'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ]
      },
    ];
    expect(pageContainsBlobUrl(pages)).toStrictEqual(true);
  });

  it('should find resource poster entry with blob url', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Arial',
              service: 'system',
            }
          },
        ]
      },
      {
        elements: [
          {
            resource: {
              poster: 'https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              poster:
                'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ]
      },
    ];
    expect(pageContainsBlobUrl(pages)).toStrictEqual(true);
  });

  it('should allow page entries without blob urls', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Arial',
              service: 'system',
            },
          },
          {
            resource: {
              src: 'https://example.com/bcee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              src: 'https://example.com/ccee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ]
      },
    ];

    expect(pageContainsBlobUrl(pages)).toStrictEqual(false);
  });
});
