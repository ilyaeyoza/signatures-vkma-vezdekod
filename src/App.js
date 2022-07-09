import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import { useStorage } from './hook/useStorage';
import { Default } from './panels/Default/Default';
import { MySignatures } from './panels/Profile/MySignatures';
import { Profile } from './panels/Profile/Profile';
import { NewSignature } from './panels/NewSignature/NewSignature';

const App = () => {
	let {
		activePanel,
		popout, setPopout
	} = useStorage()
	const [scheme, setScheme] = useState('bright_light')
	const [fetchedUser, setUser] = useState(null);

	useEffect(() => {

		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
			  setScheme(data.scheme)
			}
		  });

	}, []);


	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' />
								<Default id = 'default'/>
								<MySignatures id = 'my_signatures'/>
								<Profile id = 'profile' />
								<NewSignature id = 'new_signature' />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
