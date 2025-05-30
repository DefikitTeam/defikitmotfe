/* eslint-disable */
const lightModeColors = [
  {
    variantName: 'Neutral',
    variantList: [
      { color: 'rgb(255, 255, 255)', level: '0' },
      { color: 'rgb(249, 250, 251)', level: '50' },
      { color: 'rgb(242, 244, 247)', level: '100' },
      { color: 'rgb(234, 236, 240)', level: '200' },
      { color: 'rgb(208, 213, 221)', level: '300' },
      { color: 'rgb(152, 162, 179)', level: '400' },
      { color: 'rgb(102, 112, 133)', level: '500' },
      { color: 'rgb(71, 84, 103)', level: '600' },
      { color: 'rgb(52, 64, 84)', level: '700' },
      { color: 'rgb(24, 34, 48)', level: '800' },
      { color: 'rgb(16, 24, 40)', level: '900' },
      { color: 'rgb(12, 17, 29)', level: '950' },
      { color: 'rgb(0, 0, 0)', level: '1000' }
    ]
  },
  {
    variantName: 'Primary',
    variantList: [
      { color: 'rgb(240, 249, 255)', level: '50' },
      { color: 'rgb(224, 242, 254)', level: '100' },
      { color: 'rgb(185, 230, 254)', level: '200' },
      { color: 'rgb(124, 212, 253)', level: '300' },
      { color: 'rgb(54, 191, 250)', level: '400' },
      { color: 'rgb(11, 165, 236)', level: '500' },
      { color: 'rgb(0, 134, 201)', level: '600' },
      { color: 'rgb(2, 106, 162)', level: '700' },
      { color: 'rgb(6, 89, 134)', level: '800' },
      { color: 'rgb(11, 74, 111)', level: '900' },
      { color: 'rgb(6, 44, 65)', level: '950' }
    ]
  },
  {
    variantName: 'Success',
    variantList: [
      { color: 'rgb(236, 253, 243)', level: '50' },
      { color: 'rgb(220, 250, 230)', level: '100' },
      { color: 'rgb(171, 239, 198)', level: '200' },
      { color: 'rgb(117, 224, 167)', level: '300' },
      { color: 'rgb(71, 205, 137)', level: '400' },
      { color: 'rgb(23, 178, 106)', level: '500' },
      { color: 'rgb(7, 148, 85)', level: '600' },
      { color: 'rgb(6, 118, 71)', level: '700' },
      { color: 'rgb(8, 93, 58)', level: '800' },
      { color: 'rgb(7, 77, 49)', level: '900' },
      { color: 'rgb(5, 51, 33)', level: '950' }
    ]
  },
  {
    variantName: 'Warning',
    variantList: [
      { color: 'rgb(255, 250, 235)', level: '50' },
      { color: 'rgb(254, 240, 199)', level: '100' },
      { color: 'rgb(254, 223, 137)', level: '200' },
      { color: 'rgb(254, 200, 75)', level: '300' },
      { color: 'rgb(253, 176, 34)', level: '400' },
      { color: 'rgb(247, 144, 9)', level: '500' },
      { color: 'rgb(220, 104, 3)', level: '600' },
      { color: 'rgb(181, 71, 8)', level: '700' },
      { color: 'rgb(147, 55, 13)', level: '800' },
      { color: 'rgb(122, 46, 14)', level: '900' },
      { color: 'rgb(78, 29, 9)', level: '950' }
    ]
  },
  {
    variantName: 'Error',
    variantList: [
      { color: 'rgb(254, 243, 242)', level: '50' },
      { color: 'rgb(254, 228, 226)', level: '100' },
      { color: 'rgb(254, 205, 202)', level: '200' },
      { color: 'rgb(253, 162, 155)', level: '300' },
      { color: 'rgb(249, 112, 102)', level: '400' },
      { color: 'rgb(240, 68, 56)', level: '500' },
      { color: 'rgb(217, 45, 32)', level: '600' },
      { color: 'rgb(180, 35, 24)', level: '700' },
      { color: 'rgb(145, 32, 24)', level: '800' },
      { color: 'rgb(122, 39, 26)', level: '900' },
      { color: 'rgb(85, 22, 12)', level: '950' }
    ]
  },
  {
    variantName: 'Alpha',
    variantList: [
      { color: 'rgba(255, 255, 255, 0.1)', level: '10%' },
      { color: 'rgba(255, 255, 255, 0.2)', level: '20%' },
      { color: 'rgba(255, 255, 255, 0.3)', level: '30%' },
      { color: 'rgba(255, 255, 255, 0.4)', level: '40%' },
      { color: 'rgba(255, 255, 255, 0.5)', level: '50%' },
      { color: 'rgba(255, 255, 255, 0.6)', level: '60%' },
      { color: 'rgba(255, 255, 255, 0.698)', level: '70%' },
      { color: 'rgba(255, 255, 255, 0.8)', level: '80%' },
      { color: 'rgba(255, 255, 255, 0.898)', level: '90%' },
      { color: 'rgb(255, 255, 255)', level: '100%' }
    ]
  },
  {
    variantName: 'Pink',
    variantList: [{ color: 'rgb(250, 46, 105)', level: '50' }]
  },
  {
    variantName: 'Blue',
    variantList: [{ color: 'rgb(54, 191, 250)', level: '400' }]
  }
];

