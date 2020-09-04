/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { fireEvent, screen } from '@testing-library/react';
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import ConfigContext from '../../../app/config/context';
import MediaContext from '../../../app/media/context';
import Buttons from '../buttons';
import { renderWithTheme } from '../../../testUtils';

function setupButtons({
  story: extraStoryProps,
  meta: extraMetaProps,
  media: extraMediaProps,
  config: extraConfigProps,
} = {}) {
  const saveStory = jest.fn();
  const autoSave = jest.fn();

  const modalWrapper = document.createElement('div');
  Modal.setAppElement(modalWrapper);

  const storyContextValue = {
    state: {
      meta: { isSaving: false, ...extraMetaProps },
      story: { status: 'draft', storyId: 123, date: null, ...extraStoryProps },
    },
    actions: { saveStory, autoSave },
  };
  const configValue = {
    previewLink:
      'https://example.com?preview_id=1679&preview_nonce=b5ea827939&preview=true',
    capabilities: {
      hasPublishAction: true,
    },
    ...extraConfigProps,
  };
  const mediaContextValue = {
    local: {
      state: { ...extraMediaProps },
    },
  };

  const { getByRole } = renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <StoryContext.Provider value={storyContextValue}>
        <MediaContext.Provider value={mediaContextValue}>
          <Buttons />
        </MediaContext.Provider>
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    getByRole,
    autoSave,
    saveStory,
  };
}

describe('buttons', () => {
  const FUTURE_DATE = '9999-01-01T20:20:20';
  const PREVIEW_POPUP = {
    document: {
      write: jest.fn(),
    },
    location: {
      href: 'about:blank',
      replace: jest.fn(),
    },
  };

  it('should display Publish button when in draft mode', () => {
    const { getByRole } = setupButtons();
    const publishButton = getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeDefined();
  });

  it('should update window location when publishing', () => {
    const { getByRole, saveStory } = setupButtons({
      story: { title: 'Some title' },
    });
    const publishButton = getByRole('button', { name: 'Publish' });

    fireEvent.click(publishButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
    expect(window.location.href).toContain('post=123&action=edit');
  });

  it('should display Switch to draft button when published', () => {
    const { getByRole, saveStory } = setupButtons({
      story: { status: 'publish' },
    });
    const draftButton = getByRole('button', { name: 'Switch to Draft' });

    expect(draftButton).toBeDefined();
    fireEvent.click(draftButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button when future date is set', () => {
    const { getByRole, saveStory } = setupButtons({
      story: {
        title: 'Some title',
        status: 'draft',
        date: FUTURE_DATE,
      },
    });
    const scheduleButton = getByRole('button', { name: 'Schedule' });

    expect(scheduleButton).toBeDefined();
    fireEvent.click(scheduleButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should only save a story without a title if confirmed', () => {
    const { getByRole, saveStory } = setupButtons({
      story: {
        title: '',
        status: 'draft',
      },
    });
    const publishButton = getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeDefined();
    fireEvent.click(publishButton);

    const publishAnywayButton = screen.getByRole('button', {
      name: 'Publish without title',
    });
    expect(publishAnywayButton).toBeDefined();
    fireEvent.click(publishAnywayButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should not save a story without a title if opting to add a title', () => {
    const { getByRole, saveStory } = setupButtons({
      story: {
        title: '',
        status: 'draft',
      },
    });
    const publishButton = getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeDefined();
    fireEvent.click(publishButton);

    const addTitleButton = screen.getByRole('button', {
      name: 'Add a title',
    });
    expect(addTitleButton).toBeDefined();
    fireEvent.click(addTitleButton);

    expect(saveStory).not.toHaveBeenCalled();
  });

  it('should display Schedule button with future status', () => {
    const { getByRole } = setupButtons({
      story: {
        status: 'future',
        date: FUTURE_DATE,
      },
    });
    const scheduleButton = getByRole('button', { name: 'Schedule' });

    expect(scheduleButton).toBeDefined();
  });

  it('should display loading indicator while the story is updating', () => {
    const { getByRole } = setupButtons({ meta: { isSaving: true } });
    expect(getByRole('progressbar')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(getByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should disable buttons while upload is in progress', () => {
    const { getByRole } = setupButtons({ media: { isUploading: true } });
    expect(getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(getByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should disable publish button when user lacks permission', () => {
    const { getByRole } = setupButtons({
      config: { capabilities: { hasPublishAction: false } },
    });
    expect(getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should open draft preview when clicking on Preview via about:blank', () => {
    const { getByRole, saveStory } = setupButtons({
      story: {
        link: 'https://example.com',
      },
    });
    const previewButton = getByRole('button', { name: 'Preview' });

    expect(previewButton).toBeDefined();

    saveStory.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn();
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      open: mockedOpen,
    }));

    const popup = PREVIEW_POPUP;
    mockedOpen.mockImplementation(() => popup);

    fireEvent.click(previewButton);

    expect(saveStory).toHaveBeenCalledWith();
    expect(mockedOpen).toHaveBeenCalledWith('about:blank', 'story-preview');
    expect(popup.location.replace).toHaveBeenCalledWith(
      'https://example.com/?preview=true'
    );

    windowSpy.mockRestore();
  });

  it('should open preview for a published story when clicking on Preview via about:blank', () => {
    const { getByRole, autoSave } = setupButtons({
      story: {
        link: 'https://example.com',
        status: 'publish',
      },
    });
    const previewButton = getByRole('button', { name: 'Preview' });
    autoSave.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn();
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      open: mockedOpen,
    }));

    const popup = PREVIEW_POPUP;
    mockedOpen.mockImplementation(() => popup);

    fireEvent.click(previewButton);

    expect(autoSave).toHaveBeenCalledWith();
    expect(popup.location.replace).toHaveBeenCalledWith(
      'https://example.com?preview_id=1679&preview_nonce=b5ea827939&preview=true'
    );

    windowSpy.mockRestore();
  });
});
