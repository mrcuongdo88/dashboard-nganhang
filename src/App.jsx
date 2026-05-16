import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { supabase } from './lib/supabase'
import { v4 as uuidv4 } from 'uuid'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const bankDirectory = [

  {
    keywords: [
      'acb',
      'asia commercial'
    ],

    name: 'ACB',

    logo:
      'https://logo.clearbit.com/acb.com.vn'
  },

  {
    keywords: [
      'mb',
      'mbbank'
    ],

    name: 'MBBank',

    logo:
      'https://logo.clearbit.com/mbbank.com.vn'
  },

  {
    keywords: [
      'msb'
    ],

    name: 'MSB',

    logo:
      'https://logo.clearbit.com/msb.com.vn'
  },

  {
    keywords: [
      'shb'
    ],

    name: 'SHB',

    logo:
      'https://logo.clearbit.com/shb.com.vn'
  },

  {
    keywords: [
      'vietcombank',
      'vcb'
    ],

    name: 'Vietcombank',

    logo:
      'https://logo.clearbit.com/vietcombank.com.vn'
  },

  {
    keywords: [
      'bidv'
    ],

    name: 'BIDV',

    logo:
      'https://logo.clearbit.com/bidv.com.vn'
  },

  {
    keywords: [
      'techcombank',
      'tcb'
    ],

    name: 'Techcombank',

    logo:
      'https://logo.clearbit.com/techcombank.com.vn'
  }
]

