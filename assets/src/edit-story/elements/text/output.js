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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { dataToEditorX, dataToEditorY } from '../../units';
import { draftMarkupToContent, generateParagraphTextStyle } from './util';

/**
 * Renders DOM for the text output based on the provided unit converters.
 */
export function TextOutputWithUnits({
  element: { bold, content, color, backgroundColor, padding, ...rest },
  dataToStyleX,
  dataToStyleY,
  paddingToStyle,
  className,
}) {
  const paddingStyles = paddingToStyle(padding);
  const style = {
    ...generateParagraphTextStyle(rest, dataToStyleX, dataToStyleY),
    ...generatePatternStyles(backgroundColor),
    ...generatePatternStyles(color, 'color'),
    padding: `${paddingStyles.vertical} ${paddingStyles.horizontal}`,
  };
  return (
    <p
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: draftMarkupToContent(content, bold) }}
    />
  );
}

TextOutputWithUnits.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  dataToStyleX: PropTypes.func.isRequired,
  dataToStyleY: PropTypes.func.isRequired,
  paddingToStyle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({ element, box: { width } }) {
  return (
    <TextOutputWithUnits
      element={element}
      className="fill"
      dataToStyleX={(x) => `${dataToEditorX(x, 100)}%`}
      dataToStyleY={(y) => `${dataToEditorY(y, 100)}%`}
      paddingToStyle={(padding) => ({
        // The padding % is calculated based on the element's width, not
        // the page's container.
        horizontal: `${dataToEditorX(padding?.horizontal || 0, width)}%`,
        // The padding % in CSS is calculated based on width, thus we have to
        // use the width for the vertical padding too.
        vertical: `${dataToEditorX(padding?.vertical || 0, width)}%`,
      })}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextOutput;
