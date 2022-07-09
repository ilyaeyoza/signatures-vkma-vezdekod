import { Avatar, CardGrid, SimpleCell, Text, Card } from "@vkontakte/vkui"
import { timestampToDays } from "../../vars/consts"
import './List.css'

export const SignatureList = ({ signatures }) => {
    return (
        <CardGrid size="l">
            {signatures.map((sign)=>{
                return(
                    <Card
                    className = 'card_sign'
                    mode='outline'
                    >
                        <div className = 'card_author_content'>
                            <SimpleCell
                            disabled
                            className="cell_card_author_content"
                            description = {timestampToDays(sign.datetime)}
                            before = { <Avatar size = {36} src = {sign._from.photo} /> }
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