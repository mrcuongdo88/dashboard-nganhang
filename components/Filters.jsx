export default function Filters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus
}) {

  return (

    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-4">

      <input
        type="text"
        placeholder="Tìm kiếm ngân hàng..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-slate-200 flex-1"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-slate-200"
      >
        <option>Tất cả</option>
        <option>Đã tiếp nhận</option>
        <option>Đang thẩm định</option>
        <option>Chờ bổ sung</option>
        <option>Hoàn thành</option>
      </select>

    </div>
  )
}