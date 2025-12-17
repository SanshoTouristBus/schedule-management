export const createUpdate = <T,>(payload: T): {create: T; update: T} => {
  return {
    create: payload,
    update: payload,
  }
}
