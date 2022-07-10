import { Avatar, Gradient, Group, Panel, PanelHeader, Title, Text, Placeholder, Button } from "@vkontakte/vkui"
import { useStorage } from "../../hook/useStorage"
import { declOfNum } from "../../vars/consts"
import { Icon56CancelCircleOutline, Icon56InfoOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';


export const Default = ({ id }) => {

    let {
        fetchedUser, defaultParams, launchParams,
        setActivePanel, openProfile
    } = useStorage()

    console.log(fetchedUser)

    const addToProfile = async () => {
        bridge.send("VKWebAppAddToProfile", {ttl: 0})
    }

    return(
        <Panel id = {id}>
            {/* <PanelHeader>Подписи</PanelHeader> */}
            <Group>
                {fetchedUser &&
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
                    <Avatar size = {96} src = {fetchedUser.photo_200}/>
                    <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                    >
                        {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                    </Title>
                    {defaultParams &&
                    <Text style={{ marginBottom: 24, color: "var(--text_secondary)" }}>
                        {`У вас ${defaultParams.count} ${declOfNum(defaultParams.count, ['автограф','автографа','автографов'])}`}
                    </Text>
                    }
                    <Button onClick={()=>setActivePanel('my_signatures')} size="l">Мои автографы</Button>
                    <Button mode='tertiary'  onClick={()=>setActivePanel('privacy')} size="l">Приватность</Button>
                </Gradient>
                }
                {launchParams?.vk_has_profile_button != "1" &&
                <Group mode="card">
                <Placeholder
                icon = {<Icon56InfoOutline width={48} height = {48}/>}
                action = {<Button
                // onClick = {()=>{openProfile(296223969)}}
                onClick = {addToProfile}
                size = 'm'>Исправить это</Button>}
                >
                    Вы не добавили кнопку приложения в профиль, никто не сможет оставить вам автограф!
                </Placeholder>
                </Group>
                }
            </Group>
        </Panel>
    )
}