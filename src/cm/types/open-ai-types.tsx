import {anyObject} from '@cm/types/utility-types'

export type aiThreadMessage = {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  show?: boolean
  sendToOpenAi?: boolean
} & anyObject

export type fineTuneDataset = {
  messages: aiThreadMessage[]
}
export type msgQuestinPair = {question: aiThreadMessage; msg: aiThreadMessage}
