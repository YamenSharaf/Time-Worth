import Vue from 'vue'
import Vuex from 'vuex'
import db from '../db'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userProjects: []
  },
  getters: {
    getUserProjects (state) {
      return state.userProjects
    }
  },
  actions: {
    fetchUserProjects ({commit}) {
      db.collection('projects').get()
      .then((data) => {
        data.forEach(project => {
          const projectData = {
            'id': project.id,
            'title': project.data().title,
            'description': project.data().description
          }
          commit('setUserProjects', projectData)
        })
      })
    },
    fetchProjectData ({commit}, docId) {
      return db.collection('projects').doc(docId).get()
    },
    addNewProject ({commit}, payload) {
      return db.collection('projects').add(payload)
    },
    deleteProject ({commit}, payload) {
      return db.collection('projects').doc(payload.id).delete()
    },
    addLog ({commit}, payload) {
      let currentLog = []
      // Get current log
      return db.collection('projects').doc(payload.id).get()
      .then((doc) => {
        currentLog = doc.data().dayLog
        currentLog.push(payload.dayLog)
        // update data
        db.collection('projects').doc(payload.id).update({
          'dayLog': currentLog
        })
        .then(() => {
          console.log('success')
        })
      })
    },
    removeLog ({commit}, payload) {
      let currentUsedLog = []
      // Get current log
      return db.collection('projects').doc(payload.id).get()
      .then((doc) => {
        currentUsedLog = doc.data().dayLog
        console.log('before', currentUsedLog)
        // remove log with key
        console.log('key', payload.key)
        currentUsedLog.splice(payload.key, 1)
        console.log('after', currentUsedLog)
        db.collection('projects').doc(payload.id).update({
          'dayLog': currentUsedLog
        })
      })
    }
  },
  mutations: {
    setUserProjects (state, payload) {
      state.userProjects.push(payload)
    },
    clearUserProjects (state) {
      state.userProjects = []
    }
  }
})

export default store
