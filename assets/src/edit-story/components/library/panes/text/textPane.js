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
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';

function TextPane(props) {
  const {
    actions: { insertElement },
  } = useLibrary();
  return (
    <Pane id={paneId} {...props}>
      <button
        onClick={() =>
          insertElement('text', {
            content: 'Hello',
            color: 'black',
            width: 50,
            height: 20,
            x: 5,
            y: 5,
            rotationAngle: 0,
          })
        }
      >
        {__('Insert default', 'web-stories')}
      </button>
      <br />
      <button
        onClick={() =>
          insertElement('text', {
            content: 'Hello <strong>World</strong>',
            color: 'purple',
            fontSize: 100,
            fontFamily: 'Ubuntu',
            fontWeight: 400,
            width: 50,
            height: 20,
            x: 5,
            y: 5,
            rotationAngle: 0,
          })
        }
      >
        {__('Insert big purple ubuntu', 'web-stories')}
      </button>
    </Pane>
  );
}

export default TextPane;
