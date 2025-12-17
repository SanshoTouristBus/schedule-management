const DataCountViewer = ({from, to, totalCount}) => {
  return (
    <div className={`row-stack    text-responsive items-center gap-0.5 text-sm`}>
      <span>
        {from} 〜 {to}
      </span>
      <span> / </span>
      <span>{totalCount}</span>
      <span>件</span>
    </div>
  )
}

export default DataCountViewer
