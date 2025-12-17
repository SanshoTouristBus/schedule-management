// /**
//  * @deprecated このクラスは非推奨です。
//  * TBMアプリでは @app/(apps)/tbm/(class)/TimeHandler を使用してください。
//  * 他のアプリケーションでも可能な限り TimeHandler への移行を推奨します。
//  */
// export class Time {
//   static str = {
//     /**
//      * 時間文字列間の時間差を分単位で計算する
//      * 終了時間が開始時間より小さい場合は、終了時間を翌日として計算する
//      * @param startTime 開始時間 (例: "08:00", "15:30")
//      * @param endTime 終了時間 (例: "17:00", "00:30")
//      * @returns 時間差（分）
//      * @example
//      * calcMinDiff("08:00", "17:00") // 540分 (9時間)
//      * calcMinDiff("08:00", "00:30") // 990分 (16時間30分) ※翌日の00:30として計算
//      * calcMinDiff("23:00", "01:00") // 120分 (2時間) ※翌日の01:00として計算
//      */
//     calcMinDiff(startTime: string, endTime: string): number {
//       if (!startTime || !endTime) return 0

//       const startMinutes = Time.str.strToMins(startTime)
//       const endMinutes = Time.str.strToMins(endTime)

//       let diff = endMinutes - startMinutes

//       // 終了時間が開始時間より小さい場合は翌日とみなして24時間を加算
//       if (diff < 0) {
//         diff += 24 * 60 // 1440分（24時間）を加算
//       }

//       return diff
//     },
//     /**
//      * 時間文字列を分単位に変換する
//      * @param timeString 時間文字列 (例: "12:00", "15:30")
//      * @returns 分単位の時間
//      */
//     strToMins(timeString: string): number {
//       if (!timeString) return 0

//       const [hours, minutes] = timeString.split(':').map(Number)
//       return hours * 60 + minutes
//     },
//   }

//   static int = {
//     /**
//      * 分を時間文字列に変換する
//      * @param minutes 分単位の時間
//      * @returns 時間文字列 (例: "12:00", "15:30")
//      */
//     minsToStr(minutes: number): string {
//       if (minutes === 0) return '00:00'

//       const isNegative = minutes < 0
//       const absMinutes = Math.abs(minutes)

//       const hours = Math.floor(absMinutes / 60)
//       const mins = absMinutes % 60

//       const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
//       return isNegative ? `-${timeStr}` : timeStr
//     },
//   }
// }
