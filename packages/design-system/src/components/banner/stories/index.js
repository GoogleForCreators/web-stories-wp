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
 * Internal dependencies
 */
import { TextSize } from '../../../theme';
import { Text, Link } from '../../typography';
import { Banner } from '..';

export default {
  title: 'DesignSystem/Components/Banner',
  component: Banner,
  args: {
    title: 'my banner',
    isDashboard: false,
    message: 'I am a banner child',
  },
  argTypes: {
    onClose: { action: 'close banner clicked' },
  },
};

// eslint-disable-next-line react/prop-types
export const _default = ({ message, ...args }) => {
  return (
    <Banner closeButtonLabel={'Dismiss storybook banner'} {...args}>
      <Text.Paragraph size={TextSize.XSmall}>{message}</Text.Paragraph>
    </Banner>
  );
};
// eslint-disable-next-line react/prop-types
export const EditorBanner = ({ message, ...args }) => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      onClose={(e) => args.onClose(e)}
      {...args}
    >
      <Text.Paragraph size={TextSize.XSmall}>{message}</Text.Paragraph>
    </Banner>
  );
};
EditorBanner.args = {
  title: 'Animations are here!',
  isDashboard: false,
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};
// eslint-disable-next-line react/prop-types
export const DashboardBanner = ({ message, ...args }) => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      onClose={(e) => args.onClose(e)}
      {...args}
    >
      <Text.Paragraph size={TextSize.XSmall}>
        {message}
        <Link size={TextSize.XSmall} href="https://policies.google.com/privacy">
          {'Google Privacy Policy'}
        </Link>
      </Text.Paragraph>
    </Banner>
  );
};
DashboardBanner.args = {
  title: 'Help improve the editor!',
  isDashboard: true,
  message:
    'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with ',
};
// eslint-disable-next-line react/prop-types
export const BannerNoBackgroundImage = ({ message, ...args }) => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      onClose={(e) => args.onClose(e)}
      {...args}
    >
      <Text.Paragraph size={TextSize.XSmall}>{message}</Text.Paragraph>
    </Banner>
  );
};
BannerNoBackgroundImage.args = {
  title: 'New Feature!',
  isDashboard: true,
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};
