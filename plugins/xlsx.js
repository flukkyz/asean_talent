import * as XLSX from 'xlsx'
export default ({ app }, inject) => {
  inject('xlsx', XLSX)
}
