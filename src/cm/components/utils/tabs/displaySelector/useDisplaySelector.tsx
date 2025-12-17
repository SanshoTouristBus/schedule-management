import {useState} from 'react'
import {JSX} from 'react'

export type displaySelectorProps = {
  items: {label: string; defaultOpen?: boolean; component: JSX.Element}[]
}
export const useDisplaySelector = (props: displaySelectorProps) => {
  const {items} = props
  const [selectedLabels, setselectedLabels] = useState(
    Object.fromEntries(items.map((item, idx) => [item.label, item.defaultOpen]))
  )

  const selectors = items.map((item, idx) => {
    const handleToggleSelect = () => {
      setselectedLabels(prev => ({...prev, [item.label]: !prev[item.label]}))
    }
    const isActive = selectedLabels[item.label]

    const {label, component, defaultOpen} = item

    return {isActive, label, component, defaultOpen, handleToggleSelect}
  })

  const selectedComponents = items.filter((item, idx) => {
    return selectedLabels[item.label]
  })

  return {
    selectedLabels,
    setselectedLabels,
    selectors,
    selectedComponents,
  }
}
