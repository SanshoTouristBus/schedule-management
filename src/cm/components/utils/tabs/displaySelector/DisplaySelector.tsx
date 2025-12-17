import {cl} from 'src/cm/lib/methods/common'
import {Alert} from 'src/cm/components/styles/common-components/Alert'
import {Center, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {Fragment, useState} from 'react'

const DisplaySelector = (props: any) => {
  const {items, className = `mx-auto w-fit justify-around gap-4 `, style} = props
  const [selectedLabels, setselectedLabels] = useState(Object.fromEntries(items.map((item, idx) => [item.label, item.default])))

  const Selector = () => {
    return (
      <R_Stack className={className} style={style}>
        {items.map((item, idx) => {
          const btnProps = {
            className: cl(
              `rounded-sm shadow-sm p-1 bg-primary-main text-white min-w-[150px]`,
              selectedLabels[item.label] ? '' : 'opacity-50'
            ),
            onClick: () => {
              setselectedLabels(prev => {
                return {
                  ...prev,
                  [item.label]: !prev[item.label],
                }
              })
            },
          }
          return (
            <button key={idx} {...btnProps}>
              {item.label}
            </button>
          )
        })}
      </R_Stack>
    )
  }

  const Items = () => {
    const targets = items.filter(item => selectedLabels[item.label])
    if (targets.length === 0) {
      return (
        <Center style={{height: 200}}>
          <Alert>表示を選択してください</Alert>
        </Center>
      )
    }
    return items.map((item, idx) => {
      if (!selectedLabels[item.label]) {
        return <Fragment key={idx}></Fragment>
      }
      return (
        <div key={idx} className={`my-4`}>
          <h2 className={`bg-primary-main my-2 text-center text-white`}>{item.label}</h2>
          {item.component}
        </div>
      )
    })
  }

  return (
    <div>
      <Selector />
      <Items />
    </div>
  )
}

export default DisplaySelector
