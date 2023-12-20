import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'fwk-q-firebase'
import { LocalStorage } from 'quasar'
import { ENVIRONMENTS } from 'src/environments'

fb.initFirebase(ENVIRONMENTS.firebase)

const state = reactive({
    userFlag: false,
    path: undefined,
    config: undefined,
    user: LocalStorage.getItem('TN_user')
})
const set = {
    user (o) {
        console.log('store set.user:', o)
        state.user = o
        LocalStorage.set('TN_user', o)
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
        const setting = await fb.getDocument('settings', ENVIRONMENTS.lugar)
        set.config(setting)

        const benja = 'H1WJTFu6bWRP4gYoRtAXGP4krLY2'
        const params = new URLSearchParams(window.location.search)
        const uid = params.get('uid')
        if (uid === benja) {
            actions.findUserById(uid)
        }
    },
    async findUserById (id) {
        ui.actions.notify('Id user: ' + id, 'info')
        const u = await fb.getDocument('users', id)
        set.user(u)
        return u
    },
    async subscribeToFCM () {
        const vapidKey = 'BP6nPflTuZhSgdqiyDaPMLxYy3o2gvcMM_oUl1NFP-CkMIgnAiXfOKeOhrNbjhCUOKVNEosPR4U9j2t_NSLhjy4'
        await fb.saveMessagingDeviceToken(state.document, vapidKey, state.document)
    }
}

export default {
    set,
    state: readonly(state),
    actions
}
