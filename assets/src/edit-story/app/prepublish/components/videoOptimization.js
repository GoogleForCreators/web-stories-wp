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
import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button, BUTTON_TYPES, BUTTON_SIZES } from '../../../../design-system';
import { useLocalMedia } from '../../media';

const Container = styled.div`
  margin-top: 10px;
  display: flex;
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
export function VideoOptimization({ element }) {
  const { resource = {} } = element;
  const { optimizeVideo } = useLocalMedia((state) => ({
    optimizeVideo: state.actions.optimizeVideo,
  }));

  const optimizingVideoRef = useRef();

  const handleUpdateVideo = useCallback(async () => {
    optimizingVideoRef.current = true;
    // If optimization fails we want to update the text
    // temporary solution until more robust error handling is ready

    await optimizeVideo({ resource }).finally(() => {
      // TODO add in an error state
      optimizingVideoRef.current = false;
    });
  }, [resource, optimizeVideo]);

  return (
    <Container>
      <Thumbnail
        src={resource?.poster}
        alt={resource?.alt || __('video thumbnail', 'web-stories')}
        crossOrigin="anonymous"
      />
      <OptimizeButton
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        onClick={handleUpdateVideo}
        disabled={optimizingVideoRef?.current}
      >
        {optimizingVideoRef?.current
          ? __('Optimizing video', 'web-stories')
          : __('Optimize video', 'web-stories')}
      </OptimizeButton>
    </Container>
  );
}

VideoOptimization.propTypes = {
  element: PropTypes.object,
};
