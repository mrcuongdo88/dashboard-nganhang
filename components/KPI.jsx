export default function KPI({ applications }) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <p className="text-slate-500 text-sm">
          Tổng hồ sơ
        </p>

        <h2 className="text-4xl font-bold mt-3 text-slate-800">
          {applications.length}
        </h2>

      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <p className="text-slate-500 text-sm">
          Đang xử lý
        </p>

        <h2 className="text-4xl font-bold mt-3 text-slate-800">

          {
            applications.filter(
              item => item.progress < 100
            ).length
          }

        </h2>

      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <p className="text-slate-500 text-sm">
          Hoàn thành
        </p>

        <h2 className="text-4xl font-bold mt-3 text-slate-800">

          {
            applications.filter(
              item => item.progress === 100
            ).length
          }

        </h2>

      </div>

    </div>
  )
}