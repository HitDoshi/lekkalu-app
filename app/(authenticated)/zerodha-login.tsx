import { View, useTheme } from 'tamagui'
import { ActivityIndicator, useColorScheme } from 'react-native'

import { WebView } from 'react-native-webview'
import { StyleSheet } from 'react-native'
import { useRef, useState } from 'react'
import LoaderOverlay from '@/components/loader-overlay'

export default function ZerodhaLogin() {
  const theme = useTheme()
  const systemTheme = useColorScheme();
  const [onLoad,setLoading] = useState(true);
  const webViewRef = useRef<any>();

  return (
    <View flex={1}>
        {onLoad && <LoaderOverlay />}
      <WebView style={styles.webviewContainer} source={{ uri: `https://kite.zerodha.com/connect/login?v=${'3'}&api_key=${'956avgwbx7k3ky1u'}` }} onLoadEnd={()=>{setLoading(false)}} 
        ref={(ref) => (webViewRef.current = ref)}
      onNavigationStateChange={(e)=>{
        console.log('zerodha nav change-->',e);        
      }}
      
      onMessage={(event)=>{
        console.log('zerodha event-->',event);
        
      }}/>
    </View>
  )
}

const styles = StyleSheet.create({
  webviewContainer: {
    flex: 1,
  },
})
