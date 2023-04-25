// List of colors
// ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey',]

export default class ColorTools {
  colors: Record<string, any>

  constructor() {
    this.colors = {
      red: {
        '0': '#F44336',
        '5': '#FFEBEE',
        '4': '#FFCDD2',
        '3': '#EF9A9A',
        '2': '#E57373',
        '1': '#EF5350',
        '-1': '#E53935',
        '-2': '#D32F2F',
        '-3': '#C62828',
        '-4': '#B71C1C',
        '101': '#FF8A80',
        '102': '#FF5252',
        '103': '#FF1744',
        '104': '#D50000',
      },
      pink: {
        '0': '#e91e63',
        '5': '#fce4ec',
        '4': '#f8bbd0',
        '3': '#f48fb1',
        '2': '#f06292',
        '1': '#ec407a',
        '-1': '#d81b60',
        '-2': '#c2185b',
        '-3': '#ad1457',
        '-4': '#880e4f',
        '101': '#ff80ab',
        '102': '#ff4081',
        '103': '#f50057',
        '104': '#c51162',
      },
      purple: {
        '0': '#9c27b0',
        '5': '#f3e5f5',
        '4': '#e1bee7',
        '3': '#ce93d8',
        '2': '#ba68c8',
        '1': '#ab47bc',
        '-1': '#8e24aa',
        '-2': '#7b1fa2',
        '-3': '#6a1b9a',
        '-4': '#4a148c',
        '101': '#ea80fc',
        '102': '#e040fb',
        '103': '#d500f9',
        '104': '#aa00ff',
      },
      'deep-purple': {
        '0': '#673ab7',
        '5': '#ede7f6',
        '4': '#d1c4e9',
        '3': '#b39ddb',
        '2': '#9575cd',
        '1': '#7e57c2',
        '-1': '#5e35b1',
        '-2': '#512da8',
        '-3': '#4527a0',
        '-4': '#311b92',
        '101': '#b388ff',
        '102': '#7c4dff',
        '103': '#651fff',
        '104': '#6200ea',
      },
      indigo: {
        '0': '#3f51b5',
        '5': '#e8eaf6',
        '4': '#c5cae9',
        '3': '#9fa8da',
        '2': '#7986cb',
        '1': '#5c6bc0',
        '-1': '#3949ab',
        '-2': '#303f9f',
        '-3': '#283593',
        '-4': '#1a237e',
        '101': '#8c9eff',
        '102': '#536dfe',
        '103': '#3d5afe',
        '104': '#304ffe',
      },
      blue: {
        '0': '#2196F3',
        '5': '#E3F2FD',
        '4': '#BBDEFB',
        '3': '#90CAF9',
        '2': '#64B5F6',
        '1': '#42A5F5',
        '-1': '#1E88E5',
        '-2': '#1976D2',
        '-3': '#1565C0',
        '-4': '#0D47A1',
        '101': '#82B1FF',
        '102': '#448AFF',
        '103': '#2979FF',
        '104': '#2962FF',
      },
      'light-blue': {
        '0': '#03a9f4',
        '5': '#e1f5fe',
        '4': '#b3e5fc',
        '3': '#81d4fa',
        '2': '#4fc3f7',
        '1': '#29b6f6',
        '-1': '#039be5',
        '-2': '#0288d1',
        '-3': '#0277bd',
        '-4': '#01579b',
        '101': '#80d8ff',
        '102': '#40c4ff',
        '103': '#00b0ff',
        '104': '#0091ea',
      },
      cyan: {
        '0': '#00bcd4',
        '5': '#e0f7fa',
        '4': '#b2ebf2',
        '3': '#80deea',
        '2': '#4dd0e1',
        '1': '#26c6da',
        '-1': '#00acc1',
        '-2': '#0097a7',
        '-3': '#00838f',
        '-4': '#006064',
        '101': '#84ffff',
        '102': '#18ffff',
        '103': '#00e5ff',
        '104': '#00b8d4',
      },
      teal: {
        '0': '#009688',
        '5': '#e0f2f1',
        '4': '#b2dfdb',
        '3': '#80cbc4',
        '2': '#4db6ac',
        '1': '#26a69a',
        '-1': '#00897b',
        '-2': '#00796b',
        '-3': '#00695c',
        '-4': '#004d40',
        '101': '#a7ffeb',
        '102': '#64ffda',
        '103': '#1de9b6',
        '104': '#00bfa5',
      },
      green: {
        '0': '#4CAF50',
        '5': '#E8F5E9',
        '4': '#C8E6C9',
        '3': '#A5D6A7',
        '2': '#81C784',
        '1': '#66BB6A',
        '-1': '#43A047',
        '-2': '#388E3C',
        '-3': '#2E7D32',
        '-4': '#1B5E20',
        '101': '#B9F6CA',
        '102': '#69F0AE',
        '103': '#00E676',
        '104': '#00C853',
      },
      'light-green': {
        '0': '#8bc34a',
        '5': '#f1f8e9',
        '4': '#dcedc8',
        '3': '#c5e1a5',
        '2': '#aed581',
        '1': '#9ccc65',
        '-1': '#7cb342',
        '-2': '#689f38',
        '-3': '#558b2f',
        '-4': '#33691e',
        '101': '#ccff90',
        '102': '#b2ff59',
        '103': '#76ff03',
        '104': '#64dd17',
      },
      lime: {
        '0': '#cddc39',
        '5': '#f9fbe7',
        '4': '#f0f4c3',
        '3': '#e6ee9c',
        '2': '#dce775',
        '1': '#d4e157',
        '-1': '#c0ca33',
        '-2': '#afb42b',
        '-3': '#9e9d24',
        '-4': '#827717',
        '101': '#f4ff81',
        '102': '#eeff41',
        '103': '#c6ff00',
        '104': '#aeea00',
      },
      yellow: {
        '0': '#ffeb3b',
        '5': '#fffde7',
        '4': '#fff9c4',
        '3': '#fff59d',
        '2': '#fff176',
        '1': '#ffee58',
        '-1': '#fdd835',
        '-2': '#fbc02d',
        '-3': '#f9a825',
        '-4': '#f57f17',
        '101': '#ffff8d',
        '102': '#ffff00',
        '103': '#ffea00',
        '104': '#ffd600',
      },
      amber: {
        '0': '#ffc107',
        '5': '#fff8e1',
        '4': '#ffecb3',
        '3': '#ffe082',
        '2': '#ffd54f',
        '1': '#ffca28',
        '-1': '#ffb300',
        '-2': '#ffa000',
        '-3': '#ff8f00',
        '-4': '#ff6f00',
        '101': '#ffe57f',
        '102': '#ffd740',
        '103': '#ffc400',
        '104': '#ffab00',
      },
      orange: {
        '0': '#ff9800',
        '5': '#fff3e0',
        '4': '#ffe0b2',
        '3': '#ffcc80',
        '2': '#ffb74d',
        '1': '#ffa726',
        '-1': '#fb8c00',
        '-2': '#f57c00',
        '-3': '#ef6c00',
        '-4': '#e65100',
        '101': '#ffd180',
        '102': '#ffab40',
        '103': '#ff9100',
        '104': '#ff6d00',
      },
      'deep-orange': {
        '0': '#ff5722',
        '5': '#fbe9e7',
        '4': '#ffccbc',
        '3': '#ffab91',
        '2': '#ff8a65',
        '1': '#ff7043',
        '-1': '#f4511e',
        '-2': '#e64a19',
        '-3': '#d84315',
        '-4': '#bf360c',
        '101': '#ff9e80',
        '102': '#ff6e40',
        '103': '#ff3d00',
        '104': '#dd2c00',
      },
      brown: {
        '0': '#795548',
        '5': '#efebe9',
        '4': '#d7ccc8',
        '3': '#bcaaa4',
        '2': '#a1887f',
        '1': '#8d6e63',
        '-1': '#6d4c41',
        '-2': '#5d4037',
        '-3': '#4e342e',
        '-4': '#3e2723',
      },
      'blue-grey': {
        '0': '#607d8b',
        '5': '#eceff1',
        '4': '#cfd8dc',
        '3': '#b0bec5',
        '2': '#90a4ae',
        '1': '#78909c',
        '-1': '#546e7a',
        '-2': '#455a64',
        '-3': '#37474f',
        '-4': '#263238',
      },
      grey: {
        '0': '#9e9e9e',
        '5': '#fafafa',
        '4': '#f5f5f5',
        '3': '#eeeeee',
        '2': '#e0e0e0',
        '1': '#bdbdbd',
        '-1': '#757575',
        '-2': '#616161',
        '-3': '#424242',
        '-4': '#212121',
      },
    }
  }

  pick(color: string | null, lightness: number = 0) {
    /**
     * Returns desired color with lightness adjustement
     *
     * @param {string} color the desired color
     * @param {number} lightness the lightness level
     */

    return color ? `${this.colors[color][lightness]}` : ''
  }

  pickBG(color: string | null | undefined, lightness: number = 0) {
    /**
     * Returns desired background-color style
     *
     * @param {string} color the ''0'' color
     * @param {number} lightness the lightness level
     */

    return color ? `background-color: ${this.pick(color, lightness)};` : ''
  }

  rgb2hex(rgb: any) {
    // From https://stackoverflow.com/a/3627747
    return `#${rgb
      .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
      .slice(1)
      .map((n: any) => parseInt(n, 10).toString(16).padStart(2, '0'))
      .join('')}`
  }

  reversePick(color: string) {
    /**
     * Returns desired color name from hexadeciaml input
     *
     * @param {string} color the desired color in hexadecimal format
     */

    if (color && color.includes('rgb')) {
      color = this.rgb2hex(color)
    }

    for (let key in this.colors) {
      if (color && this.colors[key][0].toUpperCase() == color.toUpperCase()) {
        return key
      }
    }

    return null
  }
}
