import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import Search from '@material-ui/icons/Search'

import {
  Avatar,
  Box,
  Chip,
  TextField,
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

import { usePaths } from 'rmw-shell/lib/providers/Firebase/Paths'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    flex: 1,
    borderRadius: 4,
    minHeight: 48,
    display: 'block',
    '&:hover': {
      background: alpha(theme.palette.common.white, 0.25),
    },
    '& input': {
      transition: theme.transitions.create('width'),
      width: 0,
      '&:focus': {
        width: 240,
      },
    },
  },
  rootOpen: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    flex: 1,
    borderRadius: 4,
    minHeight: 48,
    display: 'block',
    background: alpha(theme.palette.common.white, 0.25),
    width: 240,
  },
  search: {
    width: theme.spacing(1) * 5,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing(1) * 2}px 0px 0px ${theme.spacing(1) * 5}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
  },
  inputOpen: {
    font: 'inherit',
    padding: `${theme.spacing(1) * 2}px 0px 0px ${theme.spacing(1) * 5}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    outline: 0,
  },
}))

const SocialLinkDesc = ({ user, linkId }) => (
  <Box>
    <Typography variant="body2">
      {Object.entries(
        user.social_links[linkId]
      )[0]
        .map((value, index) => (
          index === 0 && (
            <FontAwesomeIcon
              icon={['fab', value]}
              style={{ marginRight: '5px' }} />
          ) || (
            <>{value}</>
          )
        ))}
    </Typography>
  </Box>
)

export default function ({
  onChange,
  initialValue = '',
  alwaysOpen,
}) {
  const classes = useStyles()
  const history = useHistory()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])

  const {
    getPath,
    watchPath,
    unwatchPath
  } = usePaths()

  useEffect(() => {
    watchPath('users')
    setKeyword(initialValue)
    return () => {
      unwatchPath('users')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const users = getPath('users')

  useEffect(() => {
    if (keyword) {
      setResults(
        Object.entries(users)
          .filter(([_id, user]) => (
            user?.profile?.displayName
            && user.profile.displayName
              .toLowerCase()
              .indexOf(keyword) >= 0
          ))
          .map(([_id, user]) => ({
            id: _id,
            value: user.profile.displayName,
            user
          }))
        || []
      )
    }
  }, [keyword])

  const hasValue = keyword && keyword !== ''
  const isOpen = hasValue || alwaysOpen

  return (
    <div className={isOpen ? classes.rootOpen : classes.root}>
      <div className={classes.search}>
        <Search />
      </div>
      <Autocomplete
        className={isOpen ? classes.inputOpen : classes.input}
        id="search-user-autocomplete"
        freeSolo
        options={results}
        getOptionLabel={(option) => {
          return option.value
        }}
        renderOption={({ id, user, value }) => {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              onClick={() => {
                history.push(`/users/${id}`)
              }}
            >
              <Box mx={2}><Avatar src={user.photoURL} /></Box>
              <Box>
                <Typography variant="body1">{value}</Typography>
                <Box>
                  {user.profile.hashtags?.map((tag) => (
                    <Chip size="small" label={tag} />
                  ))}
                </Box>
                {user.profile.primarySocialLink && (
                  <SocialLinkDesc
                    user={user}
                    linkId={user.profile.primarySocialLink}
                  />
                )}
              </Box>
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className={isOpen ? classes.inputOpen : classes.input}
            id="filled-basic"
            value={keyword}
            onChange={({ target: { value } }) => {
              setKeyword(`${value}`.toLowerCase())
            }}
          />
        )}
      />
    </div>
  )
}