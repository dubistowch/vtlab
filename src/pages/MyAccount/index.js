import Page from 'material-ui-shell/lib/containers/Page/Page'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import {
  Tabs, Tab, Box
} from '@material-ui/core'
import TabPanel from 'components/TabPanel'
import SocialLinksCard from './Tabs/SocialLinksCard'
import AccountCard from './Tabs/AccountCard'
import DiscordCard from './Tabs/DiscordCard'
import ProfileCard from './Tabs/ProfileCard'

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    marginTop: '5vh'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
}))

const MyAccount = () => {
  const intl = useIntl()

  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Page
      pageTitle={intl.formatMessage({
        id: 'my_account',
        defaultMessage: 'My Account',
      })}
    >

      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab
            label="個人卡片"
            {...a11yProps(0)}
          />
          <Tab
            label="Discord 設定"
            {...a11yProps(1)}
          />
          <Tab
            label="社群連結設定"
            {...a11yProps(2)}
          />
          <Tab
            label="帳號設定"
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ProfileCard />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DiscordCard />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SocialLinksCard />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AccountCard />
        </TabPanel>
      </div>
    </Page>
  )
}

export default MyAccount


