<template>
  <div v-loading="!projectData.title" class="container">
    <div class="row my-5">
      <div class="col-12 d-flex flex-center">
        <h1 class="text-gray-dark text-center">
          {{projectData.title}}
        </h1>
      </div>
      <div class="col-12 d-flex flex-center">
        <h5 class="font-regular text-muted text-center">
          {{projectData.description}}
        </h5>
      </div>
    </div>
    <div class="row page-wrapper my-5">
      <div class="col-md-6 d-flex justify-content-center align-items-baseline align-content-start">
        <div class="card text-white bg-primary mb-3 w-75">
          <div class="card-header h5">Log today's work</div>
          <div class="card-body">
            <el-form label-position="top" :model="logDayForm">
              <el-form-item>
                <div slot="label" class="text-white d-block">
                  Enter a day
                </div>
                <el-date-picker
                    v-model="logDayForm.date"
                    type="date"
                    placeholder="Pick a day"
                    :picker-options="dateOptions">
                  </el-date-picker>
              </el-form-item>
              <el-form-item>
                <div slot="label" class="text-white d-block">
                  Time of working minutes
                </div>
                <el-input-number v-model="logDayForm.minutesCount" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item>
                <div slot="label" class="text-white d-block">
                  Time of working hours
                  <br>
                </div>
                <el-input-number v-model="logDayForm.hoursCount" :min="0" :max="12"></el-input-number>
              </el-form-item>
              <el-form-item>
                <div slot="label" class="text-white d-block">
                  Note
                  <br>
                </div>
                <el-input v-model="logDayForm.note" type="textarea"
                :rows="2" placeholder="Enter a note" auto-complete="off"></el-input>
              </el-form-item>
              <div class="logday-checks">
                <el-checkbox v-model="logDayForm.periodStart" label="Starting point" border></el-checkbox>
                <el-checkbox v-model="logDayForm.periodEnd" label="Ending point" border></el-checkbox>
              </div>
              <el-form-item class="d-flex justify-content-end mt-3">
                <el-button @click="handleLogDay">Log day</el-button>
              </el-form-item>
            </el-form>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 d-flex justify-content-center align-items-baseline align-content-start">
        <div class="row">
          <div class="col-12">
            <table class="table table-bordered table-dark">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Minutes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="log.length === 0">
                  <th colspan="2" class="text-center text-muted">
                    No entries yet
                  </th>
                </tr>
                <tr 
                  v-for="(day, index) in projectData.dayLog" 
                  :key="index" 
                  :class="{
                    'start-day-marker': day.periodStart,
                    'end-day-marker': day.periodEnd
                    }">
                  <th scope="row" class="d-flex justify-content-between align-center">
                    <div>
                      {{day.date | formatDateObj}}
                      <span v-show="day.note" class="text-white d-block text-muted font-regular">
                        {{day.note}}
                      </span>
                    </div>
                    <span @click="handleRemoveEntry(index)" class="ml-auto text-danger cursor-pointer">
                      X
                    </span>
                  </th>
                  <td> {{day.minutesCount}} </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-12">
            <div class="card bg-primary text-white p-5 d-flex flex-center">
              <h1 class="h1 text-center">
                Total Minutes: {{totalTime}}
              </h1>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectData: {},
      log: [],
      totalHoursCount: 0,
      logDayForm: {
        date: new Date(),
        hoursCount: null,
        minutesCount: null,
        note: ``,
        periodStart: false,
        periodEnd: false
      },
      dateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: 'Today',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: 'Yesterday',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: 'A week ago',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  computed: {
    projectId () {
      return this.$route.params.id
    },
    watchHours () {
      return this.logDayForm.hoursCount
    },
    watchMinutes () {
      return this.logDayForm.minutesCount
    },
    totalTime () {
      let total = 0
      this.log.map((log) => {
        total += log.minutesCount
      })
      return total
    },
    periodTime () {
      let total = 0
      return total
    }
  },
  watch: {
    watchHours () {
      this.logDayForm.minutesCount = this.logDayForm.hoursCount * 60
    },
    watchMinutes () {
      this.logDayForm.hoursCount = this.logDayForm.minutesCount / 60
    }
  },
  methods: {
    renderComponent () {
      this.$store.dispatch('fetchProjectData', this.$route.params.id)
      .then((doc) => {
        if (doc.exists) {
          this.projectData = doc.data()
          this.log = this.projectData.dayLog
        } else {
          this.$message.error(`Error: Unable to fetch doc data`)
        }
      })
    },
    handleLogDay () {
      this.$store.dispatch('addLog', {
        id: this.projectId,
        dayLog: this.logDayForm
      }).then(() => {
        this.renderComponent()
      })
    },
    handleRemoveEntry (key) {
      this.$store.dispatch('removeLog', {
        id: this.projectId,
        key: key
      })
      .then(() => {
        this.renderComponent()
      })
    }
  },
  mounted () {
    this.renderComponent()
  }
}
</script>

<style lang="scss">
@import '../sass/base/_vars.scss';

.start-day-marker {
  border-top: 5px solid $color-secondary !important;
}
.end-day-marker {
  border-bottom: 5px solid $color-secondary !important;
}
.logday-checks {
  .el-checkbox__label {
    color: white;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: white;
  }
}
</style>
