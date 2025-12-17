'use client'

import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'
import {JSX} from 'react'
import useWindowSize from 'src/cm/hooks/useWindowSize'
import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties, useEffect} from 'react'

import {anyObject} from '@cm/types/utility-types'

import {useJotaiByKey, atomTypes} from '@cm/hooks/useJotai'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@cm/shadcn/ui/tabs'
import {cn} from '@shadcn/lib/utils'

export type tabComponent = {
  style?: CSSProperties
  exclusiveTo?: boolean
  label?: any
  description?: any
  component: any
  containerClass?: string
}
type BasicTabsType = {
  id: string
  headingText?: string | JSX.Element
  TabComponentArray: tabComponent[]
  showAll?: boolean
  className?: string
  style?: anyObject
}
export default function BasicTabs({
  headingText,
  id = '',
  showAll,
  TabComponentArray,
  className,
  style = {maxWidth: '90vw'},

  ...props
}: BasicTabsType) {
  const {width} = useWindowSize()

  const [value, setValue] = useJotaiByKey<atomTypes[`globalCurrentTabIdx`]>(`globalCurrentTabIdx`, {})

  const currentTabIdx = value[id] ?? 0

  const setcurrentTabIdx = newValue => {
    setValue({...value, [id]: newValue})
  }

  const filteredTabComponentArray = TabComponentArray.filter(obj => obj?.exclusiveTo !== false)

  const anyTabIsActive = filteredTabComponentArray.some((obj, idx) => currentTabIdx === idx)

  useEffect(() => {
    if (anyTabIsActive === false) {
      setcurrentTabIdx(0)
    }
  }, [anyTabIsActive])

  if (!width) return <PlaceHolder />

  // shadcn/uiのTabsを使用する場合は、文字列のvalueが必要
  const currentTabValue = String(currentTabIdx)
  const handleTabChange = (value: string) => {
    setcurrentTabIdx(parseInt(value))
  }

  return (
    <div style={{maxWidth: '90vw', ...style}} className={cn('mx-auto', className)} {...props}>
      {headingText && (
        <div className="mb-4">
          {typeof headingText === 'string' ? <h2 className="text-xl font-semibold text-gray-800">{headingText}</h2> : headingText}
        </div>
      )}

      {showAll
        ? renderShowAll({filteredTabComponentArray})
        : renderTabsComponent({
            filteredTabComponentArray,
            currentTabValue,
            handleTabChange,
          })}
    </div>
  )
}

/**全てのコンポーネントをflexで表示 */
const renderShowAll = ({filteredTabComponentArray}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredTabComponentArray.map((obj, idx) => {
        const {containerClass, label, description} = obj ?? {}

        return (
          <div
            key={idx}
            className={cl('rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md', containerClass)}
          >
            <div className="space-y-1">
              {label && <h3 className="text-lg font-medium text-gray-900">{label}</h3>}

              {description && (
                <div className="text-sm text-gray-600">
                  <hr className="mb-2" />
                  {description}
                </div>
              )}

              <div className="mt-4">{obj?.component}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const renderTabsComponent = ({filteredTabComponentArray, currentTabValue, handleTabChange}) => {
  return (
    <div>
      <Tabs value={currentTabValue} onValueChange={handleTabChange} className="w-full ">
        <TabsList
          className="grid w-full bg-gray-200 "
          style={{gridTemplateColumns: `repeat(${filteredTabComponentArray.length}, 1fr)`}}
        >
          {filteredTabComponentArray
            .filter(obj => obj?.label)
            .map((obj, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                className=" font-medium transition-all duration-200 data-[state=active]:bg-white  data-[state=active]:text-gray-900 data-[state=active]:shadow-sm cursor-pointer"
              >
                {obj?.label}
              </TabsTrigger>
            ))}
        </TabsList>

        {filteredTabComponentArray.map((obj, i) => {
          const {containerClass = 'mx-auto w-fit'} = obj ?? {}

          return (
            <TabsContent
              key={i}
              value={String(i)}
              className="mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <div className={cl('animate-in fade-in-50 duration-300', containerClass)}>
                <div>
                  <div>
                    <div className={`mx-auto w-fit`}>{obj?.component}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
