export const logLength = props => {
  Object.keys(props).forEach(key => {
    const value = props[key]
    const length = value.length
    if (length === undefined) {
      console.info(key, value)
    } else {
      console.info(`---${key} 件数: ${length}---`)
    }
  })
}
