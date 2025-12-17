import React from 'react'
import {useEffect} from 'react'
import {formatDate} from '@cm/class/Days/date-utils/formatters'

import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'
export default function ClendarPeriodSelecter() {
  const {router, pathname, query, addQuery} = useGlobal()

  useEffect(() => {
    if (!query.currentMonth) {
      addQuery({currentMonth: formatDate(new Date())})
    }
  }, [query.currentMonth])

  const handlePrevMonth = () => {
    const newValue = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    addQuery({currentMonth: formatDate(newValue)})
  }

  const currentMonth = new Date(query?.currentMonth ?? new Date())

  const handleNextMonth = () => {
    const newValue = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    addQuery({currentMonth: formatDate(newValue)})
  }

  const handleToday = () => {
    addQuery({currentMonth: formatDate(new Date())})
  }

  return (
    <div>
      <div className="mb-5 flex justify-between">
        <button className=" rounded-sm  border-2 px-2 py-1  " onClick={handlePrevMonth}>
          先月
        </button>
        <button onClick={handleToday}>
          <h2 className="text-lg font-semibold">
            {currentMonth?.toLocaleDateString('ja-JA', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
        </button>
        <button className=" rounded-sm  border-2 px-2 py-1  " onClick={handleNextMonth}>
          来月
        </button>
      </div>
    </div>
  )
}
