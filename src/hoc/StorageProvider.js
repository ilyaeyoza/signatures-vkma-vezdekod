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
    const [defaultParams, setDeafultParams] = useState(null)
    const [activeProfile, setActiveProfile] = useState(null)

    useEffect(() => {

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);

            let urlSearchParams = new URLSearchParams(window.location.search);
            let params = Object.fromEntries(urlSearchParams.entries());
            setLaunchParams(params)

            const req = await fetch(`${server}get_default`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search
                }
            )})
            if(req.ok){
                const res = await req.json()
                if(!res.error){
                    setDeafultParams(res.default)
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
        fetchedUser, defaultParams, launchParams,
        activeProfile, openProfile
    }

    return(
        <StorageContext.Provider value = {value}>
            {children}
        </StorageContext.Provider>
    )
}

export default StorageProvider