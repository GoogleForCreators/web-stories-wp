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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TranslateWithMarkup } from '@googleforcreators/i18n';
import {
  Link,
  themeHelpers,
  Text,
  THEME_CONSTANTS,
  VisuallyHidden,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { NAVIGATION_HEIGHT } from '../../secondaryPopup';
import { GUTTER_WIDTH } from '../constants';
import { useConfig } from '../../../app';
import { Transitioner } from './transitioner';
import DoneCheckmark from './icons/doneCheckmark.svg';

const Panel = styled.div`
  width: 100%;
  padding-bottom: ${NAVIGATION_HEIGHT}px;

  * {
    user-select: text;
  }
`;

const Overflow = styled.div`
  position: relative;
  width: 100%;
  max-height: 70vh;
  padding: ${GUTTER_WIDTH}px;

  strong {
    font-weight: 700;
  }
`;

const Video = styled.video`
  height: 180px;
  margin-bottom: ${GUTTER_WIDTH}px;
  max-width: 100%;
`;

const Title = styled.h1`
  ${themeHelpers.expandTextPreset(({ label }, { MEDIUM }) => label[MEDIUM])}
  color: ${({ theme }) => theme.colors.fg.primary};
  line-height: 32px;
  margin: 0 0 8px 0;
`;

const Paragraph = styled(Text)`
  & + & {
    margin-top: 8px;
  }
`;

const DoneContainer = styled.div`
  ${themeHelpers.centerContent}
  height: 180px;
  margin-bottom: ${GUTTER_WIDTH}px;
  color: #f4f2ef;

  svg {
    display: block;

    path {
      color: #4285f4;
    }
  }
`;

export function QuickTip({
  title,
  description,
  isLeftToRightTransition = true,
  figureSrc,
  figureSrcImg,
  figureAlt,
  href,
  isDone = false,
  ...transitionProps
}) {
  const { cdnURL } = useConfig();
  return (
    <Transitioner
      {...transitionProps}
      isLeftToRightTransition={isLeftToRightTransition}
    >
      <Panel>
        <Overflow>
          {Boolean(figureSrc) && (
            <Video
              controls={false}
              autoPlay
              loop
              muted
              noControls
              preload="true"
              crossOrigin="anonymous"
            >
              <source src={`${cdnURL}${figureSrc}.webm`} type="video/webm" />
              <source src={`${cdnURL}${figureSrc}.mp4`} type="video/mp4" />
            </Video>
          )}
          {/* `figureSrcImg` is temporary until we get an animation for the embed quick tip.
          Once we have the animation then the .png image won't be necessary */}
          {figureSrcImg && (
            //eslint-disable-next-line jsx-a11y/media-has-caption -- False positive because it's actually an image.
            <Video
              as="img"
              alt={figureAlt}
              src={`${cdnURL}${figureSrcImg}.png`}
              crossOrigin="anonymous"
            />
          )}
          {isDone && (
            <DoneContainer>
              <DoneCheckmark height={135} width={135} />
            </DoneContainer>
          )}
          <Title>{title}</Title>
          {description.map((paragraph, i) => (
            <Paragraph
              // eslint-disable-next-line react/no-array-index-key -- Should be OK due to also using the title.
              key={`${title}-${i}`}
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              <TranslateWithMarkup
                mapping={{
                  a: (
                    <Link
                      size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                      rel="noreferrer noopener"
                      target="_blank"
                      href={href}
                    />
                  ),
                  screenreader: <VisuallyHidden />,
                }}
              >
                {paragraph}
              </TranslateWithMarkup>
            </Paragraph>
          ))}
        </Overflow>
      </Panel>
    </Transitioner>
  );
}

QuickTip.propTypes = {
  /* Temporary props: `figureAlt`, `figureSrc`.
  See packages/story-editor/src/components/helpCenter/constants.js. */
  figureAlt: PropTypes.string,
  figureSrc: PropTypes.string,
  figureSrcImg: PropTypes.string,
  href: PropTypes.string,
  isDone: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLeftToRightTransition: PropTypes.bool,
};
