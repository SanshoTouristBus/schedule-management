// import PDFParser from 'pdf2json'

// export type page = {page: number; Width: number; Height: number; textCoordinates: textCoordinate[]}
// export type textCoordinate = {text: string; x: number; y: number}
// export const extractTextWithCoordinates = (props: {pdfPath: string; callback: (props: {pages: page[]}) => void}) => {
//   const {pdfPath, callback} = props
//   const pdfParser = new PDFParser()
//   const pages: page[] = []
//   pdfParser.on('pdfParser_dataReady', pdfData => {
//     for (let i = 0; i < pdfData.Pages.length; i++) {
//       const page = pdfData.Pages[i]
//       const {Width, Height} = page

//       const textCoordinates: textCoordinate[] = page.Texts.map(text => {
//         const {x, y, R, w} = text
//         const textStr = R.map(r => decodeURIComponent(r.T)).join('')
//         return {text: textStr, x, y}
//       })

//       pages.push({page: i, Width, Height, textCoordinates})
//     }

//     callback({pages})
//     return pages
//   })

//   pdfParser.on('pdfParser_dataError', err => console.error(err.parserError))

//   pdfParser.loadPDF(pdfPath).then(() => {
//     console.info('pdfParser.loadPDF')
//   })
// }
