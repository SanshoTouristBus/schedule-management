import React from 'react'
import {Text, View, StyleSheet} from '@react-pdf/renderer'

import {Style} from '@react-pdf/types'
import {anyObject} from '@cm/types/utility-types'

const borderStyles: Style = {
  borderStyle: 'solid',
  borderColor: 'black',
  borderWidth: 2,
}
export const styles = StyleSheet.create({
  document: {
    fontFamily: 'Nasu-Regular',
  },
  page: {
    padding: 15,
  },
  table: {
    display: 'flex',
    width: 'auto',
    ...borderStyles,
    borderRight: 0,
    borderBottom: 0,
    // borderLeft: 1,
    // borderTopWidth: 1,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    ...borderStyles,
    // borderRightWidth: 1,
    // borderBottomWidth: 1,
    borderLeft: 0,
    borderTop: 0,
  },
  tableCell: {
    margin: 'auto',
    padding: '2px 4px',
    // fontSize: 12,
  },
})

type myComponentProps = {
  style?: Style | Style[] | undefined

  className?: string
  children?: any
} & anyObject
export const ColStack = (props: myComponentProps) => {
  const {style, children, ...restProps} = props

  return (
    <View style={{display: 'flex', flexDirection: 'column', ...style}} {...restProps}>
      {children}
    </View>
  )
}
export const RowStack = (props: myComponentProps) => {
  const {style, children, ...restProps} = props
  return (
    <View style={{display: 'flex', flexDirection: 'row', ...style}} {...restProps}>
      {children}
    </View>
  )
}
export const P = (props: myComponentProps) => {
  const {style, children, ...restProps} = props
  return (
    <View>
      <Text {...restProps} style={{...restProps.style}}>
        {children}
      </Text>
    </View>
  )
}

export const Table = (props: myComponentProps) => {
  const {style, children, ...restProps} = props
  return <View style={{...styles.table, ...style}}>{children}</View>
}

export const Tr = (props: myComponentProps) => {
  const {style, children, ...restProps} = props
  return (
    <View {...restProps} style={{...styles.tableRow, ...style}}>
      {children}
    </View>
  )
}

export const Td = (props: myComponentProps) => {
  const {children, colSpan, ...restProps} = props
  const baseColWidth = 25 // single column width as a percentage
  const width = `${baseColWidth * (colSpan || 1)}%` // calculate new width based on colSpan

  return (
    <View
      {...restProps}
      style={{
        padding: '0 5px',
        width,

        textAlign: `center`,

        ...styles.tableCol,
        ...restProps.style,
      }}
    >
      <Text style={{margin: `auto 0`}}>{children}</Text>
    </View>
  )
}

export const grayStyle = {backgroundColor: 'darkgray'}
export const leftRightStyle = {
  width: '50%',
  margin: 'auto',
  borderColor: 'black',
  borderWidth: 1,
  borderLeftWidth: 0,
  height: '100%',
}

export const BorderLessTd = props => {
  const {style, ...restProps} = props

  return <Td style={{...style, border: 0}} {...restProps} />
}
