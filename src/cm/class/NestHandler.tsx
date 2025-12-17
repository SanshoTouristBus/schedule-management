import {anyObject} from '@cm/types/utility-types'

export type nestIsolatorType = {
  keyArray: string[]
  joinWith: string
}

export class NestHandler {
  /**
   * dataObjectをkeyで分割し、joinで戻して単一のkeyとなるstringを作成する
   */
  static makeKeyByGroupByObj(props: {dataObj: any; nestIsolatorArry: nestIsolatorType}) {
    const {dataObj, nestIsolatorArry} = props

    if (nestIsolatorArry) {
      const {keyArray, joinWith} = nestIsolatorArry
      const key = keyArray //例）1-1, 1-2 1-3など
        ?.map(keyStr => {
          // keyStrの中身は、例）'id', 'name', 'address.city'など
          // これをreduceして、最下層までdataObjの中身を取得する
          const result =
            keyStr.split('.').reduce((obj, key) => {
              return obj?.[key]
            }, dataObj) ?? ''

          return result
        })

        //取得したobjectの中身をjoinする
        ?.join(joinWith)
      return key
    } else {
      return undefined
    }
  }

  static GetNestedValue = (nestedKeyString: string, dataObj: anyObject) => {
    const result = nestedKeyString.split('.').reduce((obj, key) => obj?.[key], dataObj)
    return result
  }

  static getNestObjStructureFromString = (key: string, value) => {
    if (key.includes(`.`)) {
      const [parent, child] = key.split('.')
      return {
        [parent]: {
          [child]: String(value),
        },
      }
    } else {
      return {[key]: value}
    }
  }
}
