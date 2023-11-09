import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'fwk-q-firebase'
import { LocalStorage } from 'quasar'
import { ENVIRONMENTS } from 'src/environments'
import moment from 'moment'

fb.initFirebase(ENVIRONMENTS.firebase)

const state = reactive({
    path: undefined,
    config: undefined,
    users: LocalStorage.getItem('TN_users'),
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
        set.path(`settings/${ENVIRONMENTS.lugar}`)
    },
    async getUsers () {
        const guardias = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'GUARDIA' })
        const maestranza = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'MAESTRANZA' })
        const coordinador = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'COORDINADOR' })
        const users = [...guardias, ...maestranza, ...coordinador]
        set.users(users)
        await actions.updateStatusUsers()
        return users
    },
    async updateStatusUsers () {
        const colRef = fb.getCollectionRef(`${state.path}/workingUsers`)
        const unsubscribe = fb.onSnapshot(colRef, (querySnapshot) => {
            const wrkUsers = []
            querySnapshot.forEach((doc) => {
                wrkUsers.push(doc.data())
            })
            state.users.forEach(u => {
                u.isWorking = (wrkUsers.find(x => x.uid === u.id))
            })
        })
    },
    async getUserHours (uid) {
        const col = `${state.path}/timeLogs`
        console.log('col:', col)
        const result = await fb.getCollectionFlex(col, { field: 'uid', val: uid, sortField: 'datetime', sortDir: 'asc' })
        return result
    },
    async getHoursByMonth (month) {
        const col = `${state.path}/timeLogs`
        console.log('col:', col)
        const result = await fb.getCollectionFlex(col, { field: 'action', val: 'checkin', sortField: 'datetime', sortDir: 'asc' })
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
        await fb.setDocument(`${state.path}/timeLogs`, pl, now.toString())
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
async function getWorkingUsers () {
    const wrkUsers = await fb.getCollection(`${state.path}/workingUsers`)
    return wrkUsers
}
//    async createLotesCol() {
//    for (let index = 1; index <= 48; index++) {
//        const lote = {
//            id: index.toString(),
//            unitId: index.toString()
//        }
//        const path = `${state.path}/lotes`
//        await fb.setDocument(path, lote, lote.id)
//        console.log('lote creado:', lote)
//    }
// },
