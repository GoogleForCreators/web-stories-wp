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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { dark, light } from '../theme/colors';

export default {
  title: 'DesignSystem/Colors',
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ColorBlock = styled.span`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 1px solid gray;
  background-color: ${({ color }) => color};
`;

export const _default = () => {
  const { brandColors, standard, accent, status } = dark;
  const getColorSet = (color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <p>{color}</p>
    </Container>
  );

  const StandardColors = Object.values(standard).map(getColorSet);

  const AccentColors = Object.values(accent).map(getColorSet);

  const StatusColors = Object.values(status).map(getColorSet);

  const fgLightColors = Object.values(light.fg).map(getColorSet);

  const bgLightColors = Object.values(light.bg).map(getColorSet);

  const fgDarkColors = Object.values(dark.fg).map(getColorSet);

  const bgDarkColors = Object.values(dark.bg).map(getColorSet);

  const brandColorsGray = Object.values(brandColors.gray).map(getColorSet);

  const brandColorsViolet = Object.values(brandColors.violet).map(getColorSet);

  const brandColorsBlue = Object.values(brandColors.blue).map(getColorSet);

  const brandColorsRed = Object.values(brandColors.red).map(getColorSet);

  const brandColorsGreen = Object.values(brandColors.green).map(getColorSet);

  return (
    <>
      <h2>{'Standard Colors'}</h2>
      <Row>{StandardColors}</Row>
      <h2>{'Accent Colors'}</h2>
      <Row>{AccentColors}</Row>
      <h2>{'Status Colors'}</h2>
      <Row>{StatusColors}</Row>
      <h2>{'Dark Mode (default) - Foreground'}</h2>
      <Row>{fgDarkColors}</Row>
      <h2>{'Dark Mode (default) - Background'}</h2>
      <Row>{bgDarkColors}</Row>
      <h2>{'Light Mode (dashboard) - Foreground'}</h2>
      <Row>{fgLightColors}</Row>
      <h2>{'Light Mode (dashboard) - Background'}</h2>
      <Row>{bgLightColors}</Row>
      <h2>{'Brand Colors - Gray'}</h2>
      <Row>{brandColorsGray}</Row>
      <h2>{'Brand Colors - Violet'}</h2>
      <Row>{brandColorsViolet}</Row>
      <h2>{'Brand Colors - Blue'}</h2>
      <Row>{brandColorsBlue}</Row>
      <h2>{'Brand Colors - Red'}</h2>
      <Row>{brandColorsRed}</Row>
      <h2>{'Brand Colors - Green'}</h2>
      <Row>{brandColorsGreen}</Row>
    </>
  );
};
