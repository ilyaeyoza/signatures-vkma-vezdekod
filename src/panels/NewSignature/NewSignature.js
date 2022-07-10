import { Icon16BrushOutline, Icon16ImageFilter, Icon16Picture, Icon16Text, Icon24PictureOutline, Icon24TextOutline } from "@vkontakte/icons"
import { Button, FormField, FormItem, FormLayout, Group, Panel, PanelHeader, PanelHeaderBack, Div, Tabs, TabsItem, Textarea, File, Slider, Snackbar, ScreenSpinner } from "@vkontakte/vkui"
import { useState, useEffect } from "react"
import { useStorage } from "../../hook/useStorage"
import { getBase64, server } from "../../vars/consts"
import { Paintable, PaintableRef } from 'paintablejs/react';

import styles from './NewSignature.css';

import './NewSignature.css'


export const NewSignature = ({ id }) => {
    const [currentTab, setCurrentTab] = useState('text')
    const [fileLoad, setFileLoad] = useState(false)
    let {
        setActivePanel, activeProfile, setSnack, setPopout
    } = useStorage()

    const [signValue, setSignValue] = useState('')
    const [media, setMedia] = useState(null)

    const [color, setColor] = useState('#000000')
    const [active, setActive] = useState(true)
    const [thickness, setThickness] = useState(5)
    const [paint, setPaint] = useState(null)
    // const paintableRef = useRef<PaintableRef>(null);

    const loadImage = async (file) => {
        setFileLoad(true)
        let img_base64 = await getBase64(file).then(res=>{return res})
        setMedia(img_base64)
        setFileLoad(false)
    }

    const badLeave = () => {
        setActivePanel('profile')
        setSnack(
            <Snackbar
            onClose={()=>{setSnack(null)}}
            >
                Не удалось оставить автограф
            </Snackbar>
        )
    }

    const goodLeave = () => {
        setActivePanel('profile')
        setSnack(
            <Snackbar
            onClose={()=>{setSnack(null)}}
            >
                Автограф был оставлен
            </Snackbar>
        )
    }

    const post_signature = async () => {
        setPopout(<ScreenSpinner size="large" />)
        if(currentTab == 'text'){
            const req = await fetch(`${server}add_text_signature`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    user_id:activeProfile,
                    text:signValue
                }
            )})
            if (req.ok) {
                let res = await req.json()
                if(res.error){
                    badLeave()
                }else{
                    goodLeave()
                }
            }else{
                badLeave()
            }
        }else if(currentTab == 'paint'){
            setActive(true)
            setTimeout(async () => {
            console.log(paint)
            const req = await fetch(`${server}add_media_signature`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    user_id:activeProfile,
                    media:paint
                }
            )})
            if (req.ok) {
                let res = await req.json()
                if(res.error){
                    badLeave()
                }else{
                    goodLeave()
                }
            }else{
                badLeave()
            }
            }, 500);
        }else{
            const req = await fetch(`${server}add_media_signature`, {method:'POST', body:JSON.stringify(
                {
                    params:window.location.search,
                    user_id:activeProfile,
                    media:media
                }
            )})
            if (req.ok) {
                let res = await req.json()
                if(res.error){
                    badLeave()
                }else{
                    goodLeave()
                }
            }else{
                badLeave()
            }
        }

        setPopout(null)
    }

    useEffect(()=>{console.log(paint)}, [paint])

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
                    onClick = {()=>{
                        setActive(false)
                        setTimeout(() => {
                            setCurrentTab('text')
                        }, 80);
                    }}
                    >
                        Текстовый
                    </TabsItem>
                    <TabsItem
                    selected = {currentTab === 'media'}
                    onClick = {()=>{
                        setActive(false)
                        setTimeout(() => {
                            setCurrentTab('media')
                        }, 80);
                    }}
                    >
                        Медиа
                    </TabsItem>
                    <TabsItem
                    selected = {currentTab === 'paint'}
                    onClick = {()=>{
                        setActive(true)
                        setTimeout(() => {
                            setCurrentTab('paint')
                        }, 80);
                    }}
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
                        <Button disabled = {signValue.length == 0} size='l' sizeY="regular" stretched
                        onClick={post_signature}
                        >Оставить автограф</Button>
                    </Div>
                </Group>
                }

                {currentTab === 'media' &&
                <Group mode='plain'>
                <div className = 'flexbox_fileinput'>
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

                <img className = 'preview_image' src = {media} />

                </div>

                <Div>
                    <Button disabled = {media == null} size='l' sizeY="regular" stretched
                    onClick={post_signature}
                    >Оставить автограф</Button>
                </Div>
            </Group>
            }

            {currentTab === 'paint' &&
            <Group>
                <div className="canvas_box">
                    <Paintable 
                    className="canvas_content"
                    width={756}
                    height={378}
                    color={color}
                    thickness={thickness}
                    // ref={paintableRef}
                    onSave = {(image)=>{setPaint(image)}}
                    image = {paint}
                    active={active}
                    >
                        <div className='canvas-inner' />
                    </Paintable>
                </div>
                <div className="painter_params">
                    <div className="flexbox_paint_item">
                        <input
                        type='color'
                        defaultValue={color}
                        onChange = {(e)=>setColor(e.currentTarget.value)}
                        />
                        <label>{color}</label>
                    </div>

                    <div className="flexbox_paint_item">
                        <input 
                        type='range'
                        min = {1}
                        max = {30}
                        defaultValue = {thickness}
                        onChange = {e=>{setThickness(e.currentTarget.value)}}
                        />
                        <label>{thickness}</label>
                    </div>
                </div>

                    <Div>
                        <Button 
                        // disabled={paint == null}
                        size='l'
                        sizeY="regular"
                        onClick={()=>{
                            setActive(false)
                            setTimeout(() => {
                                post_signature()
                            }, 80);
                        }}
                        stretched>Оставить автограф</Button>
                    </Div>
            </Group>
            }

            </Group>
        </Panel>
    )
}