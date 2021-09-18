import React, { useEffect, useState } from 'react'
import {
  Box, Typography
} from '@material-ui/core'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useFirebase } from 'rmw-shell/lib/providers/Firebase'

export default () => {
  const { auth } = useAuth()
  const { firebaseApp } = useFirebase()
  const [state, setState] = useState({
    discordId: '',
    discordUser: '',
    successful: false
  })

  useEffect(() => {
    if (auth && firebaseApp) {
      const { uid } = auth
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const [accessToken, tokenType] = [
        fragment.get('access_token'),
        fragment.get('token_type')
      ]
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
        .then(result => result.json())
        .then(async (response) => {
          const { username, discriminator, id } = response;
          (async () => {
            await firebaseApp
              .database()
              .ref(`users/${uid}`)
              .update({
                discordId: id,
                discordUser: `${username}#${discriminator}`
              })
            setState({ ...state, successful: true })
          })()
        })
        .catch(console.error)
    }
  }, [auth, firebaseApp])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box width="100vw">
        <Typography variant="h6" align="center">
          {
            (state && state.successful)
            && '綁定完成！可以關閉視窗囉！'
            || '設定中...請稍後'
          }
        </Typography>
      </Box>
    </Box>
  )
}
