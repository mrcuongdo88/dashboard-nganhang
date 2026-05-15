export function getStatusColor(status) {

  switch (status) {

    case 'Đang thẩm định':
      return 'bg-amber-100 text-amber-700'

    case 'Chờ bổ sung':
      return 'bg-red-100 text-red-700'

    case 'Đã tiếp nhận':
      return 'bg-blue-100 text-blue-700'

    case 'Hoàn thành':
      return 'bg-green-100 text-green-700'

    default:
      return 'bg-slate-100 text-slate-700'
  }
}