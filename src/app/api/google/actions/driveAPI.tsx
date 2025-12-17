'use server'
import {convert_GoogleURL_to_ID} from '@app/api/google/actions/convert_GoogleURL_to_ID'
import {getAuth} from '@app/api/auth/google/getAuth'
import {google} from 'googleapis'
import {Readable} from 'stream'

export const GoogleDrive_GeneratePdf = async (props: {spreadsheetId: string; parentFolderIds?: string[]; pdfName?: string}) => {
  const {pdfName = 'created by system', parentFolderIds = []} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)

  const auth = await getAuth()
  const drive = google.drive({version: 'v3', auth})

  const res = await drive.files.export(
    //
    {fileId: spreadsheetId, mimeType: 'application/pdf'},
    {responseType: 'arraybuffer'}
  )

  const {data, config} = res
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
  const pdfBase64 = Buffer.from(data as ArrayBuffer).toString('base64')

  if (props?.parentFolderIds?.length) {
    try {
      const uploadResponse = await drive.files.create({
        supportsAllDrives: true,
        requestBody: {
          name: `${pdfName}.pdf`,
          mimeType: 'application/pdf',
          parents: [...parentFolderIds.map(id => convert_GoogleURL_to_ID(id))], // 保存先フォルダID
        },
        media: {
          mimeType: 'application/pdf',
          body: Readable.from(Buffer.from(pdfBase64, 'base64')),
        },
        fields: 'id,name,webViewLink',
      })

      return {
        spreadsheetUrl,
        pdfData: pdfBase64,
        uploadResponse,
      }
    } catch (error) {
      console.error(error.stack) //////////
      console.error(`エラー`)
      return {
        spreadsheetUrl,
        pdfData: pdfBase64,
      }
    }
  } else {
    return {
      spreadsheetUrl,
      pdfData: pdfBase64,
    }
  }
}

export const GoogleDrive_CopyFile = async (props: {fileId: string; newName: string; parentFolderId: string}) => {
  const fileId = convert_GoogleURL_to_ID(props.fileId)

  const parentFolderId = convert_GoogleURL_to_ID(props.parentFolderId)
  const {newName} = props
  const auth = await getAuth()
  const drive = google.drive({version: 'v3', auth})

  const res = await drive.files.copy({
    fileId,
    supportsAllDrives: true,
    requestBody: {
      name: newName,
      parents: [parentFolderId],
    },
  })
  const {data, config} = res

  return data
}

export const GoogleDrive_GetFilesInFolder = async (props: {
  folderId: string
  pageSize?: number
  orderBy?: string
  q?: string
}) => {
  const folderId = convert_GoogleURL_to_ID(props.folderId)
  const {pageSize = 100, orderBy = 'modifiedTime desc', q = ''} = props

  const auth = await getAuth()
  const drive = google.drive({version: 'v3', auth})

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents ${q ? 'and ' + q : ''}`,
      pageSize: pageSize,
      orderBy: orderBy,
      fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })

    return {
      success: true,
      files: response.data.files || [],
    }
  } catch (error) {
    console.error('GoogleDriveからファイル一覧取得中にエラーが発生しました:', error)
    return {
      success: false,
      error: error.message,
      files: [],
    }
  }
}

export const GoogleDrive_DownloadCSV = async (props: {fileId: string; parentFolderId: string}) => {
  const fileId = convert_GoogleURL_to_ID(props.fileId)

  const auth = await getAuth()
  const drive = google.drive({version: 'v3', auth})

  const res = await drive.files.get({
    fileId,
    supportsAllDrives: true,
  })

  const {data, config} = res

  const file = await drive.files.get({
    fileId,
    alt: 'media',
    supportsAllDrives: true,
  })

  const csvData = file.data

  return csvData
}

export const GoogleDrive_UpsertFolder = async (props: {parentFolderId: string; folderNameToFind?: string}) => {
  const {folderNameToFind} = props
  const parentFolderId = convert_GoogleURL_to_ID(props.parentFolderId)
  const auth = await getAuth()
  const drive = google.drive({version: 'v3', auth})

  const theFolder = await drive.files.list({
    q: `name = '${folderNameToFind}' and '${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
  })

  if (theFolder.data.files?.length) {
    return theFolder.data.files[0].id
  } else {
    const res = await drive.files.create({
      requestBody: {
        name: folderNameToFind,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      },
    })
    return res.data.id
  }
}
