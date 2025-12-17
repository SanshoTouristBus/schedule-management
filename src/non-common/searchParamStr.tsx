export const globalSelectorPrefix = '__global__'
export const globalIds = {
  globalUserId: globalSelectorPrefix + 'userId',
  globalStoreId: globalSelectorPrefix + 'storeId',
  globalSelectedUserId: globalSelectorPrefix + 'selectedUserId',

  globalTeacherId: globalSelectorPrefix + 'teacherId',
  globalSchoolId: globalSelectorPrefix + 'schoolId',
  globalTbmBaseId: globalSelectorPrefix + 'tbmBaseId',
  tbmDriveInputUserId: 'tbmDriveInputUserId' //nonglobal

}

export const paginationPrefix = '__pg__'
export const paginationSearchParamStr = {
  getPaginationPage: (tableId: string) => paginationPrefix + tableId + '_P',
  getPaginationTake: (tableId: string) => paginationPrefix + tableId + '_T',
  getPaginationSkip: (tableId: string) => paginationPrefix + tableId + '_S',
}
