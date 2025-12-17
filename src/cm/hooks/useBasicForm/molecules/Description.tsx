import React from 'react'

export default function Description({col, ControlStyle, currentValue, formData, latestFormData}) {
  return (
    <div style={ControlStyle}>
      <small
        style={{
          marginTop: 5,
          width: ControlStyle.width,
          maxWidth: ControlStyle.maxWidth,
        }}
      >
        {typeof col?.form?.descriptionNoteAfter === `function`
          ? col?.form?.descriptionNoteAfter?.(currentValue, {...formData, ...latestFormData}, col)
          : col.form?.descriptionNoteAfter}
      </small>
    </div>
  )
}
