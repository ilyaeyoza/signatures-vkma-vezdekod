import { Icon16Share } from "@vkontakte/icons"
import { Avatar, CardGrid, SimpleCell, Text, Card, IconButton } from "@vkontakte/vkui"
import { useStorage } from "../../hook/useStorage"
import { timestampToDays } from "../../vars/consts"
import './List.css'
import bridge from "@vkontakte/vk-bridge"

export const SignatureList = ({ signatures, share = false }) => {

    function shareToHistory(pic){
        bridge.send("VKWebAppShowStoryBox", 
            {
                "background_type": "image",
                "url": "https://sun3-12.userapi.com/impg/f1NJs1KHiykb-kUdZgCVpqu2iSbPGL94DP2TMw/XY7vfzdN1Zc.jpg?size=1440x2160&quality=96&sign=69a2748d55e248e87e0dd837abfabd86&type=album",
                "stickers": [
                  {
                    "sticker_type": "renderable",
                    "sticker": {
                      "can_delete": 0,
                      "content_type": "image",
                      "url": pic,
                    }
                  }
                ]
              }
            );
    }

    return (
        <CardGrid size="l">
            {signatures.map((sign)=>{
                return(
                    <Card
                    key = {`${sign.datetime}`}
                    className = 'card_sign'
                    mode='outline'
                    >
                        <div className = 'card_author_content'>
                            <SimpleCell
                            disabled
                            className="cell_card_author_content"
                            description = {timestampToDays(sign.datetime)}
                            before = { <Avatar size = {36} src = {sign._from.photo} /> }
                            after = {(share && sign.media != '') && <IconButton
                            onClick = {()=>shareToHistory(sign.media)}
                            ><Icon16Share/></IconButton>}
                            >
                                {sign._from.name}
                            </SimpleCell>
                        </div>
                        <div className = 'card_main_content'>
                            {sign.media == '' ? 
                            <div className = 'card_main_content_text'>
                                <Text weight="3">
                                    {sign.text}
                                </Text>
                            </div>
                            :
                            <div className = 'card_main_content_media'>
                                <img 
                                className = 'media_image'
                                src = {sign.media}
                                />
                            </div>
                            }
                        </div>
                    </Card>
                )
            })}
        </CardGrid>
    )
}