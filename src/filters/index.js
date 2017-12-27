import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDateObj', (dateObj) => {
  return moment(dateObj).format('dddd, MMMM D')
})
