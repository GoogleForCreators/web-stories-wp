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

/**
 * Internal dependencies
 */
import type { StickerProps, Sticker } from '../types';

const title = _x('Sleep Mask', 'sticker name', 'web-stories');

function SleepMask({ style }: StickerProps) {
  return (
    <svg
      style={style}
      viewBox="0 0 55 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M26.5937 1.30043C24.1407 1.28867 21.6895 1.2769 19.2365 1.26514C18.1528 1.2601 17.0675 1.26346 15.9838 1.31891C14.6986 1.38611 13.4267 1.5558 12.1868 1.91198C11.4476 2.12535 10.7386 2.41433 10.0649 2.79068C8.63845 3.58872 7.57663 4.73623 6.83738 6.18615C6.30143 7.23789 5.96373 8.3518 5.84445 9.52619C5.73524 10.5981 5.82092 11.6599 6.09142 12.7033C6.68449 14.9882 7.91937 16.8363 9.84308 18.2106C11.0343 19.0624 12.3683 19.5496 13.8216 19.7277C15.0816 19.8806 16.2779 19.6538 17.4422 19.1868C18.3444 18.8239 19.1727 18.3265 19.9724 17.7771C20.7436 17.2479 21.471 16.6632 22.1952 16.0718C22.7126 15.6501 23.2284 15.2268 23.7459 14.8051C24.1609 14.4674 24.5927 14.1549 25.0715 13.9129C25.5218 13.6861 25.9905 13.5181 26.4861 13.4307C27.2405 13.298 27.9797 13.3686 28.7106 13.592C29.3053 13.7752 29.8598 14.0423 30.3873 14.3665C30.7855 14.6102 31.1786 14.8639 31.555 15.1394C32.0674 15.5124 32.563 15.9072 33.062 16.3003C33.8483 16.9203 34.6346 17.5403 35.4663 18.0981C35.9384 18.4156 36.4306 18.6945 36.9464 18.9331C38.025 19.4304 39.1591 19.6572 40.3436 19.6505C41.4776 19.6437 42.563 19.4001 43.5912 18.928C46.1315 17.7637 47.8267 15.8383 48.6449 13.1703C49.5438 10.2436 48.8617 7.23454 47.0371 4.95968C45.9265 3.57528 44.5354 2.5689 42.8839 1.92374C42.2303 1.66837 41.5583 1.47348 40.8627 1.36427C40.7317 1.34411 40.599 1.32395 40.4696 1.29371C40.2478 1.24162 40.1 1.04841 40.0949 0.819919C40.0848 0.418375 40.4326 0.057156 40.8224 0.102519C41.1198 0.137801 41.4172 0.183161 41.7112 0.247005C42.3967 0.396533 43.0637 0.604869 43.7105 0.880405C44.5925 1.25507 45.3973 1.75573 46.1382 2.35721C46.8808 2.96036 47.5277 3.65425 48.0771 4.43885C48.8029 5.47379 49.3304 6.60114 49.6496 7.82425C49.6832 7.95362 49.7202 8.0813 49.7589 8.20899C49.7807 8.28124 49.8412 8.30812 49.9101 8.31651C49.9437 8.31988 49.9773 8.32492 50.0092 8.32492C50.9097 8.32492 51.8102 8.3266 52.7108 8.3266C52.862 8.3266 53.0082 8.30643 53.1459 8.23251C53.2988 8.14851 53.4063 8.02922 53.4601 7.86121C53.5525 7.57055 53.576 7.2715 53.5727 6.97076C53.5693 6.65322 53.5576 6.33736 53.5458 6.01982C53.5424 5.9207 53.529 5.81989 53.5088 5.72244C53.4349 5.34946 53.1879 5.14449 52.8116 5.12433C52.6453 5.11425 52.4772 5.11593 52.3109 5.11593C51.4272 5.11761 50.5435 5.12097 49.658 5.12265C49.5253 5.12265 49.3909 5.12601 49.2582 5.11761C48.9608 5.09913 48.7138 4.8236 48.7054 4.50942C48.6987 4.22044 48.9171 3.94322 49.196 3.89954C49.3103 3.88274 49.4279 3.87938 49.5455 3.8777C50.2461 3.8693 50.9467 3.85586 51.6473 3.85754C52.0975 3.85922 52.5478 3.87938 52.9964 3.90122C53.1291 3.90794 53.2619 3.93146 53.3895 3.96674C53.9238 4.11123 54.2934 4.44893 54.5219 4.94792C54.6412 5.20834 54.7135 5.48219 54.7454 5.76613C54.821 6.41633 54.8126 7.06652 54.7403 7.71504C54.7084 7.9973 54.6395 8.27283 54.527 8.53661C54.2918 9.08264 53.8751 9.41026 53.2988 9.53963C52.9712 9.61355 52.6369 9.62195 52.3025 9.62195C51.7346 9.62364 51.1685 9.61523 50.6006 9.61355C50.4511 9.61355 50.2998 9.61355 50.1503 9.61859C50.0646 9.62027 50.0041 9.6942 50.0075 9.7866C50.0092 9.8202 50.0075 9.85381 50.0125 9.88741C50.0596 10.336 50.0613 10.7879 50.0478 11.2382C50.0041 12.8125 49.648 14.3128 48.9222 15.714C47.946 17.5974 46.4961 19.0036 44.5875 19.9327C43.6534 20.388 42.6789 20.7257 41.6507 20.8971C41.271 20.9593 40.8913 20.9979 40.5065 21.0013C39.5472 21.008 38.6114 20.8584 37.6974 20.5795C37.0573 20.3847 36.4491 20.1108 35.856 19.805C34.9505 19.3363 34.0987 18.7802 33.2754 18.1804C32.4253 17.5621 31.597 16.9153 30.7973 16.2315C30.4041 15.8954 30.0043 15.5678 29.5758 15.2755C29.2566 15.0588 28.9206 14.8739 28.5627 14.7328C27.642 14.3665 26.7331 14.4354 25.846 14.8504C25.4075 15.0554 24.9959 15.3124 24.6162 15.6149C24.3558 15.8232 24.0987 16.0366 23.8467 16.2533C23.556 16.5036 23.2687 16.7573 22.9814 17.0127C22.0171 17.8696 20.962 18.5987 19.8598 19.2624C19.087 19.7277 18.2772 20.1226 17.4287 20.4317C15.9721 20.9609 14.4785 21.1172 12.9479 20.8484C12.1717 20.7123 11.4274 20.467 10.7134 20.136C9.83132 19.7277 9.01143 19.217 8.27219 18.5836C7.33973 17.7839 6.55681 16.8565 5.94189 15.793C5.27321 14.6387 4.84983 13.3971 4.64318 12.0816C4.53901 11.4213 4.49197 10.756 4.52389 10.0857C4.54741 9.61187 4.54909 9.60683 4.07866 9.61187C3.47887 9.61691 2.87739 9.61187 2.2776 9.61187C2.00878 9.61187 1.74501 9.58499 1.48291 9.52283C0.908317 9.38842 0.496693 9.05072 0.258119 8.51141C0.10019 8.15691 0.0161853 7.78225 0.00778479 7.39414C-0.0022958 6.96068 -0.0022958 6.52553 0.00610469 6.09207C0.0128251 5.74093 0.0749887 5.39483 0.189235 5.06049C0.429489 4.35317 0.933519 3.96674 1.66604 3.89618C2.61362 3.80545 3.56455 3.80377 4.51549 3.86426C4.59949 3.8693 4.68182 3.87938 4.76414 3.88778C5.00944 3.90962 5.25641 4.13139 5.29841 4.40861C5.33706 4.65559 5.21609 4.9076 4.98592 5.04201C4.93047 5.07561 4.86495 5.10081 4.8011 5.10921C4.70198 5.12265 4.60117 5.12097 4.50205 5.12097C4.06858 5.11929 3.63512 5.11425 3.20165 5.11425C2.85219 5.11425 2.50105 5.11761 2.15159 5.12601C2.03566 5.12937 1.91806 5.14113 1.80549 5.16801C1.49803 5.24026 1.31154 5.43179 1.27122 5.75269C1.2561 5.86862 1.24098 5.98454 1.24098 6.10215C1.24434 6.58602 1.25442 7.06989 1.26282 7.55375C1.2645 7.61928 1.27794 7.68648 1.2897 7.75201C1.35018 8.08298 1.55516 8.27788 1.89621 8.31988C2.02894 8.33668 2.16167 8.34508 2.29608 8.34508C3.03028 8.34004 3.76448 8.33164 4.49701 8.32324C4.54741 8.32324 4.59613 8.31652 4.64654 8.3098C4.71878 8.29804 4.76582 8.25435 4.78766 8.18715C4.81791 8.09138 4.84479 7.99562 4.86999 7.89817C5.09344 7.03796 5.4261 6.22144 5.86461 5.44691C6.92811 3.5652 8.42172 2.12872 10.3471 1.1425C11.3064 0.651911 12.3179 0.334371 13.3864 0.184842C14.2298 0.067235 15.0766 -0.00165006 15.9284 3.00383e-05C16.8961 0.00171014 17.8639 0.0134716 18.8316 0.0218721C19.1979 0.0252323 19.5658 0.0269122 19.9321 0.0269122C25.6545 0.0269122 31.3752 0.0269122 37.0976 0.0269122C37.2808 0.0269122 37.4656 0.0235516 37.647 0.0369924C37.8167 0.0487531 37.9713 0.109237 38.0939 0.236924C38.2771 0.426776 38.3056 0.651908 38.225 0.887122C38.1494 1.10889 37.978 1.23658 37.7461 1.27859C37.6806 1.29035 37.6134 1.28867 37.5462 1.29035C37.3967 1.29203 37.2455 1.29203 37.0959 1.29203C33.5929 1.29203 30.0899 1.29203 26.5869 1.29203C26.5937 1.29371 26.5937 1.29707 26.5937 1.30043Z"
        fill="#380E63"
      />
      <path
        d="M15.3572 12.0379C15.2748 12.1858 15.2093 12.3017 15.1455 12.4176C14.8615 12.9351 14.4986 13.3853 14.0484 13.7667C13.9845 13.8205 13.9207 13.8743 13.8484 13.9163C13.5796 14.0759 13.2385 14.007 13.0437 13.755C12.879 13.5416 12.874 13.214 13.0437 13.0124C13.1176 12.9233 13.21 12.8494 13.294 12.7687C13.4973 12.5705 13.6871 12.3622 13.8333 12.1169C13.8652 12.0631 13.8249 11.969 13.7611 11.9589C13.2671 11.8783 12.7849 11.7489 12.3078 11.6028C12.2204 11.5759 12.1431 11.6095 12.0877 11.68C12.0154 11.7708 11.9466 11.8649 11.8743 11.9573C11.54 12.3773 11.1468 12.7351 10.6966 13.0292C10.5974 13.093 10.4916 13.1384 10.374 13.1535C10.1068 13.1871 9.85987 13.0628 9.74899 12.836C9.62298 12.5789 9.66666 12.2882 9.86995 12.1017C9.9674 12.0127 10.0783 11.9371 10.1841 11.8565C10.4378 11.6649 10.6714 11.4532 10.8696 11.2029C10.9939 11.0467 10.9889 10.9862 10.836 10.882C10.7402 10.8165 10.6411 10.7543 10.5454 10.6871C10.4513 10.6199 10.3538 10.5527 10.2681 10.4737C10.1959 10.4065 10.132 10.3276 10.08 10.2436C10.006 10.1243 10.001 9.98987 10.0514 9.85882C10.2278 9.40856 10.7486 9.28591 11.083 9.52784C11.1502 9.57656 11.2174 9.62529 11.2846 9.67569C11.8945 10.131 12.5749 10.4334 13.3142 10.6031C14.3021 10.8299 15.295 10.8551 16.2879 10.6367C17.217 10.4317 18.052 10.0403 18.7442 9.37495C18.8165 9.30607 18.887 9.23382 18.9677 9.17502C19.1273 9.06077 19.302 9.03389 19.4885 9.10445C19.7271 9.19518 19.8665 9.37159 19.9169 9.61689C19.9522 9.78994 19.9136 9.95459 19.7943 10.084C19.6481 10.2436 19.4868 10.3897 19.3306 10.5376C19.1626 10.6972 18.9391 10.7946 18.8014 10.9895C18.7661 11.2029 18.7392 11.4179 18.6955 11.6296C18.5628 12.2614 18.2889 12.8259 17.8891 13.3299C17.879 13.3433 17.8672 13.3551 17.8571 13.3685C17.6286 13.634 17.3464 13.6676 17.0591 13.4693C16.8188 13.3047 16.6592 12.9116 16.8894 12.5856C16.9465 12.5033 17.0137 12.4277 17.0641 12.342C17.1481 12.1992 17.2254 12.0513 17.301 11.9035C17.338 11.8329 17.3245 11.7439 17.2926 11.7187C17.2456 11.68 17.1969 11.6952 17.1515 11.7086C16.5735 11.8699 15.9855 11.9774 15.3572 12.0379Z"
        fill="#380E63"
      />
      <path
        d="M38.314 12.0531C38.1309 12.0245 37.9528 11.9909 37.7713 11.9708C37.3228 11.9203 36.8893 11.8011 36.4508 11.6986C36.3735 11.6801 36.3281 11.7473 36.3416 11.8212C36.3466 11.8531 36.3533 11.8884 36.3685 11.917C36.4458 12.0632 36.523 12.211 36.6087 12.3538C36.6591 12.4395 36.728 12.5151 36.7835 12.5974C37.0119 12.9368 36.8305 13.3249 36.5919 13.4744C36.5365 13.5097 36.4743 13.5366 36.4138 13.5618C36.224 13.6391 36.0543 13.592 35.9031 13.4644C35.8527 13.4224 35.809 13.3703 35.767 13.3182C35.315 12.7419 35.0177 12.1001 34.9303 11.3693C34.8765 10.9291 34.8917 10.9761 34.559 10.7124C34.3776 10.5679 34.2045 10.4099 34.0298 10.2571C33.9794 10.2134 33.934 10.1646 33.8903 10.1142C33.7374 9.93447 33.6887 9.7295 33.7727 9.50941C33.8685 9.25571 34.0567 9.10283 34.3305 9.06922C34.4498 9.0541 34.564 9.0877 34.6632 9.15323C34.7455 9.20867 34.8211 9.27587 34.8917 9.34644C35.5503 10 36.35 10.3898 37.2404 10.6065C37.9074 10.7695 38.5845 10.8384 39.2734 10.7661C39.7051 10.7208 40.1302 10.6603 40.5519 10.5494C41.2055 10.3797 41.8019 10.0941 42.3479 9.70094C42.4286 9.64214 42.5075 9.57997 42.5915 9.52453C42.9545 9.28763 43.4131 9.4254 43.5963 9.82527C43.6719 9.98824 43.6635 10.1546 43.5542 10.2974C43.4837 10.3881 43.4014 10.4738 43.3106 10.5443C43.1258 10.6872 42.9326 10.8165 42.7428 10.9526C42.7075 10.9778 42.6974 11.0517 42.7226 11.0904C42.7596 11.1458 42.7948 11.2029 42.8368 11.2534C43.0284 11.4869 43.2535 11.6851 43.4938 11.8649C43.5878 11.9355 43.6853 11.9993 43.7727 12.0766C44.0163 12.29 44.06 12.6125 43.8903 12.8898C43.7357 13.1401 43.3778 13.2359 43.0939 13.0998C43.0334 13.0712 42.978 13.0326 42.9225 12.9956C42.4739 12.6999 42.0842 12.337 41.7582 11.9103C41.4894 11.5591 41.518 11.5457 41.0627 11.6885C40.73 11.7927 40.3839 11.8515 40.0428 11.9304C39.9941 11.9422 39.9454 11.9523 39.8984 11.964C39.8379 11.9792 39.8059 12.0716 39.8396 12.127C39.979 12.3572 40.1554 12.5554 40.3469 12.7419C40.4192 12.8125 40.4965 12.8746 40.567 12.9452C40.7468 13.13 40.7955 13.3518 40.7132 13.592C40.6292 13.834 40.4377 13.965 40.189 14.002C40.0143 14.0289 39.8547 13.9667 39.7253 13.8541C39.5371 13.6912 39.349 13.5232 39.1793 13.3417C38.9054 13.0477 38.6786 12.7184 38.4921 12.3622C38.4383 12.2597 38.3762 12.1606 38.314 12.0531Z"
        fill="#380E63"
      />
    </svg>
  );
}

export default {
  aspectRatio: 55 / 22,
  svg: SleepMask,
  title,
} as Sticker;
