import { useState, useEffect } from 'react'

import Header from './components/Header'
import KPI from './components/KPI'
import Filters from './components/Filters'
import ApplicationTable from './components/ApplicationTable'
import AddApplicationModal from './components/AddApplicationModal'
import { initialApplications } from './data/mockData'
import Timeline from './components/Timeline'
import { exportToExcel } from './utils/exportExcel'
export default function App() {

  const [applications, setApplications] = useState(() => {

    const saved = localStorage.getItem('applications')

    return saved
      ? JSON.parse(saved)
      : initialApplications
  })

  const [search, setSearch] = useState('')

  const [filterStatus, setFilterStatus] = useState('Tất cả')

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {

    localStorage.setItem(
      'applications',
      JSON.stringify(applications)
    )

  }, [applications])

  function deleteApplication(id) {

    const filtered = applications.filter(
      item => item.id !== id
    )

    setApplications(filtered)
  }
function addApplication(data) {

  const newItem = {
    id: Date.now(),
    bank: data.bank,
    fileType: data.fileType,
    amount: data.amount,
    progress: 10,
    status: 'Đã tiếp nhận',
    document: data.document
      ? data.document.name
      : null
  }

  setApplications([
    newItem,
    ...applications
  ])

  setShowModal(false)
}
  function updateProgress(id, value) {

    const updated = applications.map(item => {

      if (item.id === id) {

        return {
          ...item,
          progress: Number(value)
        }
      }

      return item
    })

    setApplications(updated)
  }

  function updateStatus(id, value) {

    const updated = applications.map(item => {

      if (item.id === id) {

        return {
          ...item,
          status: value
        }
      }

      return item
    })

    setApplications(updated)
  }

  const filteredApplications = applications.filter(item => {

    const matchSearch =
      item.bank
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchStatus =
      filterStatus === 'Tất cả'
      || item.status === filterStatus

    return matchSearch && matchStatus
  })

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        <Header
          onOpenModal={() => setShowModal(true)}
        />

        <KPI applications={applications} />

        <Filters
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <ApplicationTable
          applications={filteredApplications}
          deleteApplication={deleteApplication}
          updateProgress={updateProgress}
          updateStatus={updateStatus}
        />

      </div>
<AddApplicationModal
  showModal={showModal}
  setShowModal={setShowModal}
  addApplication={addApplication}
/><Timeline applications={applications} /><button
  onClick={() => exportToExcel(applications)}
  className="bg-green-600 text-white px-5 py-3 rounded-2xl"
>
  Export Excel
</button>
    </div>
  )
}