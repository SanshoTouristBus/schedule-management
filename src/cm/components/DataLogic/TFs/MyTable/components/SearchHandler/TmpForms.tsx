import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import React from 'react'

const TmpForms = React.memo((props: any) => {
  const {tripled, tampValues, settampValues} = props
  // const [values, setvalues] = useState({})

  return (
    <>
      {tripled.map((cols, i) => {
        return (
          <R_Stack key={i} className={`justify-stretch`}>
            {cols.map((col, j) => {
              return (
                <div key={j} className={`w-full lg:w-[33%]`}>
                  <div className={`mx-auto max-w-[240px] p-2`}>
                    {col.label && (
                      <label>
                        {col.label}
                        <input
                          defaultValue={tampValues[col.id] ?? ''}
                          onBlur={e => {
                            settampValues({...tampValues, [col.id]: e.target.value})
                          }}
                          className={`myFormControl`}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </R_Stack>
        )
      })}
    </>
  )
})

export default TmpForms
