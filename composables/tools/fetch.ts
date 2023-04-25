export const useFetchWrapper = async (
  url: string,
  params?: Object,
  options?: Object
) => {
  /**
   * Wrapper of useFetch().
   * Return base item without having to go for .data.value and receive a Proxy of that item.
   *
   * @param {string} url url to fetch
   * @param {object} params fetch params - Use getQuery(event) inside defineEventHandler(event)
   * @param {object} options fetch options - params in options override argument "params"
   *
   */

  let opts: any

  if (options) {
    opts = options
  }

  if (params) {
    opts = options ? options : {}

    if (!opts.params) {
      opts.params = params
    }
  }

  let fetchedItem = await useFetch(url, opts)

  return JSON.parse(JSON.stringify(fetchedItem.data.value))
}
