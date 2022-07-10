import { Icon56BlockOutline } from "@vkontakte/icons"
import { Group, Panel, PanelHeader, PanelHeaderBack, Placeholder, Spinner } from "@vkontakte/vkui"
import { useState, useEffect } from 'react'
import { useStorage } from "../../hook/useStorage"
import { SignatureList } from "./SignatureList"
import { server } from "../../vars/consts"

export const MySignatures = ({id}) => {
    const [signatures, setSignatures] = useState([])
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(true)
    let {
        fetchedUser,
        setActivePanel
    } = useStorage()

    useEffect(()=>{
        async function fetchData(){
            const req = await fetch(`${server}get_signatures`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    user_id:fetchedUser.id,
                    page:0
                }
            )})
            
            if(req.ok){
                let res = await req.json()
                setSignatures(res.signatures)
            }

            setLoad(false)
        }

        fetchData()
    }, [])

    return(
        <Panel
        id = {id}
        >
            <PanelHeader left = {
                <PanelHeaderBack onClick = {()=>{setActivePanel('default')}}/>
            }>Мои автографы</PanelHeader>
            <Group>
                {load && 
                <Spinner size='regular' />
                }

                {(!load && signatures.length > 0) &&
                <SignatureList signatures={signatures} share = {true}/>
                }

                {(!load && signatures.length == 0) &&
                <Placeholder
                icon={<Icon56BlockOutline />}
                >
                    У вас нет ни одного автографа
                </Placeholder>
                }
            </Group>
        </Panel>
    )
}