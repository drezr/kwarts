export const getIcon = (
  name: string,
  color: string = 'black',
  size: number = 14
) => {
  /**
   * Returns desired icon
   * See https://icons.getbootstrap.com/ for icons identifiers
   * Use <span v-html="getIcon(identifier, color, size)"></span> to include icons in components
   *
   * @param {string} name icon's name identifier
   * @param {string} color icon's color
   * @param {number} size icon's size
   *
   */
  return `
    <svg class="bi" width="${size}" height="${size}" fill="${color}">
      <use xlink:href="/bootstrap-icons.svg#${name}" />
    </svg>
  `
}
