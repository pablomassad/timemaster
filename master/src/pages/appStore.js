import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'fwk-q-firebase'
import { LocalStorage } from 'quasar'
import { ENVIRONMENTS } from 'src/environments'
import moment from 'moment'
// import { KillApps } from 'fwk-kill-apps'

fb.initFirebase(ENVIRONMENTS.firebase)

// setTimeout(() => {
//    KillApps.selfDestruction()
// }, 3600000)

const state = reactive({
    path: undefined,
    config: undefined,
    users: LocalStorage.getItem('TN_users'),
    years: [
        { id: 2023, name: 2023 },
        { id: 2024, name: 2024 },
        { id: 2025, name: 2025 },
        { id: 2026, name: 2026 },
        { id: 2027, name: 2027 },
        { id: 2028, name: 2028 },
        { id: 2029, name: 2029 },
        { id: 2030, name: 2030 }
    ],
    months: [
        { id: 1, name: 'enero' },
        { id: 2, name: 'febrero' },
        { id: 3, name: 'marzo' },
        { id: 4, name: 'abril' },
        { id: 5, name: 'mayo' },
        { id: 6, name: 'junio' },
        { id: 7, name: 'julio' },
        { id: 8, name: 'agosto' },
        { id: 9, name: 'setiembre' },
        { id: 10, name: 'octubre' },
        { id: 11, name: 'noviembre' },
        { id: 12, name: 'diciembre' }
    ]
})
const set = {
    users (o) {
        console.log('store set.users:', o)
        state.users = o
        LocalStorage.set('TN_users', o)
    },
    path (p) {
        console.log('store set path:', p)
        state.path = p
    },
    config (cfg) {
        console.log('store config:', cfg)
        state.config = cfg
    }
}
const actions = {
    async initApp () {
        const cfg = await fb.getDocument('settings', ENVIRONMENTS.lugar)
        set.config(cfg)
    },
    async monitorUsers () {
        // const guardias = await fb.getCollectionFlex('users', { field: 'role', val: 'GUARDIA' })
        // const maestranza = await fb.getCollectionFlex('users', { field: 'role', val: 'MAESTRANZA' })
        // const coordinador = await fb.getCollectionFlex('users', { field: 'role', val: 'COORDINADOR' })
        // const users = [...guardias, ...maestranza, ...coordinador]

        const colRef = fb.getCollectionRef('users')
        const unsubscribe = fb.onSnapshot(colRef, (querySnapshot) => {
            const wrkUsers = []
            querySnapshot.forEach((doc) => {
                const worker = doc.data()
                if ((worker.role === 'GUARDIA' || worker.role === 'MAESTRANZA' || worker.role === 'COORDINADOR') && (worker.uid !== '6FFY4ls2TYhJfzoyhX0U8QdaJ2X2')) {
                    wrkUsers.push(doc.data())
                }
            })
            set.users(wrkUsers)
        })
    },
    async getUserHours (uid) {
        const col = 'timeLogs'
        console.log('col:', col)
        const result = await fb.getCollectionFlex(col, { field: 'uid', val: uid, sortField: 'datetime', sortDir: 'asc' })
        return result
    },
    async getHoursByMonth (year, month) {
        console.log('year:', year)
        console.log('month:', month)
        const col = 'timeLogs'
        console.log('col:', col)

        const strStart = `${year}-${month}-01`
        console.log('strStart:', strStart)
        const startDate = moment(strStart, 'YYYY-MM-DD').unix() * 1000
        if (month === 12) {
            year = year + 1
            month = 0
        }
        const strEnd = `${year}-${month + 1}-01`
        console.log('strEnd:', strEnd)
        const endDate = moment(strEnd, 'YYYY-MM-DD').unix() * 1000

        const criterios = [
            { field: 'action', op: '==', val: 'checkin' },
            { field: 'datetime', op: '>', val: startDate },
            { field: 'datetime', op: '<', val: endDate }
        ]
        const result = await fb.getCollectionQuery(col, criterios, { sortField: 'datetime', sortDir: 'asc' })
        return result
    },
    async getSummaryByUser (month, uid) {
        console.log('month:', month)
        console.log('user:', uid)
        const col = 'users'
        const result = await fb.getDocument(`${col}/${uid}/workingHours`, `2023${month}`)
        return result
    },
    async checkIO (param) {
        const fnd = state.users.find(x => x.id === param.uid)
        const now = new Date().getTime()
        const payload = {
            type: 'online', // offline - online - manual
            name: fnd.name,
            datetime: now
        }
        const pl = { ...payload, ...param }
        pl.dtMobile = moment(pl.datetime).format('DD/MM  HH:mm:ss')
        console.log('checkIO payload:', pl)
        await fb.setDocument('timeLogs', pl, now.toString())
    }
}

export default {
    set,
    state: readonly(state),
    actions
}
function delGuardia (uid) {
    console.log('delGuardia:', uid)
    delete state.curGuardias[uid]
    LocalStorage.set('TN_curGuardias', state.curGuardias)
}
//    async createLotesCol() {
//    for (let index = 1; index <= 48; index++) {
//        const lote = {
//            id: index.toString(),
//            unitId: index.toString()
//        }
//        const path = `lotes`
//        await fb.setDocument(path, lote, lote.id)
//        console.log('lote creado:', lote)
//    }
// },
