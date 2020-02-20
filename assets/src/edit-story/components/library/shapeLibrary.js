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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useLibrary from './useLibrary';

function MediaLibrary() {
  const {
    actions: { insertElement },
  } = useLibrary();
  return (
    <>
      <button
        onClick={() =>
          insertElement('square', {
            backgroundColor: '#ff0000',
            width: 30,
            height: 15,
            x: 5,
            y: 5,
            rotationAngle: 0,
          })
        }
      >
        {__('Insert small red square', 'web-stories')}
      </button>
      <br />
      <button
        onClick={() =>
          insertElement('square', {
            backgroundColor: '#0000ff',
            width: 100,
            height: 80,
            x: 5,
            y: 35,
            rotationAngle: 0,
          })
        }
      >
        {__('Insert big blue square', 'web-stories')}
      </button>
    </>
  );
}

export default MediaLibrary;
