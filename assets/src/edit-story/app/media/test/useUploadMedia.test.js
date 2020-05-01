/**
 * External dependencies
 */
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useUploadMedia from '../useUploadMedia';

jest.mock('../../uploader', () => ({
  useUploader: jest.fn(() => ({
    uploadFile: jest.fn(),
  })),
}));

jest.mock('../../snackbar', () => ({
  useSnackbar: jest.fn(() => ({
    showSnackBar: jest.fn(),
  })),
}));

jest.mock('../../config', () => ({
  useConfig: jest.fn(() => ({
    allowedMimeTypes: {
      image: [],
      video: [],
    },
  })),
}));

jest.mock('../../../app/media/utils');
import { getResourceFromLocalFile } from '../../../app/media/utils';

describe('useUploadMedia', () => {
  it('should only setMedia for files supported by getResourceFromLocalFile', async () => {
    const supportedLocalResource = ['image', 'video'];

    const media = [
      { type: 'image', src: 'image1.jpg' },
      { type: 'image', src: 'image2.jpg' },
      { type: 'image', src: 'image3.jpg' },
    ];
    const newFiles = [
      { type: 'video', src: 'video1.mp4' },
      { type: 'text', src: 'text.txt' }, // Unsupported File Format
      { type: 'image', src: 'image5.jpg' },
    ];

    const pagingNum = 1;
    const mediaType = undefined;
    const setMedia = jest.fn();
    const fetchMedia = jest.fn();

    // Used for sorted the media or newFiles for comparison in the end.
    const sortBySrc = (a, b) => a.src.localeCompare(b.src);

    const sortedExpectedSetMediaArgs = [
      ...media,
      ...newFiles.filter(({ type }) => supportedLocalResource.includes(type)),
    ].sort(sortBySrc);

    // Simple implementation of getResourceFromLocalFile that will return
    // null on unsupported resources.
    getResourceFromLocalFile.mockImplementation((e) => {
      if (supportedLocalResource.includes(e.type)) {
        return e;
      } else {
        return null;
      }
    });

    const { result } = renderHook(() =>
      useUploadMedia({
        media,
        pagingNum,
        mediaType,
        fetchMedia,
        setMedia,
      })
    );

    const { uploadMedia } = result.current;

    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(1);

    const sortedMediaArgs = setMedia.mock.calls[0][0].media.sort(sortBySrc);

    // Should have skipped every unsupported file.
    expect(sortedMediaArgs).toEqual(sortedExpectedSetMediaArgs);
  });
});
