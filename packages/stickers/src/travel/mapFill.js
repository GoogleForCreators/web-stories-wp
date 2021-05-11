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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = __('Map', 'web-stories');

const MapFill = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 256 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M.791885 18.644c3.924175 4.9232 7.913745.9847 11.837915 0 .4578-.1313 1.0464-1.0502.981-1.5097-.5886-3.2821 1.0465-7.15501-2.8777-9.71504 1.7005-2.0349 3.401-3.87288 4.8398-5.84214.5233-.722059.8503-1.903612.7195-2.75696-.2616-1.70669-.9811-3.41338-1.3735-5.12008-.1308-.72206.0654-1.5754.2616-2.29746.5232-1.44412 1.1773-2.88822 2.0275-4.98882 2.6815-1.0502 6.3441-2.4944 3.9242-7.9426.327 0 .654 0 1.0464-.0657 1.8313 1.1816 3.6626 2.4288 5.5593 3.5447.7194.3938 1.635.6564 2.4853.6564 2.6161.0656 5.2976 0 8.1753 0 .9157-2.1662 3.3356-1.9693 5.6247-2.6913 2.4853-.7877 4.382-.5908 7.2597 1.1815.5886-3.1508 1.2426-5.7765 1.4389-8.4021.327-3.8073 1.962-5.1201 5.8208-4.3981 2.0275.3939 4.055.919 6.0825.7878 2.6161-.1313 3.6625-3.0852 2.4199-6.433-.1962-.8533-.8503-1.7067-1.2427-2.3631 2.8778.3282 5.8863.8534 8.9602 1.0503.8503.0656 2.1583-.7221 2.6161-1.5098 1.8313-3.3477 3.9242-3.5446 6.0825-.3282.3924.5252.7848 1.0503 1.1118 1.6411 1.9621 3.8728 1.8313 3.8072 4.5782.3938.7195-.8533 1.9621-1.7067 3.0086-1.7067.5886 0 1.2426 1.5754 1.8967 2.4288 1.5042 2.0349 1.8966 5.317 6.0826 4.9231-2.2239 3.5447-.5234 8.074-4.3168 11.0279-.7848.5908-.654 2.9539-.3924 4.398.327 1.7723 1.1119 3.479 2.0275 4.9888.3924.5908 2.1583 1.1815 2.4853.8533 2.2894-2.0349 3.7284 0 6.2784 1.3785.589-.8533 1.308-1.9692 2.028-3.0195 1.766-2.5601 4.055-2.2975 6.605-1.3785 1.243.4595 2.617.3282 3.99.5251.85.1313 2.355.3282 2.355.5252 0 1.0502.065 2.6913-.589 3.1508-1.766 1.24718-2.289 2.23181-.981 4.13543.588.85335.458 2.10054.785 3.15081.719 2.428755 1.504 4.79187 2.485 7.74576-1.831 2.69132-4.317 6.1047-2.224 10.5684.197.4594-.327 1.3784-.785 1.9036-1.046 1.1815-2.289 2.2318-3.27 3.4133-2.616 3.2165-2.42 4.1355 1.178 6.1704 0 2.2975-.262 4.5949.065 6.8268.458 3.2164-1.504 4.9887-3.205 7.0893-.981 1.1815-1.504 2.8226-1.831 4.3324-.458 2.1661-.458 4.4636-.719 6.8267 1.831 1.1159 3.858 2.3631 5.82 3.5447 2.944-3.676 4.775-8.3365 10.138-9.2555.915-.197 1.635-1.838 2.42-2.8883.327-.4595.523-1.1815.915-1.3128 2.747-.919 4.513-2.6257 5.363-5.3827.131-.3282 2.224-.0656 4.186-.0656.785-.8533 2.486-2.1005 3.467-3.8072 1.504-2.6914 3.335-1.9036 4.578-.3939 3.008 3.7416 6.867 5.7109 11.38 6.5642 2.551.5252 2.485 1.9693 1.373 3.7416.981.7221 1.766 1.2472 2.093 1.4441 1.504-1.3128 2.878-2.3631 4.186-3.5446 1.831-1.6411 3.663-2.9539 6.409-1.9693.524.1969 2.224-1.3128 2.42-2.2318.654-3.8073 2.551-6.4329 6.017-8.0083-.981-3.5447.524-5.6452 4.055-4.7919 4.382 1.0503 8.568 2.9539 12.819 4.4637.589.1969 1.374.8533 1.701.6564 3.532-2.1662 4.186.5907 5.755 2.8226 2.878 4.0698 5.167 8.4678 8.437 12.4063 3.205 3.8072 6.671 6.4986 10.661 9.1242 3.074 1.9693 4.186 9.8463 2.878 13.6536-.851 2.3631-1.112 4.9231-1.308 7.4832-.197 2.7569-.72 5.8421.13 8.3365 1.178 3.3477 3.467 6.3016 5.363 9.4524 1.112 1.838 2.028 3.8073 3.532 5.2514 1.504 1.5097 3.336 2.8226 5.298 3.6098 1.831.788 3.989.788 6.409 1.248-2.616 2.757-1.766 5.054.131 7.089.523.591 1.439.985 2.224.985 3.205.131 5.232 2.954 4.186 5.973-.981 2.757-.72 6.236-5.625 6.499.327.393.719.722 1.046 1.116 1.047.393 2.028.787 3.336 1.247-1.374 1.838-2.747 3.676-3.99 5.382.393.526.458.788.654.919 2.878 1.444 4.709 3.479 2.486 6.565-1.832 2.56-1.178 5.382-.851 7.877.589 4.004-1.831 5.907-4.251 7.745-1.308 1.051-3.27 1.248-4.84 1.97-.85.393-1.504 1.181-2.158 1.903-.719.722-1.373 1.51-2.093 2.232-.785-.919-2.289-1.838-2.289-2.757 0-2.56-1.439-2.954-3.401-3.413-3.532-.788-6.932-1.051-10.268.919-.981.59-2.485.394-3.728.262-4.12-.394-8.175-.722-12.296.788-3.597 1.313-9.352-.656-10.857-3.02-5.101 1.116-10.268 2.101-15.238 3.414-4.579 1.247-8.634 3.348-9.484 8.861-.131.854-.915 1.642-1.439 2.429-.915 1.379-1.7 2.954-2.812 4.136-1.374 1.509-3.009 2.954-4.644 4.201-1.308.984-2.877 1.706.131 4.004-3.401.328-5.755.525-8.502.853.719 4.201 1.439 8.337 2.158 12.407.131.722.392 1.509.85 2.1 2.682 3.545 2.878 7.549 2.355 11.75-.066.788.654 1.904 1.308 2.56 2.42 2.363 4.905 4.529 7.587 6.958-4.317 3.939-2.813 8.008-1.505 12.406-1.831-1.969-3.662-3.938-5.494-5.907-.261.131-.523.262-.784.394.196 1.641.457 3.216.523 4.135-2.028-.985-4.317-2.101-6.606-3.216-.719-.329-1.831-.723-1.896-1.248-.066-.59.654-1.378 1.111-2.035.458-.656.981-1.312 1.112-2.363-.458.263-.915.525-1.439.788-.457-.788-.915-1.575-1.373-2.363-.196.066-.393.131-.589.197v2.035c-2.877-1.773-6.148-3.676-9.287-5.777-.85-.591-1.57-1.444-2.158-2.363-2.355-3.545-2.878-3.151-6.737-2.1-3.074.853-6.082 2.166-10.006.919-3.532-1.182-8.437-3.086-11.969 1.247-.654-.591-1.243-1.379-1.962-1.641-2.485-.854-1.439-1.97-.523-3.414.588-.919.981-2.035 1.177-3.15 1.046-5.186-1.243-10.831 2.224-15.755.523-.722.261-2.1.327-3.15-6.214-1.576-12.165-2.363-18.3132-1.182-1.1119.197-2.4853-1.05-3.5972-1.575-.2616.59-.5232 1.706-1.1772 2.166-3.1394 1.903-6.4749 3.61-10.0067 5.514 1.5043 1.575 2.5507 2.625 3.4664 3.676 1.635 1.903 2.7469 3.938 1.1772 6.564-3.0739 5.317-3.5317 10.962-2.6161 17.067.7848 5.186 1.7659 10.896-3.728 14.769-.3924.263-.9156.919-.9156 1.313.2616 6.958-5.5592 11.159-7.4559 17.133-.5886 1.706-.7195 3.61-1.1119 5.842-1.8312.656-2.6161 4.857-1.1772 9.19-2.8123 4.266-5.5593 8.336-8.1754 12.472-.2616.394.2616 1.378.5232 2.1.2617.854.5887 1.707.7195 2.166-1.5697.263-2.6815.394-3.8588.591.4578 1.379.9156 2.823 1.1119 3.414-1.1773 9.583-3.0086 18.511 2.9431 26.125-.654 1.904-1.4389 3.282-1.4389 4.595 0 .459 2.0275.919 3.401 1.444-.0654.263-.1962.853-.4579 1.904 1.9621-.985 3.4664-1.707 5.0361-2.495 2.9431-1.509 5.9516-3.282 9.2872-1.706 1.0464.459 1.8967 2.1 2.0929 3.282.7848 4.463 1.4388 8.993 1.7658 13.522.3271 4.135 2.4199 7.286 4.8398 10.371.9811 1.248 1.9621 2.429 3.401 3.545-.5886-1.838-1.1773-3.61-1.7659-5.711 2.8777 2.56 3.5972 4.661 3.4664 8.14-.0654.788 1.1772 1.641 1.4388 2.56 2.0275 8.139 3.9242 16.345 5.8863 24.484 0 .132 0 .263.0654.329 3.6629 4.332 5.6249 9.977 10.9219 12.997 2.813 1.641 5.363 3.216 8.699 2.625 2.027-.328 4.12-.59 6.148-.984 3.335-.657 6.082.065 7.979 3.15 2.158 3.414 4.447 6.762 6.606 10.109l6.082 5.12c2.551 1.313 2.878 4.727.654 7.221-1.373 1.575-3.139 2.691-2.747 5.514.131.919-2.812 2.297-4.316 3.479.196.197.457.328.654.525-1.243-.328-2.486-.591-4.317-1.05-.131-.328-.327-1.641-1.046-2.232-.916-.722-2.224-1.116-3.401-1.182-.981-.065-2.224.329-3.009.985-1.962 1.51-5.821.919-5.755 5.12 0 .854-1.962 1.707-3.009 2.56h-.654c-.588-1.181-.915-2.822-1.897-3.544-2.55-1.97-2.55-4.005.131-5.646.72-.459 1.308-1.706 1.308-2.625.131-1.773-.85-3.808-.196-5.252.916-2.231.066-2.494-1.635-2.56-2.027-.065-4.12 0-6.148 0-.261-1.116-.523-2.363-.785-3.61-.457-2.494-1.766-2.626-4.251-2.823-3.6624-.328-7.1288-2.297-10.6605-3.544-.2616-.066-.5232-.525-.5232-.788.2616-3.545-2.3545-3.085-4.382-3.479-.4578 2.888-.8503 5.58-1.3081 8.205-.3924-.065-.7194-.131-1.1118-.197v-3.282c-.8503.46-1.4389.788-1.8313 1.05-1.5697-1.903-2.8123-3.872-4.5128-5.448-1.8967-1.772-4.2512-3.151-6.2787-4.857-.327-.263.0654-1.379-.0654-2.035-.5886-2.363-.654-5.974-2.1583-6.827-2.5507-1.378-3.0085-2.626-2.0275-5.186l-.7848-.591c-1.4389.919-2.8123 1.904-3.9896 2.692-1.7004-5.711-2.7469-12.21-9.2872-16.87.1962 2.035.5232 3.479.5232 4.923-.0654 1.51-.4578 2.954-.7194 4.464-.3924 0-.7194.065-1.1118.065-.1962-2.035-.7195-4.135-.4578-6.104.2616-2.56-.7849-4.924-2.5508-4.595 1.4389-4.924 1.1119-5.58-3.7933-6.302-.7849-.131-1.5697-.394-1.8313-.459-.7848-3.02-1.5043-5.777-2.2237-8.665-.8502.591-1.5043 1.05-2.7469 1.903.7848-2.166 1.3734-3.676 1.9621-5.382-2.2891 1.181-4.6436 1.772-5.8863 3.216-1.3081 1.51-1.5043 3.939-2.2237 6.236-1.0464-.919-1.7005-1.444-2.3545-1.969-.1962.263-.3924.459-.654.722 1.1772 1.116 2.4199 2.232 3.6625 3.413-.3924.854-.9156 1.773-1.3734 2.823.654.788 1.2426 1.51 1.7004 1.969-1.308 1.576-2.4853 2.954-3.7279 4.398-.2616-.131-.5886-.197-.8502-.328-.1309-2.954-.1963-5.842-.3925-8.796-.1962-2.888.1308-5.908-.7848-8.533-2.2891-6.433-.3924-12.407 1.1118-18.446.2617-1.116-.4578-2.429-.4578-3.676.0654-2.232.327-4.398.4578-6.63 3.1394.394 2.8778-2.363 3.5318-4.069.5886-1.51.8502-3.151 1.3735-4.989.654.788 1.0464 1.313 1.4388 1.838.2616-.132.4578-.197.7195-.328-.4579-1.379-.8503-2.823-1.3081-4.201.7848-1.707 1.1118-3.676 1.3735-5.58.0654-.591.0654-1.247.2616-1.838 1.7658-3.807 3.7279-7.549 5.4284-11.356.981-2.166 1.6351-4.464 2.2237-6.696.3924-1.509.9156-3.347.327-4.595-1.1118-2.494-.1308-3.872 1.5043-5.316 1.8967-1.707 5.5592-1.838 5.2322-5.711 0-.132.2616-.329.4578-.394 3.728-1.904 6.3441-4.595 7.6522-8.665.5232-1.575 1.8312-2.888 2.6815-4.398 1.308-2.494 2.4853-5.054 3.8588-7.746 2.3545-.197 5.7554-4.463 4.7744-6.564-1.0465-2.232-2.2891-4.464-3.2702-6.761-.2616-.656.327-1.641.4578-2.494.0654-.263-.0654-.591-.1308-.985-.654.066-1.308.066-1.5042.066-.5233-1.838-1.1773-3.479-1.5043-5.186-.3924-2.298-.7194-4.661-.5886-6.958.1308-1.576.1962-2.495-1.5697-3.217-3.9242-1.641-5.4938-5.054-6.2133-9.124-.1962-1.181-.9156-2.297-1.1772-3.545-.3924-1.641-.5886-3.347-.8503-4.988 1.2427-.263 2.1583-.46 3.2048-.722-.1962-1.313-.654-2.364-.5232-3.414.9156-9.19-2.4199-17.067-7.2598-24.484-.1308-.263-.327-.525-.5886-.657-5.7554-3.085-11.1185-6.564-13.6692-13.062-.1308-.263-.4578-.394-.654-.657-2.6815-4.332-7.5213-7.417-7.7175-13.259-.0654-1.051-.1308-2.167-.4579-3.151-1.3734-5.186.6541-7.68 5.5593-7.352.327-.919.5232-2.232.981-2.298 1.3735-.262 2.8777-.131 4.7744-.131V101.55c1.2427-.985 2.4199-1.9694 3.2702-2.6915 1.635-.1313 3.9241.3282 4.3166-.3938 1.308-2.2319 2.0275-4.8575 2.6815-7.3519.1308-.5252-.654-1.7067-1.2427-1.9693-.5232-.1969-1.5696.2626-2.1583.7221-1.1772.919-2.2891 2.1005-2.9431 2.7569-2.4199-4.5293-4.8398-8.8616-7.0635-13.3253-.2616-.4595.0654-1.5098.4578-1.9693 1.7005-1.7723 1.3735-3.7415.1308-5.2513-2.8123-3.479-6.8019-5.8421-9.091-9.7807-.981-1.641-1.9621-3.2821-3.2047-4.6605-3.0085-3.2821-6.4749-6.1704-9.2872-9.5838-1.5697-1.9692-3.4664-5.0544-2.9432-6.958.6541-2.2975.9811-3.7416-.327-5.7765-.9156-1.4441-1.50423-3.0852-1.96205-4.7262-1.11185-3.8073-1.04645-3.8073-4.12038-1.9693C3.4734 25.799 1.96914 23.042.530273 20.2194c.261612-.6564.261612-1.1159.261612-1.5754z"
      fill="#fff"
      fillOpacity=".5"
    />
    <circle
      cx="49.97"
      cy="30.762"
      r="6.592"
      fill="#FEC85A"
      stroke="#fff"
      strokeWidth="2.19733"
    />
  </svg>
);

MapFill.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 256 / 430,
  svg: MapFill,
  title,
};
