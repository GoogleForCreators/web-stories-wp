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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Dashed Trail', 'sticker name', 'web-stories');

const DashedTrail = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 155 164"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M63.26 163.704a.677.677 0 00.673-.591.681.681 0 00-.581-.768 7.12 7.12 0 01-3.11-1.228l-.69-.49a.68.68 0 00-.95.163.68.68 0 00.163.95l.691.491a8.445 8.445 0 003.71 1.464c.031.004.063.009.095.009zm2.71-.105c.04 0 .081-.004.122-.009l.328-.059c.204-.036.409-.082.609-.136a.68.68 0 10-.346-1.318c-.168.045-.34.081-.509.113l-.327.059a.69.69 0 00-.55.796.69.69 0 00.672.554zm3.35-1.332a.69.69 0 00.39-.122 8.273 8.273 0 002.986-3.859.68.68 0 00-1.272-.482 6.911 6.911 0 01-2.496 3.223.68.68 0 00-.163.95c.132.19.34.29.554.29zm-12.386-1.972a.678.678 0 00.395-1.236l-.74-.523a.68.68 0 00-.95.163.68.68 0 00.163.95l.74.523a.674.674 0 00.392.123zm-2.973-2.096a.68.68 0 00.395-1.236l-3.713-2.622a.678.678 0 00-.95.163.68.68 0 00.164.95l3.713 2.623a.683.683 0 00.391.122zm18.59-2.149a.67.67 0 00.682-.669v-.059c0-.286-.019-.609-.055-.927a.686.686 0 00-.754-.6.687.687 0 00-.6.755c.032.268.045.536.045.8 0 .377.305.7.682.7zM48.025 154a.68.68 0 00.395-1.237l-.74-.522a.68.68 0 00-.95.163.68.68 0 00.163.95l.741.523a.684.684 0 00.391.123zm23.69-1.441a.68.68 0 00.605-.991 8.309 8.309 0 00-2.078-2.6 7.092 7.092 0 01-.94-.95.684.684 0 00-.96-.1.684.684 0 00-.1.959 8.28 8.28 0 001.123 1.137 6.932 6.932 0 011.736 2.172.7.7 0 00.614.373zm-26.662-.659a.68.68 0 00.395-1.236l-3.713-2.623a.68.68 0 00-.95.164.68.68 0 00.163.95l3.714 2.622a.656.656 0 00.39.123zm-5.936-4.195a.68.68 0 00.395-1.237l-.74-.522a.68.68 0 00-.95.163.68.68 0 00.163.95l.74.523a.685.685 0 00.392.123zm28.348-.95a.725.725 0 00.218-.037.677.677 0 00.427-.863 8.017 8.017 0 01-.218-.8.683.683 0 00-1.336.282c.068.322.154.64.259.954.1.286.368.464.65.464zm-31.357-1.091a.68.68 0 00.322-1.282 10.033 10.033 0 00-4.481-1.182l-.187-.004a.672.672 0 00-.7.663c-.009.378.291.691.664.7l.187.005a8.666 8.666 0 013.872 1.023.694.694 0 00.323.077zm-6.954-1.782a.68.68 0 00.35-1.263 5.433 5.433 0 01-.664-.473.684.684 0 00-.959.1.684.684 0 00.1.959c.268.218.545.414.818.577.11.068.232.1.355.1zm37.997-.713a.68.68 0 00.673-.578c.027-.172.059-.341.095-.509a6.99 6.99 0 011.669-3.163.683.683 0 00-1-.927 8.325 8.325 0 00-2.118 4.395c-.055.373.2.718.572.777.041 0 .073.005.11.005zm-40.593-1.805a.677.677 0 00.545-1.086c-.781-1.059-1.517-2.341-2.176-3.818a.676.676 0 00-.9-.341c-.341.155-.496.559-.341.9.704 1.563 1.486 2.932 2.327 4.068a.67.67 0 00.545.277zm44.698-3.863a.654.654 0 00.304-.073c.245-.123.5-.232.76-.327a.681.681 0 10-.464-1.282 9.394 9.394 0 00-.91.391.68.68 0 00-.304.913.7.7 0 00.614.378zm3.468-1.059c.054 0 .109-.005.163-.018l.891-.223a5.019 5.019 0 003.209-2.518.689.689 0 00-.286-.923.689.689 0 00-.923.286 3.613 3.613 0 01-2.327 1.828l-.891.222a.682.682 0 00.163 1.346zm-51.416-1.559a.678.678 0 00.645-.9 45.366 45.366 0 01-.272-.846.683.683 0 00-1.304.396c.09.291.186.591.286.886.096.282.36.464.645.464zm55.52-3.482a.683.683 0 00.677-.786 4.924 4.924 0 00-.268-1.018.679.679 0 00-.877-.396.683.683 0 00-.396.877c.091.237.155.487.196.741a.671.671 0 00.668.582zm-56.451-.036c.04 0 .082-.005.118-.009a.678.678 0 00.55-.791c-.077-.437-.132-.85-.168-1.223-.096-1.1-.25-2.209-.464-3.291a.684.684 0 00-.8-.536.682.682 0 00-.536.8 29.1 29.1 0 01.445 3.145c.037.414.096.868.182 1.346a.69.69 0 00.673.559zm54.542-2.936c.209 0 .409-.096.545-.273a.679.679 0 00-.136-.955 3.593 3.593 0 01-1.44-2.836v-.054c0-.159.008-.319.03-.473a.68.68 0 10-1.349-.177c-.027.213-.04.436-.04.654v.082a4.938 4.938 0 001.985 3.9.696.696 0 00.405.132zm-55.82-4.214a.685.685 0 00.655-.872 22.18 22.18 0 00-.277-.887.68.68 0 10-1.295.423c.09.282.181.564.263.845.09.3.36.491.654.491zm55.306-2.204a.67.67 0 00.491-.209c.136-.141.287-.273.441-.391.06-.046.118-.087.173-.132a.685.685 0 00.118-.959.685.685 0 00-.96-.118l-.15.113a5.408 5.408 0 00-.613.541.686.686 0 00.018.964c.141.132.314.191.482.191zm-56.542-1.205a.68.68 0 00.627-.95 30.039 30.039 0 00-2.167-4.108.683.683 0 00-1.155.727 29.112 29.112 0 012.068 3.922.688.688 0 00.627.409zm59.165-1.3c.2 0 .4-.091.536-.259a11.749 11.749 0 002.14-4.281.683.683 0 10-1.318-.355 10.438 10.438 0 01-1.895 3.791.685.685 0 00.114.959.693.693 0 00.423.145zm-62.837-4.954a.68.68 0 00.54-1.095 21.526 21.526 0 00-.577-.727.683.683 0 00-.959-.1.684.684 0 00-.1.959c.187.231.373.463.55.695.141.177.341.268.546.268zm65.232-1.777c.373 0 .677-.3.682-.673v-.2c0-.254-.01-.509-.023-.763a.681.681 0 10-1.359.086c.014.223.023.45.023.673v.182a.68.68 0 00.673.69c-.005.005 0 .005.004.005zm-67.614-.968a.68.68 0 00.486-1.159 30.546 30.546 0 00-3.495-3.059.682.682 0 00-.818 1.091 29.15 29.15 0 013.336 2.922.69.69 0 00.491.205zm67.087-2.614a.676.676 0 00.65-.886 11.859 11.859 0 00-2.34-4.177.683.683 0 00-1.033.895 10.471 10.471 0 012.073 3.696.69.69 0 00.65.472zm-72.76-1.909a.682.682 0 00.36-1.263 20.041 20.041 0 00-.8-.473.683.683 0 00-.677 1.186c.259.146.513.3.763.455a.7.7 0 00.355.095zm-3.208-1.709a.69.69 0 00.623-.4.687.687 0 00-.337-.904 30.177 30.177 0 00-2.79-1.109L.9 102.639a.68.68 0 10-.44 1.287l1.522.522c.904.309 1.8.664 2.663 1.059a.62.62 0 00.282.068zm71.859-2.272a.683.683 0 00.504-1.141c-.2-.218-.39-.436-.577-.664a.68.68 0 00-.959-.086.68.68 0 00-.086.959c.2.241.404.477.618.709a.678.678 0 00.5.223zm-2.204-2.891a.679.679 0 00.573-1.045 20.454 20.454 0 01-1.946-3.936.679.679 0 00-.873-.405.679.679 0 00-.404.873 22.01 22.01 0 002.072 4.2.687.687 0 00.578.313zM71.8 93.735a.68.68 0 00.664-.832 26.127 26.127 0 01-.178-.863.684.684 0 00-.79-.55.683.683 0 00-.55.79c.054.31.118.614.186.919a.687.687 0 00.668.536zm-.5-3.6h.036a.682.682 0 00.646-.718 20.354 20.354 0 01.245-4.386.68.68 0 00-.563-.782.68.68 0 00-.782.564 22.014 22.014 0 00-.26 4.672.68.68 0 00.678.65zm.75-7.208a.677.677 0 00.668-.555l.168-.895a.681.681 0 10-1.34-.25l-.169.895a.681.681 0 00.546.796c.045.004.086.009.127.009zm.673-3.573c.322 0 .609-.227.668-.554l.49-2.618c.11-.582.264-1.16.46-1.714a.683.683 0 00-.418-.868.683.683 0 00-.869.418c-.218.623-.39 1.268-.513 1.914l-.491 2.618a.681.681 0 00.673.804zm2.154-6.89a.68.68 0 00.577-.318c.15-.241.314-.482.482-.714a.683.683 0 00-1.104-.804c-.187.259-.368.527-.537.79a.68.68 0 00.218.941.662.662 0 00.364.105zm2.345-2.754c.16 0 .319-.055.45-.169a11.524 11.524 0 011.91-1.354 11.536 11.536 0 011.767-.818.677.677 0 00.405-.873.679.679 0 00-.873-.404c-.677.25-1.34.554-1.972.913-.76.432-1.473.94-2.132 1.514a.683.683 0 00-.064.963.697.697 0 00.51.228zm17.263-1.573h.036c.319-.018.641-.046.955-.087a.682.682 0 10-.173-1.354c-.282.036-.573.06-.854.077a.682.682 0 00.036 1.364zm-2.718-.155a.686.686 0 00.673-.568.68.68 0 00-.56-.786c-.695-.118-1.386-.3-2.05-.546a13.067 13.067 0 00-2.34-.618.687.687 0 00-.786.56.684.684 0 00.559.786c.713.118 1.418.304 2.095.55.74.272 1.509.477 2.286.609a.64.64 0 00.123.013zm6.295-.45a.825.825 0 00.145-.013l4.446-.95a.677.677 0 00.522-.81.683.683 0 00-.809-.522l-4.445.95a.68.68 0 00.14 1.345zm-14.308-.772c.027 0 .059 0 .09-.005.282-.036.569-.063.855-.082a.678.678 0 00.641-.718.678.678 0 00-.718-.64c-.318.017-.64.05-.955.09a.68.68 0 00.087 1.355zm21.421-.75a.835.835 0 00.146-.014l.89-.19a.681.681 0 10-.286-1.332l-.891.19a.677.677 0 00-.522.81c.063.317.35.536.663.536zm3.555-.764a.824.824 0 00.145-.013l3.391-.728a6.67 6.67 0 001.145-.354.678.678 0 00.368-.891.684.684 0 00-.891-.368c-.295.122-.6.218-.909.281l-3.39.728a.68.68 0 00.141 1.345zm6.617-2.618a.679.679 0 00.514-.232 6.97 6.97 0 00.609-.809.679.679 0 00-.209-.94.684.684 0 00-.941.209c-.145.227-.304.44-.482.64a.68.68 0 00.064.964.656.656 0 00.445.168zm1.441-3.272c.341 0 .641-.26.677-.61.028-.236.041-.477.041-.718 0-1.454-.486-2.89-1.372-4.04a.682.682 0 00-1.082.827 5.286 5.286 0 011.059 3.782.68.68 0 00.604.75c.028.004.05.009.073.009zm-2.604-6.582a.68.68 0 00.645-.9 5.243 5.243 0 01-.2-.777.68.68 0 00-.791-.55.678.678 0 00-.55.79c.059.333.146.664.255.983a.67.67 0 00.641.454zm-.087-3.581a.684.684 0 00.655-.491 5.25 5.25 0 012.422-3.091.682.682 0 00-.681-1.182 6.61 6.61 0 00-3.05 3.89.682.682 0 00.654.873zm5.232-4.582a.676.676 0 00.277-.06c.282-.126.564-.254.841-.39a.684.684 0 00.323-.909.684.684 0 00-.909-.323c-.269.128-.537.255-.809.373-.346.154-.496.56-.346.9.114.255.364.409.623.409zm3.241-1.654a.672.672 0 00.34-.091 37.502 37.502 0 003.859-2.555.682.682 0 00-.822-1.086 35.238 35.238 0 01-3.714 2.459.683.683 0 00-.25.932c.118.218.35.34.587.34zm5.895-4.232a.66.66 0 00.45-.173c.231-.204.459-.413.686-.622a.682.682 0 00-.927-1c-.218.204-.437.404-.659.6a.683.683 0 00.45 1.195zm2.599-2.54a.674.674 0 00.5-.219 35.996 35.996 0 002.918-3.59.678.678 0 00-.159-.95.683.683 0 00-.95.159 34.68 34.68 0 01-2.813 3.454.682.682 0 00.504 1.145zm4.377-5.796c.223 0 .446-.109.573-.313l.491-.764a.678.678 0 00-.204-.94.678.678 0 00-.941.204l-.491.763a.683.683 0 00.572 1.05zm1.969-3.054c.222 0 .445-.11.572-.314l2.459-3.822a.678.678 0 00-.204-.941.678.678 0 00-.941.204l-2.459 3.823a.683.683 0 00.573 1.05zm3.936-6.118c.222 0 .445-.11.572-.314l.491-.763a.678.678 0 00-.204-.941.678.678 0 00-.941.204l-.491.764a.677.677 0 00.205.94c.113.078.24.11.368.11zM143.892 17.476a.673.673 0 01-.573.314.683.683 0 01-.572-1.05l2.459-3.822a.677.677 0 01.94-.205.678.678 0 01.205.94l-2.459 3.823zM147.828 11.358a.673.673 0 01-.573.314.646.646 0 01-.368-.109.678.678 0 01-.204-.94l.491-.764a.677.677 0 01.94-.205c.319.205.41.623.205.94l-.491.764zM149.801 7.931a.674.674 0 01-.941.205.679.679 0 01-.205-.94l2.459-3.823a.678.678 0 01.941-.205.679.679 0 01.205.941l-2.459 3.822zM153.737 1.814a.673.673 0 01-.573.313.646.646 0 01-.368-.109.679.679 0 01-.205-.94l.491-.764a.678.678 0 01.941-.205.679.679 0 01.205.941l-.491.764z"
      fill="#fff"
    />
  </svg>
);

DashedTrail.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 155 / 164,
  svg: DashedTrail,
  title,
};
