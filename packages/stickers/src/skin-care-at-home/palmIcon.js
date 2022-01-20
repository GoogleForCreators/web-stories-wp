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
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Palm Icon', 'sticker name', 'web-stories');

function PalmIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 25 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M6.64275 23.6505C6.84748 23.5796 7.04285 23.4685 7.22081 23.3293C7.40949 23.1822 7.59281 23.0283 7.7681 22.8664C7.97416 22.6777 8.1722 22.481 8.3689 22.283C9.09282 21.5537 9.9492 21.0345 10.9046 20.6679C11.8975 20.2865 12.9278 20.1032 13.9876 20.1393C15.8369 20.2022 17.5055 20.787 18.9399 21.9739C20.2312 23.0417 21.0648 24.4052 21.4783 26.0256C21.6362 26.6452 21.7218 27.2767 21.7405 27.9177C21.7673 28.8249 21.7017 29.7241 21.4863 30.6086C21.2093 31.7473 20.7316 32.7897 19.9903 33.705C19.5086 34.2991 18.9453 34.7996 18.3016 35.209C17.3944 35.7871 16.4029 36.1577 15.3525 36.3705C14.6058 36.5217 13.8471 36.5578 13.0924 36.4508C12.1544 36.3183 11.3007 35.965 10.5447 35.3897C9.90505 34.9039 9.35776 34.3272 8.90013 33.6662C8.12403 32.5448 7.61689 31.3125 7.39744 29.9663C7.20476 28.7821 7.25561 27.6086 7.61556 26.4565C8.00762 25.204 8.71146 24.1603 9.72841 23.3334C10.5299 22.683 11.4439 22.2763 12.4675 22.1304C13.2289 22.022 13.9769 22.0996 14.7142 22.3177C15.6241 22.5867 16.4136 23.0671 17.096 23.7174C18.0554 24.6313 18.6763 25.7433 18.968 27.0359C19.2396 28.2442 19.1995 29.4391 18.7633 30.6059C18.4261 31.5078 17.8962 32.2772 17.1442 32.8861C16.8324 33.139 16.4925 33.345 16.1245 33.5043C15.4635 33.7893 14.7771 33.887 14.0599 33.7893C13.1178 33.6608 12.315 33.2514 11.6258 32.6104C10.9595 31.9922 10.4844 31.2496 10.2208 30.3758C9.87026 29.2143 9.96392 28.0876 10.5179 27.0091C11.0424 25.9868 11.8841 25.3713 13.0054 25.1318C13.4269 25.0421 13.8484 25.0328 14.2713 25.1157C15.2494 25.3097 15.964 25.8543 16.3989 26.7509C16.6758 27.3222 16.8056 27.9297 16.7789 28.5667C16.7615 28.9828 16.6705 29.3816 16.4818 29.7562C16.1433 30.4333 15.5853 30.7879 14.8453 30.8682C14.4305 30.9124 14.0505 30.7933 13.7226 30.5431C13.1245 30.0841 12.8288 29.4645 12.8234 28.7152C12.8208 28.291 12.972 27.9097 13.2409 27.5778C13.3854 27.3985 13.6343 27.3932 13.7896 27.5832C13.918 27.7411 13.9501 27.9137 13.8685 28.1037C13.8217 28.2134 13.7762 28.3245 13.7347 28.4355C13.6678 28.6122 13.6531 28.7982 13.6571 28.9855C13.6638 29.304 13.811 29.5422 14.0759 29.7121C14.3168 29.866 14.5884 29.9369 14.8667 29.9583C14.9938 29.9677 15.1343 29.9369 15.2548 29.8887C15.7258 29.6974 15.9867 29.3361 16.0643 28.837C16.1045 27.9578 15.877 27.1737 15.216 26.5622C14.7115 26.0952 14.108 25.8985 13.4189 25.9815C12.592 26.0791 11.9376 26.4739 11.4572 27.1456C10.8511 27.994 10.6785 28.9373 10.9046 29.9503C11.0103 30.4213 11.191 30.8642 11.4626 31.2643C12.1531 32.2839 13.1205 32.8031 14.3489 32.8446C15.8489 32.8031 16.997 32.1581 17.761 30.8548C18.0474 30.3664 18.2106 29.8312 18.2789 29.2745C18.4408 27.9685 18.2173 26.7295 17.5536 25.5867C16.9207 24.4975 15.9961 23.7535 14.8092 23.336C14.1227 23.0938 13.4135 23.0082 12.6896 23.0791C11.7115 23.1741 10.8364 23.5274 10.0803 24.1616C9.20789 24.8949 8.64857 25.8276 8.3475 26.9195C8.15213 27.63 8.09459 28.3566 8.13741 29.0925C8.20432 30.2527 8.51877 31.3419 9.0607 32.3669C9.45544 33.1135 9.96125 33.7759 10.5955 34.3379C10.8752 34.5855 11.1803 34.7982 11.5014 34.9869C12.0955 35.3361 12.7432 35.5248 13.4243 35.593C14.6714 35.7188 15.8583 35.486 16.9943 34.9748C17.7022 34.6564 18.3485 34.2429 18.9158 33.709C19.4149 33.2407 19.8204 32.7027 20.1362 32.0952C20.7704 30.8762 21.0675 29.5783 20.9885 28.2094C20.8855 26.3896 20.266 24.7625 19.0697 23.3708C18.5171 22.7285 17.8574 22.2214 17.1228 21.8039C16.447 21.4185 15.7231 21.1603 14.9591 21.0225C14.302 20.9034 13.6397 20.882 12.9747 20.9663C11.7182 21.1228 10.5968 21.6085 9.58658 22.3592C9.39523 22.5011 9.22797 22.675 9.05535 22.8409C8.67132 23.2089 8.29397 23.5822 7.90994 23.9502C7.72795 24.1255 7.53527 24.2901 7.31582 24.4186C7.19004 24.4922 7.05757 24.5537 6.92509 24.6153C6.81403 24.6661 6.69494 24.6755 6.57451 24.6768C6.43669 24.6782 6.31358 24.6353 6.20118 24.5577C6.07941 24.4734 5.98173 24.365 5.90011 24.2433C5.78771 24.0773 5.69805 23.8994 5.6258 23.7134C5.54417 23.5033 5.47326 23.2879 5.39565 23.0764C5.29127 22.7901 5.18957 22.5011 5.07851 22.2174C4.78012 21.4493 4.48038 20.6826 4.17663 19.9159C3.93711 19.3097 3.67618 18.7129 3.3818 18.1322C3.24264 17.8592 3.09143 17.5942 2.91882 17.3413C2.76761 17.1219 2.60035 16.9158 2.40632 16.7325C2.28991 16.6214 2.15878 16.5318 2.0156 16.4595C1.73995 16.3204 1.47501 16.3404 1.23013 16.5291C1.01336 16.695 0.859481 16.9038 0.80328 17.1794C0.76849 17.3507 0.749756 17.5206 0.748418 17.6933C0.741727 18.3904 0.835392 19.0715 1.08963 19.7245C1.29704 20.2571 1.50712 20.7883 1.7172 21.3195C2.69402 23.791 3.66815 26.2638 4.65166 28.7313C5.07985 29.8044 5.52812 30.8709 5.97103 31.9387C6.32295 32.7897 6.76854 33.5886 7.33589 34.3178C8.12136 35.3268 9.06071 36.1604 10.1874 36.7692C11.1548 37.2924 12.1852 37.627 13.2811 37.7594C14.1334 37.8625 14.9778 37.8344 15.8195 37.6791C16.5822 37.5386 17.3101 37.2911 18.0006 36.9392C19.0791 36.3879 20.0077 35.6439 20.7838 34.7139C21.497 33.8602 22.043 32.9061 22.4283 31.8611C22.6826 31.1733 22.8659 30.4668 22.9917 29.7455C23.1362 28.9199 23.2165 28.0876 23.2553 27.25C23.2994 26.2665 23.2901 25.283 23.2687 24.2995C23.2432 23.1567 23.2232 22.014 23.2085 20.8699C23.2031 20.4845 23.2165 20.0992 23.2232 19.7138C23.2432 18.6099 23.2339 17.5073 23.183 16.4047C23.1563 15.8199 23.1402 15.2352 23.1241 14.6504C23.1175 14.4109 23.1295 14.1714 23.1308 13.9332C23.1349 13.5077 23.1442 13.0822 23.1375 12.658C23.1308 12.2592 23.092 11.8618 22.9957 11.4724C22.9676 11.356 22.9355 11.2409 22.8953 11.1285C22.7455 10.711 22.4725 10.3966 22.0925 10.1718C22.059 10.1517 22.0202 10.1383 21.9827 10.1236C21.8784 10.0821 21.7579 10.1223 21.7098 10.22C21.6817 10.2788 21.6536 10.3417 21.6402 10.4046C21.6041 10.5866 21.5773 10.7713 21.5425 10.9532C21.4328 11.5286 21.386 12.1134 21.3471 12.6955C21.2829 13.6509 21.2441 14.6063 21.2521 15.5643C21.2575 16.1772 21.3017 16.786 21.3645 17.3949C21.4047 17.7923 21.4181 18.191 21.4114 18.5898C21.4074 18.8026 21.3806 19.0126 21.3324 19.2214C21.2628 19.5144 21.1197 19.766 20.919 19.9841C20.7624 20.1527 20.5777 20.2745 20.3369 20.2985C20.096 20.3226 19.89 20.2544 19.712 20.0978C19.5809 19.9828 19.4792 19.8436 19.4056 19.6844C19.3333 19.5265 19.2798 19.3619 19.2584 19.1893C19.2209 18.8855 19.1767 18.5831 19.1821 18.2753C19.1901 17.8231 19.2022 17.3721 19.2142 16.9198C19.2263 16.4542 19.253 15.9899 19.253 15.5255C19.257 12.5349 19.2557 9.54422 19.257 6.55223C19.257 6.36623 19.2637 6.18024 19.2624 5.99424C19.2597 5.63697 19.1299 5.31984 18.9386 5.02546C18.7686 4.76319 18.4475 4.7003 18.2013 4.78192C17.7169 4.94249 17.373 5.24624 17.191 5.72662C17.1107 5.93804 17.0545 6.15749 17.0211 6.38095C16.9769 6.68336 16.9421 6.98711 16.9408 7.29354C16.9394 7.59863 16.9435 7.90505 16.9381 8.21014C16.9274 8.84841 16.918 9.48535 16.8993 10.1236C16.8699 11.1205 16.8297 12.1161 16.803 13.1129C16.7923 13.4983 16.8056 13.8837 16.8123 14.2691C16.8204 14.7213 16.8337 15.1723 16.8444 15.6246C16.8578 16.1705 16.8297 16.7138 16.7762 17.257C16.7481 17.5487 16.7013 17.8364 16.621 18.1188C16.5661 18.3128 16.4765 18.4894 16.344 18.6433C16.2289 18.7771 16.0911 18.8802 15.9171 18.9203C15.6187 18.9899 15.3645 18.9069 15.1611 18.6808C15.0072 18.5095 14.9122 18.3061 14.8533 18.084C14.769 17.7602 14.7276 17.431 14.7235 17.0978C14.7195 16.7258 14.7236 16.3525 14.7463 15.9818C14.7905 15.2646 14.8212 14.5487 14.8252 13.8302C14.8346 11.716 14.8574 9.6031 14.8614 7.4889C14.864 6.14678 14.8426 4.80333 14.8333 3.46122C14.8333 3.44783 14.8319 3.43445 14.8319 3.42107C14.8614 2.87379 14.7905 2.3332 14.7035 1.79394C14.6714 1.59858 14.6245 1.40322 14.567 1.2132C14.5335 1.1008 14.4747 0.992418 14.4104 0.893399C14.282 0.692683 14.0304 0.61775 13.8163 0.707402C13.6544 0.775646 13.5086 0.862622 13.3761 0.975023C13.1218 1.19046 12.8997 1.43801 12.6896 1.69492C12.6294 1.76852 12.5906 1.85282 12.5705 1.94515C12.4916 2.32249 12.4086 2.6985 12.3364 3.07718C12.3136 3.1936 12.3176 3.31536 12.3163 3.43445C12.2815 6.81048 12.2481 10.1865 12.2119 13.5625C12.2039 14.3333 12.1838 15.104 12.1771 15.8748C12.1745 16.1397 12.1919 16.406 12.1986 16.671C12.2079 17.0028 12.2186 17.3347 12.224 17.6678C12.228 17.9087 12.1919 18.1455 12.1424 18.3797C12.0848 18.6594 11.963 18.9096 11.7409 19.0969C11.6499 19.1732 11.5482 19.2414 11.4412 19.2896C11.2873 19.3579 11.1267 19.3472 10.9849 19.2481C10.91 19.196 10.8404 19.1317 10.7802 19.0621C10.641 18.8976 10.5514 18.7049 10.4804 18.5028C10.3439 18.1121 10.265 17.7093 10.2382 17.2958C10.1312 15.65 10.1098 14.0028 10.0897 12.3542C10.0844 11.8886 10.079 11.4243 10.079 10.9586C10.0763 9.97509 10.0308 8.99159 9.97998 8.00942C9.94251 7.30692 9.88631 6.60442 9.79131 5.90459C9.73377 5.48309 9.68158 5.06158 9.59996 4.6441C9.52636 4.26541 9.42868 3.89208 9.27748 3.53615C9.19318 3.33945 9.09148 3.15345 8.93091 3.00626C8.76766 2.85639 8.57899 2.83097 8.3756 2.90992C8.26186 2.95407 8.16551 3.02366 8.08121 3.11063C7.97952 3.21634 7.8912 3.3341 7.83634 3.47058C7.78148 3.60573 7.72662 3.74088 7.68112 3.88004C7.58076 4.18379 7.52189 4.49824 7.46702 4.81136C7.34793 5.50583 7.23018 6.20031 7.16997 6.90281C7.11243 7.57855 7.06425 8.25429 7.05623 8.93271C7.04017 10.2481 7.04686 11.5648 7.09236 12.8801C7.10574 13.2789 7.11109 13.6776 7.12982 14.0764C7.17131 14.9528 7.21814 15.8279 7.26631 16.7044C7.28772 17.1018 7.31582 17.5006 7.3466 17.898C7.40815 18.6928 7.47104 19.4877 7.53928 20.2825C7.5714 20.6531 7.61689 21.0225 7.65436 21.3931C7.66774 21.5256 7.6838 21.6581 7.68112 21.7905C7.67577 22.0234 7.46703 22.1719 7.23554 22.1157C7.0656 22.0742 6.95989 21.9618 6.90904 21.7986C6.88897 21.7357 6.88361 21.6688 6.87559 21.6019C6.83544 21.2325 6.79128 20.8619 6.75917 20.4912C6.69494 19.7499 6.63071 19.0086 6.57719 18.266C6.49824 17.1928 6.43 16.1183 6.3564 15.0438C6.35373 15.0037 6.34971 14.9649 6.34837 14.9247C6.29886 13.596 6.24534 12.2686 6.24935 10.9385C6.25337 9.7155 6.29886 8.49248 6.35105 7.27213C6.3845 6.47596 6.43936 5.67979 6.57183 4.89165C6.63874 4.49824 6.7217 4.10886 6.84347 3.72884C6.96122 3.36086 7.11377 3.0076 7.33723 2.68779C7.50717 2.4456 7.71457 2.24354 7.96078 2.07762C8.09459 1.98663 8.24045 1.92374 8.39433 1.88226C8.66998 1.80866 8.92154 1.8662 9.14367 2.04149C9.26945 2.14051 9.37382 2.26094 9.46347 2.39475C9.58792 2.58476 9.69095 2.78414 9.77659 2.99422C9.93716 3.38896 10.0522 3.79842 10.1459 4.21323C10.3051 4.92777 10.4095 5.65035 10.4898 6.37694C10.6905 8.18873 10.7641 10.0072 10.8056 11.8284C10.835 13.1437 10.8578 14.4591 10.8926 15.7758C10.9059 16.2936 10.9354 16.8115 10.9662 17.3293C10.9769 17.514 11.0143 17.6986 11.0464 17.8806C11.0612 17.9595 11.1026 18.0278 11.1655 18.0826C11.2017 18.1134 11.2886 18.1067 11.3034 18.0653C11.3221 18.0157 11.3462 17.9662 11.3515 17.9154C11.3649 17.7562 11.3783 17.5969 11.377 17.4377C11.3555 15.8828 11.3997 14.3279 11.4184 12.7717C11.4479 10.22 11.48 7.66821 11.5094 5.11511C11.5161 4.5705 11.5121 4.02456 11.5188 3.47995C11.5241 3.00091 11.5763 2.52588 11.6767 2.05487C11.7235 1.83275 11.7918 1.61865 11.8787 1.40857C12.1678 0.710079 12.6843 0.271181 13.4069 0.0624375C13.5755 0.0142659 13.7454 -0.00446755 13.918 0.000884858C14.2686 0.0102516 14.5616 0.144062 14.8025 0.396963C14.9684 0.572254 15.0915 0.776984 15.1946 0.995094C15.2909 1.19982 15.3618 1.41526 15.4167 1.63471C15.5104 2.00938 15.5706 2.3894 15.5973 2.77477C15.6401 3.37156 15.6509 3.96969 15.6495 4.56783C15.6482 5.95008 15.6415 7.33234 15.6388 8.7146C15.6348 10.43 15.6268 12.1442 15.6308 13.8596C15.6335 14.6451 15.6054 15.4279 15.5465 16.2106C15.5184 16.584 15.5251 16.9546 15.5826 17.3239C15.6067 17.4805 15.6321 17.6397 15.7204 17.7762C15.7325 17.795 15.7646 17.8003 15.7887 17.807C15.794 17.8083 15.8087 17.7923 15.8128 17.7816C15.8261 17.7454 15.8435 17.708 15.8489 17.6692C15.8636 17.5635 15.8757 17.4578 15.8837 17.352C15.8917 17.2463 15.8917 17.1393 15.8957 17.0336C15.9319 15.6647 15.9626 14.2958 16.0028 12.9269C16.0483 11.3855 16.1018 9.8453 16.1553 8.3038C16.1794 7.62673 16.2062 6.94831 16.241 6.27257C16.261 5.88853 16.2864 5.50316 16.3801 5.12581C16.4323 4.91841 16.4952 4.71769 16.5929 4.52634C16.7427 4.23598 16.9515 4.00047 17.2231 3.81983C17.7196 3.48932 18.2374 3.4572 18.7713 3.72616C19.1125 3.89744 19.3721 4.1597 19.5849 4.47282C19.8525 4.86488 20.0024 5.30111 20.0559 5.77078C20.1027 6.18024 20.1268 6.59104 20.1362 7.00451C20.1696 8.3212 20.1295 9.63655 20.0933 10.9519C20.076 11.6036 20.0612 12.2539 20.0572 12.9055C20.0519 14.1419 20.0532 15.3783 20.0559 16.6148C20.0572 17.0269 20.0371 17.4377 20.0037 17.8498C19.9823 18.1148 19.9783 18.381 19.9783 18.646C19.9783 18.7504 20.0037 18.8561 20.0291 18.9578C20.0492 19.0394 20.1121 19.0902 20.1884 19.125C20.2312 19.1451 20.3034 19.1264 20.3355 19.0929C20.3931 19.034 20.4252 18.9618 20.4413 18.8828C20.4854 18.6741 20.5135 18.4627 20.5122 18.2499C20.5108 17.9702 20.5095 17.6919 20.4988 17.4123C20.4426 16.0166 20.4305 14.6223 20.5028 13.2267C20.5322 12.6687 20.5456 12.1107 20.6018 11.5554C20.6487 11.0924 20.7156 10.6321 20.8373 10.1825C20.9042 9.93763 20.9926 9.70212 21.117 9.48133C21.1959 9.34083 21.2896 9.21238 21.4074 9.10399C21.6455 8.8832 21.9306 8.79355 22.2504 8.82299C22.6264 8.85644 22.9328 9.02772 23.1696 9.3221C23.2954 9.47866 23.3918 9.65261 23.4707 9.83593C23.65 10.2561 23.7357 10.6977 23.7945 11.1473C23.8601 11.6491 23.8748 12.1535 23.8842 12.6593C23.915 14.3212 23.9498 15.9818 23.9819 17.6424C24.0193 19.5291 24.0648 21.4172 24.0889 23.3039C24.105 24.5403 24.0956 25.7767 24.0889 27.0131C24.0862 27.4775 24.0675 27.9431 24.0394 28.4074C23.9698 29.5836 23.7142 30.721 23.3048 31.825C22.8753 32.9797 22.2798 34.0435 21.5077 35.0043C20.753 35.945 19.8779 36.7532 18.8489 37.3874C17.8199 38.0204 16.7146 38.4646 15.5197 38.6573C14.5429 38.8152 13.5648 38.8205 12.5866 38.6332C11.4238 38.4124 10.3426 37.9909 9.34706 37.3526C8.62582 36.8897 8.00093 36.317 7.42822 35.6827C6.74712 34.9294 6.18646 34.0917 5.69136 33.2085C5.09725 32.1528 4.59947 31.0515 4.16058 29.9235C3.73238 28.8209 3.32158 27.713 2.91213 26.6037C2.48795 25.4569 2.04102 24.3195 1.56198 23.1942C1.21274 22.3753 0.864833 21.5564 0.565098 20.7174C0.466079 20.4417 0.369735 20.1661 0.280082 19.8877C-0.0330336 18.9042 -0.0771925 17.906 0.115494 16.8944C0.162328 16.6455 0.243953 16.406 0.351001 16.1772C0.419244 16.0327 0.499528 15.8949 0.6039 15.7731C0.907649 15.4198 1.28901 15.286 1.74664 15.3837C2.17216 15.4734 2.54147 15.6808 2.87064 15.9577C3.1677 16.2066 3.41525 16.5024 3.6347 16.8208C3.91437 17.2263 4.14585 17.6611 4.3546 18.1067C4.68912 18.8173 4.95407 19.5546 5.22436 20.2905C5.41705 20.8137 5.61911 21.3342 5.81045 21.8588C5.90546 22.121 5.98441 22.3887 6.07406 22.6523C6.13427 22.8289 6.19583 23.0042 6.26541 23.1755C6.30555 23.2731 6.36042 23.3655 6.41528 23.4565C6.4688 23.5488 6.53571 23.6144 6.64275 23.6505Z"
        fill="#380E63"
      />
    </svg>
  );
}

PalmIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 25 / 39,
  svg: PalmIcon,
  title,
};
