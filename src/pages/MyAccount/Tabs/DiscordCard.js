import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { usePaths } from 'rmw-shell/lib/providers/Firebase/Paths'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import SettingsIcon from '@material-ui/icons/Settings'

const CopyTextField = ({ value, label, ariaLabel }) => {
  return (
    <TextField
      label={label}
      value={value}
      margin="normal"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={ariaLabel}
              onClick={() => {
                navigator.clipboard.writeText(value)
              }}
              edge="end"
            >
              <FileCopyIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      fullWidth />
  )
}
const DiscordLogin = () => {
  const oauth2Discord = 'https://discord.com/api/oauth2/authorize?client_id=881191140018257951&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fdiscord&response_type=token&scope=identify%20guilds'
  const windowOpened = window.open(oauth2Discord, Date.now(), 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=600,height=800,left = 200, top = 200')
}

const DiscordCard = ({ userId }) => {
  const { auth } = useAuth()
  const { uid } = auth
  const [userPath, setUserPath] = useState()
  const {
    getPath,
    getPathError,
    isPathLoading,
    watchPath,
    unwatchPath
  } = usePaths()

  const discordId = getPath(`${userPath}/discordId`, `${userPath}/discordId`)
  const discordUser = getPath(`${userPath}/discordUser`, 'NA')
  const error = JSON.stringify(getPathError(`${userPath}/discordId`))
  const isLoading = isPathLoading(`${userPath}/discordId`)

  useEffect(() => {
    if (auth && !userId) {
      setUserPath(`users/${uid}`)
    } else if (userId) {
      setUserPath(`users/${userId}`)
    }
  }, [auth])

  useEffect(() => {
    watchPath(`${userPath}/discordId`)
    watchPath(`${userPath}/discordUser`)
    return () => {
      unwatchPath(`${userPath}/discordId`)
      unwatchPath(`${userPath}/discordUser`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPath])

  return (
    <Box>

      {isLoading && `loading: ${isLoading}`}
      {(!isLoading && !discordId) && (userId === uid) && (
        <Button
          variant="contained"
          style={{
            color: '#fff',
            background: '#6c89e0',
            textTransform: 'none',
            borderRadius: '5px'
          }}
          onClick={() => DiscordLogin()}
        >
          Discord 登入
        </Button>
      )}
      {!isLoading && (
        <Card
          style={{ width: '100%' }}
        >
          <CardHeader
            title={'Discord 跳跳人'}
            action={
              <IconButton
                aria-label="settings"
                onClick={() => {
                  window.open('https://discord-reactive-images.fugi.tech/', "_blank")
                }}
              >
                <SettingsIcon />
              </IconButton>
            }
          />
          <CardContent>
            <CopyTextField
              value={discordId}
              label="Discord ID"
              ariaLabel="copy Discord ID"
            />
            <CopyTextField
              value={discordUser}
              label="Discord 使用者"
              ariaLabel="copy Discord User"
            />
            <CopyTextField
              value={`https://discord-reactive-images.fugi.tech/individual/${discordId}`}
              label="Discord 跳跳網址"
              ariaLabel="copy Discord reactive image url"
            />
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default DiscordCard


