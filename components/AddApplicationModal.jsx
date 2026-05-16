import { useState } from 'react'

export default function AddApplicationModal({
  showModal,
  setShowModal,
  addApplication
}) {

  const [formData, setFormData] = useState({
    bank: '',
    fileType: '',
    amount: '',
    document: null
  })

  if (!showModal) return null

  function handleSubmit() {

    if (
      !formData.bank ||
      !formData.fileType
    ) return

    addApplication(formData)

    setFormData({
      bank: '',
      fileType: '',
      amount: '',
      document: null
    })
  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Thêm hồ sơ mới
          </h2>

          <p className="text-slate-500 mt-2">
            Tạo hồ sơ tín dụng doanh nghiệp
          </p>

        </div>

        <input
          type="text"
          placeholder="Tên ngân hàng"
          value={formData.bank}
          onChange={(e) =>
            setFormData({
              ...formData,
              bank: e.target.value
            })
          }
          className="w-full px-4 py-3 rounded-2xl border border-slate-200"
        />

        <input
          type="text"
          placeholder="Loại hồ sơ"
          value={formData.fileType}
          onChange={(e) =>
            setFormData({
              ...formData,
              fileType: e.target.value
            })
          }
          className="w-full px-4 py-3 rounded-2xl border border-slate-200"
        />

        <input
          type="text"
          placeholder="Giá trị khoản vay"
          value={formData.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value
            })
          }
          
          className="w-full px-4 py-3 rounded-2xl border border-slate-200"
        />
<input
  type="file"
  accept=".pdf"
  onChange={(e) =>
    setSelectedFile(
      e.target.files[0]
    )
  }
  className="w-full px-4 py-3 rounded-2xl border border-slate-200"
/>
        <div>

          <label className="block text-sm font-medium text-slate-600 mb-2">
            Upload hồ sơ PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFormData({
                ...formData,
                document: e.target.files[0]
              })
            }
            className="w-full"
          />

        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-3 rounded-2xl bg-slate-200"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-3 rounded-2xl bg-slate-800 text-white"
          >
            Lưu hồ sơ
          </button>

        </div>

      </div>

    </div>
  )
}