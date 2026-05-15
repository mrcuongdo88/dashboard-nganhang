import { getStatusColor } from '../utils/helpers'
<th className="text-left px-6 py-4">
  Tài liệu
</th>
export default function ApplicationTable({
  applications,
  deleteApplication,
  updateProgress,
  updateStatus
}) {

  return (

    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">

            <tr>

              <th className="text-left px-6 py-4">
                Ngân hàng
              </th>

              <th className="text-left px-6 py-4">
                Hồ sơ
              </th>

              <th className="text-left px-6 py-4">
                Giá trị
              </th>

              <th className="text-left px-6 py-4">
                Tiến độ
              </th>

              <th className="text-left px-6 py-4">
                Trạng thái
              </th>

              <th className="text-left px-6 py-4">
                Hành động
              </th>

            </tr>

          </thead>

          <tbody>

            {applications.map(item => (

              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                <td className="px-6 py-5 font-semibold">
                  {item.bank}
                </td>

                <td className="px-6 py-5">
                  {item.fileType}
                </td>

                <td className="px-6 py-5">
                  {item.amount}
                </td>
<td className="px-6 py-5">

  {item.document ? (

    <span className="text-blue-600 text-sm font-medium">
      📄 {item.document}
    </span>

  ) : (

    <span className="text-slate-400 text-sm">
      Chưa upload
    </span>

  )}

</td>
                <td className="px-6 py-5 min-w-[240px]">

                  <div className="space-y-3">

                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">

                      <div
                        className="bg-slate-800 h-full"
                        style={{
                          width: `${item.progress}%`
                        }}
                      />

                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.progress}
                      onChange={(e) =>
                        updateProgress(
                          item.id,
                          e.target.value
                        )
                      }
                      className="w-full"
                    />

                  </div>

                </td>

                <td className="px-6 py-5">

                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-0 ${getStatusColor(item.status)}`}
                  >

                    <option>Đã tiếp nhận</option>
                    <option>Đang thẩm định</option>
                    <option>Chờ bổ sung</option>
                    <option>Hoàn thành</option>

                  </select>

                </td>

                <td className="px-6 py-5">

                  <button
                    onClick={() =>
                      deleteApplication(item.id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600"
                  >
                    Xóa
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}