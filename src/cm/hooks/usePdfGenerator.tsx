import React from 'react'
import {Text, View, StyleSheet} from '@react-pdf/renderer'

import {anyObject} from '@cm/types/utility-types'
import {Style} from '@react-pdf/types'

import {PDFDownloadLink, PDFViewer, Font} from '@react-pdf/renderer'

export default function usePdfGenerator({Document, fileName = 'sample.pdf'}) {
  const PDF_Document = () => {
    Font.register({
      family: 'Nasu-Regular',
      src: '/fonts/Nasu-Regular.ttf',
      fontWeight: `normal`,
    })
    Font.register({
      family: 'Nasu-Bold',
      src: '/fonts/Nasu-Bold.ttf',
      fontWeight: `bold`,
    })
    return Document
  }

  const DownLoadLink = () => {
    return (
      <PDFDownloadLink document={<PDF_Document />} fileName={fileName} className="t-link">
        PDFダウンロード
      </PDFDownloadLink>
    )
  }

  const PdfDisplay = () => {
    return (
      <PDFViewer style={{height: '80vh', minWidth: `80vw`}}>
        <PDF_Document />
      </PDFViewer>
    )
  }

  return {DownLoadLink, PdfDisplay}
}

export const borderStyles: Style = {
  borderStyle: 'solid',
  borderColor: 'gray',
  borderWidth: 1,
}
export const ReactPdfStyles = StyleSheet.create({
  document: {
    fontFamily: 'Nasu-Regular',
    fontSize: 10,
    color: 'black',
  },
  page: {},

  table: {
    width: '100%',
    ...borderStyles,
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    ...borderStyles,

    borderLeft: 0,
    borderTop: 0,
  },
  tableCell: {
    margin: 'auto',
    padding: '2px 4px',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
})

type myComponentProps = {
  style?: Style | Style[] | undefined

  className?: string
  children?: any
} & anyObject

export const Section = (props: myComponentProps) => {
  const {style, children, ...restProps} = props

  return (
    <View style={{marginBottom: 20, ...style}} {...restProps}>
      {children}
    </View>
  )
}

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
  return (
    <View
      style={{
        border: `1px solid gray`,
        margin: `auto`,
        borderRight: 0,
        borderBottom: 0,
        ...style,
      }}
    >
      {children}
    </View>
  )
}

export const Tr = (props: myComponentProps) => {
  const {style, children, ...restProps} = props
  return (
    <RowStack
      {...restProps}
      style={{
        // borderBottom: `1px solid gray`,
        ...style,
      }}
    >
      {children}
    </RowStack>
  )
}

export const Td = (props: myComponentProps) => {
  const {children, colSpan, style, ...restProps} = props

  return (
    <View
      {...restProps}
      style={{
        padding: 3,
        borderTop: `1px solid gray`,
        borderRight: `1px solid gray`,

        ...style,
      }}
    >
      {children}
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