export default function App() {

  const [applications, setApplications] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [showModal, setShowModal] =
    useState(false)

  const [selectedFile, setSelectedFile] =
    useState(null)

  const [selectedTimeline, setSelectedTimeline] =
    useState([])

  const [showTimeline, setShowTimeline] =
    useState(false)

  const [timelineNote, setTimelineNote] =
    useState('')

  const [selectedApplicationId,
    setSelectedApplicationId] =
    useState(null)

  const [newApplication, setNewApplication] =
    useState({
      bank: '',
      fileType: '',
      amount: '',
      submissionDate: '',
      nextAction: '',
      nextFollowupDate: ''
    })

  useEffect(() => {

    fetchApplications()

  }, [])

  async function fetchApplications() {

    const { data, error } =
      await supabase
        .from('applications')
        .select()
        .order('submission_date', {
          ascending: false
        })

    if (!error) {

      setApplications(data || [])
    }
  }

  function detectBank(bankName) {

    if (!bankName) return null

    const normalized =
      bankName
        .toLowerCase()
        .trim()

    return bankDirectory.find(
      bank =>

        bank.keywords.some(
          keyword =>

            normalized.includes(
              keyword
            )
        )
    )
  }

  const bankSuggestions =

    bankDirectory.filter(
      bank =>

        bank.name
          .toLowerCase()
          .includes(
            newApplication.bank
              .toLowerCase()
          )
    )

  async function addTimeline(
    applicationId,
    action
  ) {

    await supabase
      .from('application_timeline')
      .insert([
        {
          application_id:
            applicationId,

          action
        }
      ])
  }

  async function fetchTimeline(id) {

    const { data } =
      await supabase
        .from('application_timeline')
        .select()
        .eq('application_id', id)
        .order('created_at', {
          ascending: false
        })

    setSelectedTimeline(data || [])

    setSelectedApplicationId(id)

    setShowTimeline(true)
  }

  async function addNote() {

    if (
      !timelineNote ||
      !selectedApplicationId
    ) return

    await addTimeline(
      selectedApplicationId,
      timelineNote
    )

    setTimelineNote('')

    fetchTimeline(
      selectedApplicationId
    )
  }

  async function deleteApplication(id) {

    const { error } =
      await supabase
        .from('applications')
        .delete()
        .eq('id', Number(id))

    if (!error) {

      fetchApplications()
    }
  }

  function calculateAging(date) {

    if (!date) return 0

    const today =
      new Date()

    const submissionDate =
      new Date(date)

    const diffTime =
      today - submissionDate

    const diffDays =
      Math.floor(
        diffTime /
        (1000 * 60 * 60 * 24)
      )

    return diffDays
  }

  function getAgingColor(days) {

    if (days > 14) {

      return 'bg-red-100 text-red-700'
    }

    if (days > 7) {

      return 'bg-amber-100 text-amber-700'
    }

    return 'bg-green-100 text-green-700'
  }

  function formatCurrency(value) {

    if (!value) return '-'

    const number =
      parseFloat(
        value.toString()
          .replace(/[^\d]/g, '')
      )

    return number.toLocaleString(
      'vi-VN'
    )
  }

  function formatInputCurrency(value) {

    const number =
      value.replace(/[^\d]/g, '')

    return number.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    )
  }

  async function addApplication() {

    if (
      !newApplication.bank ||
      !newApplication.fileType
    ) return

    let documentUrl = ''
    let documentName = ''

    if (selectedFile) {

      const fileExt =
        selectedFile.name
          .split('.')
          .pop()

      const fileName =
        `${uuidv4()}.${fileExt}`

      const { error: uploadError } =
        await supabase.storage
          .from('documents')
          .upload(
            fileName,
            selectedFile
          )

      if (!uploadError) {

        const { data } =
          supabase.storage
            .from('documents')
            .getPublicUrl(fileName)

        documentUrl =
          data.publicUrl

        documentName =
          selectedFile.name
      }
    }

    const { data, error } =
      await supabase
        .from('applications')
        .insert([
          {
            bank:
              newApplication.bank,

            file_type:
              newApplication.fileType,

            amount:
              newApplication.amount
                .replace(/[^\d]/g, ''),

            submission_date:
              newApplication.submissionDate,

            next_action:
              newApplication.nextAction,

            next_followup_date:
              newApplication.nextFollowupDate,

            progress: 10,

            status:
              'Đã tiếp nhận',

            document_url:
              documentUrl,

            document_name:
              documentName
          }
        ])
        .select()

    if (!error) {

      await addTimeline(
        data[0].id,
        '📄 Hồ sơ được tạo'
      )

      fetchApplications()

      setNewApplication({
        bank: '',
        fileType: '',
        amount: '',
        submissionDate: '',
        nextAction: '',
        nextFollowupDate: ''
      })

      setSelectedFile(null)

      setShowModal(false)
    }
  }

  async function updateProgress(id, value) {

    const { error } =
      await supabase
        .from('applications')
        .update({
          progress: parseInt(value)
        })
        .eq('id', Number(id))

    if (!error) {

      await addTimeline(
        id,
        `📊 Tiến độ cập nhật ${value}%`
      )

      fetchApplications()
    }
  }

  async function updateStatus(id, value) {

    const { error } =
      await supabase
        .from('applications')
        .update({
          status: value
        })
        .eq('id', Number(id))

    if (!error) {

      await addTimeline(
        id,
        `🔄 Status chuyển sang ${value}`
      )

      fetchApplications()
    }
  }

  function exportToExcel() {

    const worksheet =
      XLSX.utils.json_to_sheet(applications)

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Applications'
    )

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      )

    const fileData =
      new Blob(
        [excelBuffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      )

    saveAs(
      fileData,
      'DanhSachHoSo.xlsx'
    )
  }

  function getStatusColor(status) {

    switch (status) {

      case 'Đang thẩm định':
        return 'bg-amber-100 text-amber-700'

      case 'Chờ bổ sung':
        return 'bg-red-100 text-red-700'

      case 'Hoàn thành':
        return 'bg-green-100 text-green-700'

      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  function isFollowupOverdue(date) {

    if (!date) return false

    return (
      new Date(date) <
      new Date()
    )
  }

  const filteredApplications =
    applications.filter(item => {

      const bank =
        item.bank || ''

      return bank
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    })

  const processingCount =
    applications.filter(item => {

      const progress =
        item.progress || 0

      return progress < 100

    }).length

  const completedCount =
    applications.filter(item => {

      const progress =
        item.progress || 0

      return progress === 100

    }).length

  const overdueCount =
    applications.filter(item => {

      return (
        calculateAging(
          item.submission_date
        ) > 7
      )

    }).length

  const followupOverdueCount =
    applications.filter(item =>

      isFollowupOverdue(
        item.next_followup_date
      )
    ).length

  const totalAmount =
    applications.reduce(
      (sum, item) => {

        const value =
          parseFloat(
            item.amount
          ) || 0

        return sum + value

      },
      0
    )

  const statusData = [

    {
      name: 'Đã tiếp nhận',
      value:
        applications.filter(
          item =>
            item.status ===
            'Đã tiếp nhận'
        ).length
    },

    {
      name: 'Đang thẩm định',
      value:
        applications.filter(
          item =>
            item.status ===
            'Đang thẩm định'
        ).length
    },

    {
      name: 'Chờ bổ sung',
      value:
        applications.filter(
          item =>
            item.status ===
            'Chờ bổ sung'
        ).length
    },

    {
      name: 'Hoàn thành',
      value:
        applications.filter(
          item =>
            item.status ===
            'Hoàn thành'
        ).length
    }
  ]

  const COLORS = [
    '#3b82f6',
    '#f59e0b',
    '#ef4444',
    '#22c55e'
  ]

  const bankData = applications.map(
    item => ({
      bank: item.bank,
      progress:
        item.progress || 0
    })
  )

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Banking LOS Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Credit Workflow Management System
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-green-700"
            >
              Export Excel
            </button>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-slate-700"
            >
              + Thêm hồ sơ
            </button>

          </div>

        </div>

        {/* KPI */}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">

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
              {processingCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Hoàn thành
            </p>

            <h2 className="text-4xl font-bold mt-3 text-slate-800">
              {completedCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Hồ sơ overdue
            </p>

            <h2 className="text-4xl font-bold mt-3 text-red-600">
              {overdueCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Follow-up overdue
            </p>

            <h2 className="text-4xl font-bold mt-3 text-amber-600">
              {followupOverdueCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Tổng pipeline
            </p>

            <h2 className="text-xl font-bold mt-3 text-slate-800">
              {formatCurrency(totalAmount)} VNĐ
            </h2>
          </div>

        </div>

        {/* EXECUTIVE DASHBOARD */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-6">
              Trạng thái hồ sơ
            </h2>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >

                    {statusData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-6">
              Tiến độ theo ngân hàng
            </h2>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={bankData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="bank" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="progress"
                    fill="#0f172a"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}