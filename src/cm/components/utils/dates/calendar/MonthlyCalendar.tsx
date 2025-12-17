import VerticalDate from './VerticalDate'
import BoxDate from './BoxDate'

export default function MonthlyCalendar({arrays, currentMonth, peroidType = 'monthly', shapeType = 'vertical'}) {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']

  const {days, contentsByDays, headersByDays, firstColumns} = arrays

  return (
    <>
      <div className="container mx-auto mt-10  ">
        {peroidType === 'monthly' && shapeType === 'vertical' && (
          <>
            <div className={` table-wrapper   h-[600px] w-[75vw]   overflow-auto  `}>
              <table>
                <thead>
                  <tr className={`bg-gray-500  text-white`}>
                    <th className={`kado bg-gray-500 `}>時間</th>
                    {[...headersByDays].map(obj => {
                      const {date, jsx} = obj
                      return (
                        <th key={date} className={`h-10 `}>
                          <div className={`text-center text-base`}>{jsx}</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className={`kado bg-gray-500  text-white`}>
                      {[...firstColumns].map(obj => {
                        const {interval, jsx} = obj
                        return jsx
                      })}
                    </th>
                    {[...contentsByDays].map(obj => {
                      const {date, jsx} = obj
                      return (
                        <td key={date.toString()}>
                          <VerticalDate
                            {...{
                              style: {},
                              date,
                              days,
                              currentMonth,
                              content: jsx,
                            }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {peroidType === 'monthly' && shapeType === 'box' && (
          <div className={`p-4`}>
            <div className={` flex w-full flex-wrap `}>
              {daysOfWeek.map(day => {
                return (
                  <div key={day} style={{width: `${100 / 7}%`}} className={`border-2 bg-gray-200 text-center`}>
                    {day}
                  </div>
                )
              })}
            </div>
            <div className={` flex flex-wrap  `}>
              {[...contentsByDays].map((obj, idx) => {
                const {date, jsx} = obj ?? {}
                return <BoxDate key={idx} {...{date, days, currentMonth, content: jsx}} />
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
