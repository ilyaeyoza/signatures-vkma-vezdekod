import { Icon16BrushOutline, Icon16ImageFilter, Icon16Picture, Icon16Text, Icon24PictureOutline, Icon24TextOutline } from "@vkontakte/icons"
import { Button, FormField, FormItem, FormLayout, Group, Panel, PanelHeader, PanelHeaderBack, Div, Tabs, TabsItem, Textarea, File } from "@vkontakte/vkui"
import { useState } from "react"
import { useStorage } from "../../hook/useStorage"
import { getBase64 } from "../../vars/consts"


export const NewSignature = ({ id }) => {
    const [currentTab, setCurrentTab] = useState('text')
    const [fileLoad, setFileLoad] = useState(false)
    let {
        setActivePanel
    } = useStorage()

    const [signValue, setSignValue] = useState('')
    const [media, setMedia] = useState(null)

    const loadImage = async (file) => {
        setFileLoad(true)
        let img_base64 = await getBase64(file).then(res=>{return res})
        setMedia(img_base64)
        setFileLoad(false)
    }

    return (
        <Panel id = {id}>
            <PanelHeader left = {
            <PanelHeaderBack
            onClick={()=>{setActivePanel('profile')}}
            />
             }>Отправить автограф</PanelHeader>
            
            <Group>
                <Tabs>
                    <TabsItem
                    selected = {currentTab === 'text'}
                    onClick = {()=>setCurrentTab('text')}
                    >
                        Текстовый
                    </TabsItem>
                    <TabsItem
                    selected = {currentTab === 'media'}
                    onClick = {()=>setCurrentTab('media')}
                    >
                        Медиа
                    </TabsItem>
                    <TabsItem
                    selected = {currentTab === 'paint'}
                    onClick = {()=>setCurrentTab('paint')}
                    >
                        Рисунок
                    </TabsItem>
                </Tabs>
                {currentTab === 'text' &&
                <Group mode='plain'>
                    <FormLayout>
                        <FormItem top = 'Текстовый автограф' bottom = {`${signValue.length}/1000`}>
                            <Textarea 
                            placeholder='Здесь был Павгро' 
                            maxLength={1000}
                            onChange={(e)=>setSignValue(e.currentTarget.value)}
                            />
                        </FormItem>
                    </FormLayout>

                    <Div>
                        <Button size='l' sizeY="regular" stretched>Оставить автограф</Button>
                    </Div>
                </Group>
                }

                {currentTab === 'media' &&
                <Group mode='plain'>
                <FormLayout>
                    <FormItem top = 'Фотография' bottom = "Загрузите любую фотографию с вашего устройства">
                        <File
                        loading={fileLoad}
                        before = {<Icon24PictureOutline />}
                        size = 'l'
                        controlSize="l"
                        accept="image/*"
                        onChange={e=>loadImage(e.currentTarget.files[0])}
                        />
                    </FormItem>
                </FormLayout>

                <img src = {media} />

                <Div>
                    <Button size='l' sizeY="regular" stretched>Оставить автограф</Button>
                </Div>
            </Group>
                }
            </Group>
        </Panel>
    )
}