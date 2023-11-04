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
    curMaestranza: LocalStorage.getItem('TN_curMaestranza')
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
        const wrkUsers = await getWorkingUsers()
        state.users.forEach(u => {
            if (wrkUsers.find(x => x.uid === u.id)) { u.isWorking = true }
        })
    },
    async checkIO (uid, action, type = 'online') {
        const fnd = state.users.find(x => x.id === uid)
        const now = new Date().getTime()
        const pl = {
            type, // offline - online - manual
            action,
            uid,
            name: fnd.name,
            datetime: now,
            dtMobile: moment(now).format('DD/MM  HH:mm:ss')
        }
        console.log('checkIO payload:', pl)
        await fb.setDocument(`${state.path}/timeLogs`, pl, now.toString())
        setTimeout(() => {
            actions.updateStatusUsers()
        }, 10000)
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
