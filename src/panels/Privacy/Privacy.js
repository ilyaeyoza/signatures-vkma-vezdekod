import { Icon56InfoOutline } from "@vkontakte/icons"
import { FormItem, FormLayout, NativeSelect, Panel, PanelHeader, PanelHeaderBack, Group, Placeholder, Button, Div, ScreenSpinner } from "@vkontakte/vkui"
import { useState } from "react"
import { useStorage } from "../../hook/useStorage"
import bridge from '@vkontakte/vk-bridge';
import { server } from "../../vars/consts";


export const Privacy = ({ id }) => {

    let {
        setActivePanel,
        hideFriendsPlaceholder, setHideFriendsPlaceholder,
        setPopout, defaultParams, setDefaultParams, 
        alreadySet, setAlreadySet
    } = useStorage()

    const [viewmode, setViewMode] = useState(defaultParams?.privacy?.view_mode)
    const [postmode, setPostMode] = useState(defaultParams?.privacy?.post_mode)

    const buttonTurnoff = () => {
        bridge.send('VKWebAppRemoveFromProfile').then(data=>{
            if(data.result){
                setAlreadySet(false)
            }
        })
    }

    const openFriendsBridge = () => {
        bridge.send("VKWebAppGetFriends", {multi:true})
        .then(async (data)=>{
            setPopout(<ScreenSpinner size = 'large' />)
            let friends = data.users
            let ids = friends.map(f=>f.id)
            const req = await fetch(`${server}edit_friends`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    ids:ids
                }
            )})
            if(req.ok){
                setHideFriendsPlaceholder(true)
            }
            setPopout(null)
        })
    }

    const edit_viewmode = async (e) => {
        let mode = e.currentTarget.value
        setViewMode(mode)
        setPopout(<ScreenSpinner size = 'large' />)
        const req = await fetch(`${server}set_privacy`, {method:'POST', body:JSON.stringify(
            {
                params:window.location.search,
                view_mode:mode,
                post_mode:postmode
            }
        )})

        let local_defaultParams = defaultParams
        console.log(local_defaultParams)
        local_defaultParams.privacy.view_mode = mode
        setDefaultParams(local_defaultParams)

        setPopout(null)
    }

    const edit_postmode = async (e) => {
        let mode = e.currentTarget.value
        setPostMode(mode)
        setPopout(<ScreenSpinner size = 'large' />)
        const req = await fetch(`${server}set_privacy`, {method:'POST', body:JSON.stringify(
            {
                params:window.location.search,
                view_mode:viewmode,
                post_mode:mode
            }
        )})

        let local_defaultParams = defaultParams
        local_defaultParams.privacy.post_mode = mode
        setDefaultParams(local_defaultParams)

        setPopout(null)
    }

    return(
        <Panel id = {id}>
            <PanelHeader left = {
                <PanelHeaderBack onClick={()=>setActivePanel('default')}/>
            }>Приватность</PanelHeader>
            <Group>
                <FormLayout>
                    <FormItem top = 'Просмотр ваших автографов'>
                        <NativeSelect value={viewmode} onChange = {edit_viewmode}>
                            <option value = 'all'>Доступно всем</option>
                            <option value = 'friends'>Доступно только друзьям</option>
                            <option value = 'noone'>Доступно только мне</option>
                        </NativeSelect>
                    </FormItem>
                    <FormItem top = 'Создание новых автографов'>
                        <NativeSelect value={postmode} onChange = {edit_postmode}>
                            <option value = 'all'>Доступно всем</option>
                            <option value = 'friends'>Доступно только друзьям</option>
                            <option value = 'noone'>Никому не доступно</option>
                        </NativeSelect>
                    </FormItem>
                </FormLayout>

                {((viewmode == 'friends' || postmode == 'friends') && !hideFriendsPlaceholder) &&
                <Placeholder
                icon = {<Icon56InfoOutline />}
                header = 'Обновите список своих друзей в приложении'
                action={<Button onClick = {openFriendsBridge} size = 's'>Разрешить доступ к друзьям</Button>}
                >
                    Приложение будет проверять является ли пользовательу вашим другом только по тому списку, который вы нам предоставите
                </Placeholder>
                }
                
                {/* {alreadySet &&
                <Div>
                    <Button stretched size="l">Удалить кнопку из профиля</Button>
                </Div>
                } */}
            </Group>
        </Panel>
    )
}