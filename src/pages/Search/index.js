import React, { useEffect, useState } from 'react'
import Page from 'material-ui-shell/lib/containers/Page/Page'
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

const Search = () => {
  const history = useHistory()
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const {
    getPath,
    watchPath,
    unwatchPath
  } = usePaths()

  useEffect(() => {
    watchPath('users')
    return () => {
      unwatchPath('users')
    }
  }, [])

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

  const users = getPath('users')

  return (
    <Page>
      <Box>

        <Autocomplete
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
              id="filled-basic"
              label="Filled"
              variant="filled"
              value={keyword}
              onChange={({ target: { value } }) => {
                setKeyword(`${value}`.toLowerCase())
              }}
            />
          )}
        />
      </Box>
    </Page>
  )
}

export default Search
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

