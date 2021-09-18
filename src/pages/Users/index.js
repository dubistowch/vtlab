import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { Container, IconButton } from '@material-ui/core'
import { useIntl } from 'react-intl'
import {
  GoogleIcon,
  FacebookIcon,
  GitHubIcon,
  TwitterIcon,
} from 'rmw-shell/lib/components/Icons'
import Page from 'material-ui-shell/lib/containers/Page/Page'
import { usePaths } from 'rmw-shell/lib/providers/Firebase/Paths'
import { useLists } from 'rmw-shell/lib/providers/Firebase/Lists'
import { useParams, useHistory } from 'react-router-dom'
import Email from '@material-ui/icons/Email'
import {
  AppBar,
  Tab,
  Box,
  FormControlLabel,
  Switch,
  Tabs
} from '@material-ui/core'

import { useFilter } from 'material-ui-shell/lib/providers/Filter'
import SearchUser from 'components/SearchUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DiscordCard from 'pages/MyAccount/Tabs/DiscordCard'

export default function () {
  const intl = useIntl()
  const history = useHistory()
  const { watchPath, getPath, firebaseApp } = usePaths()
  const { watchList, getList } = useLists()
  const { uid, tab = 'main' } = useParams()
  const { getFilter, setSearch } = useFilter()
  const { search = {} } = getFilter(tab)
  const { value: searchValue = '' } = search

  const getProviderIcon = (id) => {
    if (id === 'password') {
      return <Email />
    }
    if (id === 'google.com') {
      return <GoogleIcon />
    }
    if (id === 'facebook.com') {
      return <FacebookIcon />
    }
    if (id === 'github.com') {
      return <GitHubIcon />
    }
    if (id === 'twitter.com') {
      return <TwitterIcon />
    }

    return null
  }

  const path = `users/${uid}`

  useEffect(() => {
    watchPath(path)
    watchList('admins')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  const user = getPath(path, {})
  const admins = getList('admins')

  const { photoURL = '', displayName = '', email = '', providerData = [] } =
    user || {}

  let isAdmin = false

  admins.map((a) => {
    if (a.key === uid) {
      isAdmin = true
    }
    return a
  })

  return (
    <Page
      onBackClick={() => {
        history.goBack()
      }}
      pageTitle={intl.formatMessage({
        id: 'user',
        defaultMessage: 'User',
      })}
      appBarContent={
        <SearchUser />
      }
      tabs={
        <AppBar position="static">
          <Tabs
            value={tab}
            onChange={(e, t) => {
              history.replace(`/users/${uid}/${t}`)
            }}
            centered
          >
            <Tab
              value="main"
              icon={
                <FontAwesomeIcon icon={['fas', 'address-card']} />
              }
            />
            <Tab
              value="discord"
              icon={<FontAwesomeIcon icon={['fab', 'discord']} />}
            />

            <Tab
              value="schedule"
              icon={<FontAwesomeIcon icon={['fas', 'calendar-week']} />}
            />
          </Tabs>
        </AppBar>
      }
    >
      <Container>
        <Box py="20px">

          {tab === 'main' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                paddingTop: '130px'
              }}
            >
              <Paper
                elevation={3}
                style={{
                  position: 'relative',
                  //width: 300,
                  //height: 300,
                  borderRadius: 18,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 18,
                  minWidth: 250,
                }}
              >
                <Avatar
                  style={{ width: 120, height: 120, marginTop: -70 }}
                  alt="User Picture"
                  src={photoURL}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: 18,
                    marginBottom: 18,
                  }}
                >
                  <Typography variant="h4">{displayName}</Typography>
                  <Typography variant="h6">{email}</Typography>
                  <div
                    style={{
                      margin: 18,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {providerData.map((so) => {
                      return getProviderIcon(so.providerId) ? (
                        <IconButton color="primary" key={so}>
                          {getProviderIcon(so.providerId)}
                        </IconButton>
                      ) : null
                    })}
                  </div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isAdmin}
                        onChange={() => {
                          try {
                            firebaseApp
                              .database()
                              .ref(`admins/${uid}`)
                              .set(isAdmin ? null : true)
                          } catch (error) {
                            console.warn(error)
                          }
                        }}
                        name="checkedA"
                      />
                    }
                    label={intl.formatMessage({
                      id: 'administrator',
                      defaultMessage: 'Administrator',
                    })}
                  />
                </div>
              </Paper>
            </div>
          )}

          {tab === 'discord' && (
            <DiscordCard userId={uid} />
          )}
        </Box>

      </Container>
    </Page>
  )
}