const darkModeColors = [
  {
    variantName: 'Neutral',
    variantList: [
      { color: 'rgb(0, 0, 0)', level: '0' },
      { color: 'rgb(12, 17, 29)', level: '50' },
      { color: 'rgb(22, 27, 38)', level: '100' },
      { color: 'rgb(31, 36, 47)', level: '200' },
      { color: 'rgb(51, 55, 65)', level: '300' },
      { color: 'rgb(97, 100, 108)', level: '400' },
      { color: 'rgb(133, 136, 142)', level: '500' },
      { color: 'rgb(148, 150, 156)', level: '600' },
      { color: 'rgb(206, 207, 210)', level: '700' },
      { color: 'rgb(236, 236, 237)', level: '800' },
      { color: 'rgb(240, 241, 241)', level: '900' },
      { color: 'rgb(249, 250, 251)', level: '950' },
      { color: 'rgb(255, 255, 255)', level: '1000' }
    ]
  },
  {
    variantName: 'Primary',
    variantList: [
      { color: 'rgb(6, 44, 65)', level: '50' },
      { color: 'rgb(11, 74, 111)', level: '100' },
      { color: 'rgb(6, 89, 134)', level: '200' },
      { color: 'rgb(2, 106, 162)', level: '300' },
      { color: 'rgb(0, 134, 201)', level: '400' },
      { color: 'rgb(11, 165, 236)', level: '500' },
      { color: 'rgb(54, 191, 250)', level: '600' },
      { color: 'rgb(124, 212, 253)', level: '700' },
      { color: 'rgb(185, 230, 254)', level: '800' },
      { color: 'rgb(224, 242, 254)', level: '900' },
      { color: 'rgb(240, 249, 255)', level: '950' }
    ]
  },
  {
    variantName: 'Success',
    variantList: [
      { color: 'rgb(5, 51, 33)', level: '50' },
      { color: 'rgb(7, 77, 49)', level: '100' },
      { color: 'rgb(8, 93, 58)', level: '200' },
      { color: 'rgb(6, 118, 71)', level: '300' },
      { color: 'rgb(7, 148, 85)', level: '400' },
      { color: 'rgb(23, 178, 106)', level: '500' },
      { color: 'rgb(71, 205, 137)', level: '600' },
      { color: 'rgb(117, 224, 167)', level: '700' },
      { color: 'rgb(171, 239, 198)', level: '800' },
      { color: 'rgb(220, 250, 230)', level: '900' },
      { color: 'rgb(236, 253, 243)', level: '950' }
    ]
  },
  {
    variantName: 'Warning',
    variantList: [
      { color: 'rgb(78, 29, 9)', level: '50' },
      { color: 'rgb(122, 46, 14)', level: '100' },
      { color: 'rgb(147, 55, 13)', level: '200' },
      { color: 'rgb(181, 71, 8)', level: '300' },
      { color: 'rgb(220, 104, 3)', level: '400' },
      { color: 'rgb(247, 144, 9)', level: '500' },
      { color: 'rgb(253, 176, 34)', level: '600' },
      { color: 'rgb(254, 200, 75)', level: '700' },
      { color: 'rgb(254, 223, 137)', level: '800' },
      { color: 'rgb(254, 240, 199)', level: '900' },
      { color: 'rgb(255, 250, 235)', level: '950' }
    ]
  },
  {
    variantName: 'Error',
    variantList: [
      { color: 'rgb(85, 22, 12)', level: '50' },
      { color: 'rgb(122, 39, 26)', level: '100' },
      { color: 'rgb(145, 32, 24)', level: '200' },
      { color: 'rgb(180, 35, 24)', level: '300' },
      { color: 'rgb(217, 45, 32)', level: '400' },
      { color: 'rgb(240, 68, 56)', level: '500' },
      { color: 'rgb(249, 112, 102)', level: '600' },
      { color: 'rgb(253, 162, 155)', level: '700' },
      { color: 'rgb(254, 205, 202)', level: '800' },
      { color: 'rgb(254, 228, 226)', level: '900' },
      { color: 'rgb(254, 243, 242)', level: '950' }
    ]
  },
  {
    variantName: 'Alpha',
    variantList: [
      { color: 'rgba(0, 0, 0, 0.1)', level: '10%' },
      { color: 'rgba(0, 0, 0, 0.2)', level: '20%' },
      { color: 'rgba(0, 0, 0, 0.3)', level: '30%' },
      { color: 'rgba(0, 0, 0, 0.4)', level: '40%' },
      { color: 'rgba(0, 0, 0, 0.5)', level: '50%' },
      { color: 'rgba(0, 0, 0, 0.6)', level: '60%' },
      { color: 'rgba(0, 0, 0, 0.698)', level: '70%' },
      { color: 'rgba(0, 0, 0, 0.8)', level: '80%' },
      { color: 'rgba(0, 0, 0, 0.898)', level: '90%' },
      { color: 'rgb(0, 0, 0)', level: '100%' }
    ]
  },
  {
    variantName: 'Pink',
    variantList: [{ color: 'rgb(250, 46, 105)', level: '50' }]
  },
  {
    variantName: 'Blue',
    variantList: [{ color: 'rgb(54, 191, 250)', level: '400' }]
  }
];

