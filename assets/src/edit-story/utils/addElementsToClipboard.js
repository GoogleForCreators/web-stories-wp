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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../elements';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

function addElementsToClipboard(elements, evt) {
  if (!elements.length || !evt) {
    return;
  }
  const { clipboardData } = evt;
  const payload = {
    sentinel: 'story-elements',
    // @todo: Ensure that there's no unserializable data here. The easiest
    // would be to keep all serializable data together and all non-serializable
    // in a separate property.
    items: elements.map((element) => ({
      ...element,
      basedOn: element.id,
      id: undefined,
    })),
  };
  const serializedPayload = JSON.stringify(payload).replace(
    /--/g,
    DOUBLE_DASH_ESCAPE
  );

  const textContent = elements
    .map(({ type, ...rest }) => {
      const { TextContent } = getDefinitionForType(type);
      if (TextContent) {
        return TextContent({ ...rest });
      }
      return type;
    })
    .join('\n');

  const htmlContent = elements
    .map(({ type, ...rest }) => {
      const { Output } = getDefinitionForType(type);
      return renderToStaticMarkup(
        <Output element={rest} box={{ width: 100, height: 100 }} />
      );
    })
    .join('\n');

  clipboardData.setData('text/plain', textContent);
  clipboardData.setData(
    'text/html',
    `<!-- ${serializedPayload} -->${htmlContent}`
  );
}

export default addElementsToClipboard;
