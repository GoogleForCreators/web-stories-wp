/*
 * Copyright 2022 Google LLC
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
import { useEffect, memo } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import objectWithout from '../../utils/objectWithout';
import { useStory } from '../story';

function PageCanvasCacheValidator({ pageId, clearPageCanvasCache }) {
  const page = useStory(({ state }) =>
    objectWithout(
      state.pages.find(({ id }) => id === pageId),
      ['animations']
    )
  );

  // clear pageCanvas whenever a page is updated.
  useEffect(() => {
    clearPageCanvasCache({ pageId: page.id });
  }, [page, clearPageCanvasCache]);

  // clear pageCanvas if the page gets deleted
  useEffect(() => {
    return () => clearPageCanvasCache({ pageId });
  }, [clearPageCanvasCache, pageId]);

  return null;
}

PageCanvasCacheValidator.propTypes = {
  pageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  clearPageCanvasCache: PropTypes.func,
};

export default memo(PageCanvasCacheValidator);
