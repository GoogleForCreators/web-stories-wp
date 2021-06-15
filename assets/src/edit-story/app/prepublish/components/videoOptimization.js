/*
 * Copyright 2021 Google LLC
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
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button, BUTTON_TYPES, BUTTON_SIZES } from '../../../../design-system';
import { useLocalMedia } from '../../media';

const Container = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
`;

const Caption = styled.div`
  margin-bottom: 12px;
`;

const Thumbnail = styled.img`
  height: 66px;
  width: 44px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  object-fit: cover;
  object-position: 50% 50%;
`;

const OptimizeButton = styled(Button)`
  margin: auto 16px;
  border: ${({ theme }) => `1px solid ${theme.colors.border.defaultNormal}`};
`;
export function VideoOptimization({ element, caption }) {
  const { resource = {} } = element;
  const { optimizeVideo } = useLocalMedia((state) => ({
    optimizeVideo: state.actions.optimizeVideo,
  }));

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleUpdateVideo = useCallback(async () => {
    setIsOptimizing(true);
    await optimizeVideo({ resource }).finally(() => {
      // TODO add in an error state #7315
      setIsOptimizing(false);
    });
  }, [resource, optimizeVideo]);

  return (
    <Container>
      <Caption>{caption}</Caption>
      {resource?.poster && (
        <Thumbnail
          src={resource.poster}
          alt={resource?.alt || __('Video thumbnail', 'web-stories')}
          crossOrigin="anonymous"
        />
      )}
      <OptimizeButton
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        onClick={handleUpdateVideo}
        disabled={isOptimizing}
      >
        {isOptimizing
          ? __('Optimizing video', 'web-stories')
          : __('Optimize video', 'web-stories')}
      </OptimizeButton>
    </Container>
  );
}

VideoOptimization.propTypes = {
  element: PropTypes.object,
  caption: PropTypes.node,
};

const BulkOptimizeButton = styled(OptimizeButton)`
  margin: 0;
  margin-bottom: 8px;
`;

export function BulkVideoOptimization({ elements }) {
  const { optimizeVideo } = useLocalMedia((state) => ({
    optimizeVideo: state.actions.optimizeVideo,
  }));
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleUpdateVideos = useCallback(async () => {
    setIsOptimizing(true);
    const promises = elements.map(({ resource }) => {
      return optimizeVideo({ resource });
      // todo show snackbar with correct video details when one fails
      //.catch(() => showSnackbar({ ... }));
    });
    await Promise.all(promises).finally(() => setIsOptimizing(false));
  }, [elements, optimizeVideo]);

  return (
    <BulkOptimizeButton
      type={BUTTON_TYPES.TERTIARY}
      size={BUTTON_SIZES.SMALL}
      onClick={handleUpdateVideos}
      disabled={isOptimizing}
    >
      {__('Optimize all videos', 'web-stories')}
    </BulkOptimizeButton>
  );
}

BulkVideoOptimization.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object),
};