const lightModeColorMap = lightModeColors.reduce((map, color) => {
  // @ts-ignore
  map[color.variantName] = color.variantList;
  return map;
}, {});

const darkModeColorMap = darkModeColors.reduce((map, color) => {
  // @ts-ignore
  map[color.variantName] = color.variantList;
  return map;
}, {});

function generateTailwindColor() {
  const colors = {
    light: {},
    dark: {}
  };

  for (const key in lightModeColorMap) {
    if (Object.prototype.hasOwnProperty.call(lightModeColorMap, key)) {
      const variant = {};

      // @ts-ignore
      const colorList = lightModeColorMap[key];

      for (const color of colorList) {
        // @ts-ignore
        variant[color.level] = color.color;
      }

      // @ts-ignore
      colors[key.toLowerCase()] = variant;
      // @ts-ignore
      colors.light[key.toLowerCase()] = variant;
    }
  }

  for (const key in darkModeColorMap) {
    if (Object.prototype.hasOwnProperty.call(darkModeColorMap, key)) {
      const variant = {};

      // @ts-ignore
      const colorList = darkModeColorMap[key];

      for (const color of colorList) {
        // @ts-ignore
        variant[color.level] = color.color;
      }

      // @ts-ignore
      colors.dark[key.toLowerCase()] = variant;
    }
  }

  return colors;
}

