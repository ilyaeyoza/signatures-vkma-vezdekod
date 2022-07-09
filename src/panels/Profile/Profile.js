import { Icon56BlockOutline } from "@vkontakte/icons"
import { Group, Panel, Placeholder, Spinner, Gradient, Title, Text, Avatar, Button, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { useState, useEffect } from "react"
import { useStorage } from "../../hook/useStorage"
import { server, declOfNum } from "../../vars/consts"
import { SignatureList } from "./SignatureList"


export const Profile = ({ id }) => {
    const [thisUser, setThisUser] = useState(null)
    const [signatures, setSignatures] = useState([])
    const [load, setLoad] = useState(true)
    const [page, setPage] = useState(0)
    let {
        activeProfile, setActivePanel
    } = useStorage()

    useEffect(()=>{
        async function fetchData(){
            const req = await fetch(`${server}get_profile`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    user_id:activeProfile
                }
            )})
            if(req.ok){
                let res = await req.json()
                if(!res.error){
                    setSignatures(res.signatures)
                    setThisUser(res.profile)
                }
            }

            setLoad(false)
        }

        fetchData()
    }, [])

    return(
        <Panel id = {id}>
            <PanelHeader
            left = {<PanelHeaderBack onClick={()=>{setActivePanel('default')}}/>}
            >Автографы</PanelHeader>
            <Group>
            {load && 
            <Spinner size = 'regular' />
            }
            {(!load && thisUser) && 
            <Gradient
                style={{
                    // margin: sizeX === SizeType.REGULAR ? "-7px -7px 0 -7px" : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                  }}
                >
                    <Avatar size = {96} src = {thisUser.photo}/>
                    <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                    >
                        {thisUser.name}
                    </Title>
                    {thisUser.count > 0 &&
                    <Text style={{ marginBottom: 24, color: "var(--text_secondary)" }}>
                        {`${thisUser.count} ${declOfNum(thisUser.count, ['автограф','автографа','автографов'])}`}
                    </Text>
                    }
                    <Button onClick={()=>setActivePanel('new_signature')} size="l">Оставить автограф</Button>
                </Gradient>
                }
                {(!load && thisUser.count == 0) && 
                <Placeholder
                header = 'Пусто'
                icon = {<Icon56BlockOutline />}
                >
                    Здесь нет ни одного автографа
                </Placeholder>
                }

                {(!load && thisUser.count > 0) && 
                <Group mode = 'plain'>
                <SignatureList signatures={signatures} />
                </Group>
                }
            </Group>
        </Panel>
    )
}