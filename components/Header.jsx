export default function Header({ onOpenModal }) {

  return (

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div>

        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard Quản Lý Hồ Sơ
        </h1>

        <p className="text-slate-500 mt-2">
          CRM quản lý pipeline tín dụng doanh nghiệp
        </p>

      </div>

      <button
        onClick={onOpenModal}
        className="bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-lg hover:opacity-90"
      >
        + Thêm hồ sơ
      </button>

    </div>
  )
}
<th className="text-left px-6 py-4">
  Hồ sơ PDF
</th>