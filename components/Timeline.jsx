export default function Timeline({ applications }) {

  return (

    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <h3 className="text-2xl font-semibold text-slate-800 mb-5">
        Activity Timeline
      </h3>

      <div className="space-y-4">

        {applications.slice(0, 5).map(item => (

          <div
            key={item.id}
            className="flex gap-4 items-start"
          >

            <div className="w-3 h-3 rounded-full bg-slate-800 mt-2" />

            <div>

              <p className="font-semibold text-slate-800">
                {item.bank}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {item.status}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}