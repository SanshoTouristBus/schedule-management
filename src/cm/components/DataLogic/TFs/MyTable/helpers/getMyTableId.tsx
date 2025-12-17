export const getMyTableId = ({dataModelName, myTable}) => {
  return myTable?.tableId || `table-id-${dataModelName}`
}