export const colors = {
  dark: {
    neutral: {
      '0': 'rgb(0, 0, 0)',
      '50': 'rgb(12, 17, 29)',
      '100': 'rgb(22, 27, 38)',
      '200': 'rgb(31, 36, 47)',
      '300': 'rgb(51, 55, 65)',
      '400': 'rgb(97, 100, 108)',
      '500': 'rgb(133, 136, 142)',
      '600': 'rgb(148, 150, 156)',
      '700': 'rgb(206, 207, 210)',
      '800': 'rgb(236, 236, 237)',
      '900': 'rgb(240, 241, 241)',
      '950': 'rgb(249, 250, 251)',
      '1000': 'rgb(255, 255, 255)'
    },
    primary: {
      '50': 'rgb(6, 44, 65)',
      '100': 'rgb(11, 74, 111)',
      '200': 'rgb(6, 89, 134)',
      '300': 'rgb(2, 106, 162)',
      '400': 'rgb(0, 134, 201)',
      '500': 'rgb(11, 165, 236)',
      '600': 'rgb(54, 191, 250)',
      '700': 'rgb(124, 212, 253)',
      '800': 'rgb(185, 230, 254)',
      '900': 'rgb(224, 242, 254)',
      '950': 'rgb(240, 249, 255)'
    },
    success: {
      '50': 'rgb(5, 51, 33)',
      '100': 'rgb(7, 77, 49)',
      '200': 'rgb(8, 93, 58)',
      '300': 'rgb(6, 118, 71)',
      '400': 'rgb(7, 148, 85)',
      '500': 'rgb(23, 178, 106)',
      '600': 'rgb(71, 205, 137)',
      '700': 'rgb(117, 224, 167)',
      '800': 'rgb(171, 239, 198)',
      '900': 'rgb(220, 250, 230)',
      '950': 'rgb(236, 253, 243)'
    },
    warning: {
      '50': 'rgb(78, 29, 9)',
      '100': 'rgb(122, 46, 14)',
      '200': 'rgb(147, 55, 13)',
      '300': 'rgb(181, 71, 8)',
      '400': 'rgb(220, 104, 3)',
      '500': 'rgb(247, 144, 9)',
      '600': 'rgb(253, 176, 34)',
      '700': 'rgb(254, 200, 75)',
      '800': 'rgb(254, 223, 137)',
      '900': 'rgb(254, 240, 199)',
      '950': 'rgb(255, 250, 235)'
    },
    error: {
      '50': 'rgb(85, 22, 12)',
      '100': 'rgb(122, 39, 26)',
      '200': 'rgb(145, 32, 24)',
      '300': 'rgb(180, 35, 24)',
      '400': 'rgb(217, 45, 32)',
      '500': 'rgb(240, 68, 56)',
      '600': 'rgb(249, 112, 102)',
      '700': 'rgb(253, 162, 155)',
      '800': 'rgb(254, 205, 202)',
      '900': 'rgb(254, 228, 226)',
      '950': 'rgb(254, 243, 242)'
    },
    alpha: {
      '10%': 'rgba(0, 0, 0, 0.1)',
      '20%': 'rgba(0, 0, 0, 0.2)',
      '30%': 'rgba(0, 0, 0, 0.3)',
      '40%': 'rgba(0, 0, 0, 0.4)',
      '50%': 'rgba(0, 0, 0, 0.5)',
      '60%': 'rgba(0, 0, 0, 0.6)',
      '70%': 'rgba(0, 0, 0, 0.698)',
      '80%': 'rgba(0, 0, 0, 0.8)',
      '90%': 'rgba(0, 0, 0, 0.898)',
      '100%': 'rgb(0, 0, 0)'
    },
    pink: { '50': 'rgb(250, 46, 105)' },
    blue: { '400': 'rgb(54, 191, 250)' }
  },
  light: {
    neutral: {
      '0': 'rgb(255, 255, 255)',
      '50': 'rgb(249, 250, 251)',
      '100': 'rgb(242, 244, 247)',
      '200': 'rgb(234, 236, 240)',
      '300': 'rgb(208, 213, 221)',
      '400': 'rgb(152, 162, 179)',
      '500': 'rgb(102, 112, 133)',
      '600': 'rgb(71, 84, 103)',
      '700': 'rgb(52, 64, 84)',
      '800': 'rgb(24, 34, 48)',
      '900': 'rgb(16, 24, 40)',
      '950': 'rgb(12, 17, 29)',
      '1000': 'rgb(0, 0, 0)'
    },
    primary: {
      '50': 'rgb(240, 249, 255)',
      '100': 'rgb(224, 242, 254)',
      '200': 'rgb(185, 230, 254)',
      '300': 'rgb(124, 212, 253)',
      '400': 'rgb(54, 191, 250)',
      '500': 'rgb(11, 165, 236)',
      '600': 'rgb(0, 134, 201)',
      '700': 'rgb(2, 106, 162)',
      '800': 'rgb(6, 89, 134)',
      '900': 'rgb(11, 74, 111)',
      '950': 'rgb(6, 44, 65)'
    },
    success: {
      '50': 'rgb(236, 253, 243)',
      '100': 'rgb(220, 250, 230)',
      '200': 'rgb(171, 239, 198)',
      '300': 'rgb(117, 224, 167)',
      '400': 'rgb(71, 205, 137)',
      '500': 'rgb(23, 178, 106)',
      '600': 'rgb(7, 148, 85)',
      '700': 'rgb(6, 118, 71)',
      '800': 'rgb(8, 93, 58)',
      '900': 'rgb(7, 77, 49)',
      '950': 'rgb(5, 51, 33)'
    },
    warning: {
      '50': 'rgb(255, 250, 235)',
      '100': 'rgb(254, 240, 199)',
      '200': 'rgb(254, 223, 137)',
      '300': 'rgb(254, 200, 75)',
      '400': 'rgb(253, 176, 34)',
      '500': 'rgb(247, 144, 9)',
      '600': 'rgb(220, 104, 3)',
      '700': 'rgb(181, 71, 8)',
      '800': 'rgb(147, 55, 13)',
      '900': 'rgb(122, 46, 14)',
      '950': 'rgb(78, 29, 9)'
    },
    error: {
      '50': 'rgb(254, 243, 242)',
      '100': 'rgb(254, 228, 226)',
      '200': 'rgb(254, 205, 202)',
      '300': 'rgb(253, 162, 155)',
      '400': 'rgb(249, 112, 102)',
      '500': 'rgb(240, 68, 56)',
      '600': 'rgb(217, 45, 32)',
      '700': 'rgb(180, 35, 24)',
      '800': 'rgb(145, 32, 24)',
      '900': 'rgb(122, 39, 26)',
      '950': 'rgb(85, 22, 12)'
    },
    alpha: {
      '10%': 'rgba(255, 255, 255, 0.1)',
      '20%': 'rgba(255, 255, 255, 0.2)',
      '30%': 'rgba(255, 255, 255, 0.3)',
      '40%': 'rgba(255, 255, 255, 0.4)',
      '50%': 'rgba(255, 255, 255, 0.5)',
      '60%': 'rgba(255, 255, 255, 0.6)',
      '70%': 'rgba(255, 255, 255, 0.698)',
      '80%': 'rgba(255, 255, 255, 0.8)',
      '90%': 'rgba(255, 255, 255, 0.898)',
      '100%': 'rgb(255, 255, 255)'
    },
    pink: { '50': 'rgb(250, 46, 105)' },
    blue: { '400': 'rgb(54, 191, 250)' }
  }
};
