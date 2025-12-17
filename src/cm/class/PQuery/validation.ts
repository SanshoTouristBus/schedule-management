// ページングパラメータのバリデーション定数と関数

import {paginationPrefix} from 'src/non-common/searchParamStr'

export const PAGINATION_CONSTANTS = {
  PREFIX: paginationPrefix,
  MAX_TAKE: 500,
  MIN_PAGE: 1,
  MIN_TAKE: 1,
  MIN_SKIP: 0,
} as const

export interface PaginationValidationResult {
  isValid: boolean
  errors: string[]
  sanitized: {
    page: number
    take: number
    skip: number
  }
}

/**
 * ページングパラメータをバリデーションし、サニタイズする
 * takeとskipは計算値として扱うため、整合性チェックのみ行う
 */
export function validatePaginationParams(
  page: number,
  take: number,
  skip: number,
  maxTake: number = PAGINATION_CONSTANTS.MAX_TAKE,
  defaultTake: number = 30
): PaginationValidationResult {
  const errors: string[] = []
  let sanitizedPage = page
  let sanitizedTake = take
  let sanitizedSkip = skip

  // pageのNaNチェックとデフォルト値設定
  if (isNaN(page) || page === null || page === undefined) {
    sanitizedPage = PAGINATION_CONSTANTS.MIN_PAGE
    errors.push(`Invalid page value: ${page}, using default: ${PAGINATION_CONSTANTS.MIN_PAGE}`)
  }

  // takeのNaNチェック（計算値だが、念のため）
  if (isNaN(take) || take === null || take === undefined) {
    sanitizedTake = defaultTake
    errors.push(`Invalid take value: ${take}, using default: ${defaultTake}`)
  }

  // skipのNaNチェック（計算値だが、念のため）
  if (isNaN(skip) || skip === null || skip === undefined) {
    sanitizedSkip = PAGINATION_CONSTANTS.MIN_SKIP
    errors.push(`Invalid skip value: ${skip}, using default: ${PAGINATION_CONSTANTS.MIN_SKIP}`)
  }

  // pageの最小値チェック
  if (sanitizedPage < PAGINATION_CONSTANTS.MIN_PAGE) {
    errors.push(`Page value ${sanitizedPage} is less than minimum ${PAGINATION_CONSTANTS.MIN_PAGE}`)
    sanitizedPage = PAGINATION_CONSTANTS.MIN_PAGE
  }

  // takeの範囲チェック（countPerPageから計算される値の検証）
  if (sanitizedTake < PAGINATION_CONSTANTS.MIN_TAKE) {
    errors.push(`Take value ${sanitizedTake} is less than minimum ${PAGINATION_CONSTANTS.MIN_TAKE}`)
    sanitizedTake = PAGINATION_CONSTANTS.MIN_TAKE
  }

  if (sanitizedTake > maxTake) {
    errors.push(`Take value ${sanitizedTake} exceeds maximum ${maxTake}`)
    sanitizedTake = maxTake
  }

  // skipの最小値チェック
  if (sanitizedSkip < PAGINATION_CONSTANTS.MIN_SKIP) {
    errors.push(`Skip value ${sanitizedSkip} is less than minimum ${PAGINATION_CONSTANTS.MIN_SKIP}`)
    sanitizedSkip = PAGINATION_CONSTANTS.MIN_SKIP
  }

  // 整合性チェック: skip = (page - 1) * take の関係を検証
  const expectedSkip = (sanitizedPage - 1) * sanitizedTake
  if (sanitizedSkip !== expectedSkip) {
    errors.push(
      `Skip value ${sanitizedSkip} does not match expected value ${expectedSkip} (page: ${sanitizedPage}, take: ${sanitizedTake})`
    )
    sanitizedSkip = expectedSkip
  }

  // エラーがある場合はログ出力（開発環境のみ）
  if (errors.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Pagination validation errors:', errors)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      page: sanitizedPage,
      take: sanitizedTake,
      skip: sanitizedSkip,
    },
  }
}
