import { ScreenSpinner } from "@vkontakte/vkui"
import { useState, useEffect, createContext } from "react"
import bridge from '@vkontakte/vk-bridge';
import { server } from "../vars/consts";

export const StorageContext  = createContext(null)

const StorageProvider = ({children}) => {

    const [activePanel, setActivePanel] = useState('default')
    const [popout, setPopout] = useState(<ScreenSpinner size="large"/>)
    const [fetchedUser, setUser] = useState(null);
    const [launchParams, setLaunchParams] = useState(null)
    const [defaultParams, setDefaultParams] = useState(null)
    const [activeProfile, setActiveProfile] = useState(null)
    const [snack, setSnack] = useState(null)
    const [hideFriendsPlaceholder, setHideFriendsPlaceholder] = useState(false)
    const [alreadySet, setAlreadySet] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);

            let urlSearchParams = new URLSearchParams(window.location.search);
            let params = Object.fromEntries(urlSearchParams.entries());
            setLaunchParams(params)

            if(params.vk_platform == 'mobile_android' || params.vk_platform == 'mobile_iphone'){
                setIsMobile(true)
            }

            if(params.vk_has_profile_button != '1'){
                setAlreadySet(false)
            }

            if(params.vk_profile_button_forbidden == '1'){
                setAlreadySet(false)
            }

            if(params.vk_profile_id && Number(params.vk_profile_id)){
                if(Number(params.vk_profile_id) != user.id){
                    openProfile(Number(params.vk_profile_id))
                }
            }

            const req = await fetch(`${server}get_default`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search
                }
            )})
            if(req.ok){
                const res = await req.json()
                if(!res.error){
                    setDefaultParams(res.default)
                }
            }

            setPopout(null);
		}

		fetchData();
	}, []);

    const openProfile = (userid) => {
        setActiveProfile(userid)
        setActivePanel('profile')
    }

    const value = {
        activePanel, setActivePanel,
        popout, setPopout,
        fetchedUser, defaultParams, launchParams, setDefaultParams,
        activeProfile, openProfile,
        snack, setSnack,
        hideFriendsPlaceholder, setHideFriendsPlaceholder,
        alreadySet, setAlreadySet,
        isMobile
    }

    return(
        <StorageContext.Provider value = {value}>
            {children}
        </StorageContext.Provider>
    )
}

export default StorageProvider