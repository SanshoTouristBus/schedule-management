import React, {useMemo} from 'react'

type IPadLayoutProps = {
  children: React.ReactNode
  variant?: 'normal' | 'pro'
}

const IPadLayout = React.memo(({children, variant = 'normal'}: IPadLayoutProps) => {
  const dimensions = useMemo(() => {
    const configs = {
      normal: {width: 1024, height: 768},
      pro: {width: 1366, height: 1024},
    }
    return configs[variant]
  }, [variant])

  const containerStyle = useMemo(
    () => ({
      ...dimensions,
      overflow: 'auto' as const,
      margin: 'auto',
    }),
    [dimensions]
  )

  return (
    <div style={containerStyle}>
      <div className="border-2">
        <div>{children}</div>
      </div>
    </div>
  )
})

IPadLayout.displayName = 'IPadLayout'

export default IPadLayout
