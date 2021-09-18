import React, { useEffect, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { usePaths } from 'rmw-shell/lib/providers/Firebase/Paths'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import ChipInput from 'material-ui-chip-input'

import { socialLinksNames } from './socialLinksNames'

const ProfileCard = () => {
  const { auth } = useAuth()
  const [profilePath, setProfilePath] = useState()
  const [socialLinkPath, setSocialLinkPath] = useState()
  const [openDialog, setOpenDialog] = useState(false)
  const {
    firebaseApp,
    getPath,
    getPathError,
    isPathLoading,
    watchPath,
    unwatchPath
  } = usePaths()
  const profileFields = getPath(profilePath, {})
  const error = JSON.stringify(getPathError(profilePath))
  const isLoading = isPathLoading(profilePath)

  const socialLinks = Object.entries(getPath(socialLinkPath, {}))
    .map(([linkId, socialLink]) => {
      const [type, link] = Object.entries(socialLink)[0]
      return [linkId, `${socialLinksNames[type]} (${link})`]
    })
  const socialLinksError = JSON.stringify(getPathError(socialLinkPath))
  const socialLinkIsLoading = isPathLoading(socialLinkPath)

  const SocialLinksSelector = (props) => (
    <Select {...props}>
      <MenuItem value="">
        <em>-</em>
      </MenuItem>
      {socialLinks.map(([value, name]) => (
        <MenuItem value={value}>
          {name}
        </MenuItem>
      ))}
    </Select>
  )

  const saveField = (field, value) => {
    (
      async () => (
        firebaseApp
          .database()
          .ref(`${profilePath}/${field}`)
          .set(value)
      )
    )()
  }

  const socialLinksIcon = (field) => {
    if (profileFields && field in profileFields) {
      const originSocialLinks = getPath(socialLinkPath, false)
      if (originSocialLinks && profileFields[field] in originSocialLinks) {
        const [icon,] = Object.entries(originSocialLinks[profileFields[field]])[0]
        return ['fab', icon]
      }
    }
    return ['fas', 'share-alt']
  }

  const profileData = {
    displayName: {
      defaultValue: '',
      componentType: 'text',
      componentProps: {
        label: '顯示名稱',
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={['fas', 'address-card']} />
            </InputAdornment>
          )
        },
        onChange: ({ target: { value } }) => {
          saveField('displayName', value)
        }
      }
    },
    languages: {
      defaultValue: [],
      componentType: 'text',
      componentProps: {
        label: '使用語系',
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={['fas', 'language']} />
            </InputAdornment>
          )
        },
        onChange: ({ target: { value } }) => {
          saveField('languages', value)
        }
      }
    },
    primarySocialLink: {
      defaultValue: null,
      labelComponentProps: {
        label: '主要社群連結',
        id: 'profile-field-primarySocialLink-label',
      },
      componentType: 'sociallink-selector',

      componentProps: {
        labelId: 'profile-field-primarySocialLink-label',
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={socialLinksIcon('primarySocialLink')} />
          </InputAdornment>
        ),
        onChange: ({ target: { value } }) => {
          saveField('primarySocialLink', value)
        }
      }
    },
    secondarySocialLink: {
      defaultValue: null,
      labelComponentProps: {
        label: '次要社群連結',
        id: 'profile-field-secondarySocialLink-label',
      },
      componentType: 'sociallink-selector',

      componentProps: {
        labelId: 'profile-field-secondarySocialLink-label',
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={socialLinksIcon('secondarySocialLink')} />
          </InputAdornment>
        ),
        onChange: ({ target: { value } }) => {
          saveField('secondarySocialLink', value)
        }
      }
    },
    hashtags: {
      defaultValue: [],
      // labelComponentProps: {
      //   label: '標籤',
      //   id: 'profile-field-hashtags-label',
      // },
      componentType: 'chip-input',
      componentProps: {
        // labelId: 'profile-field-hashtags-label',
        label: '標籤',
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={['fas', 'hashtag']} />
            </InputAdornment>
          )
        },
        onChange: (value) => {
          saveField('hashtags', value)
        },
        onDelete: (value, index) => {
          if (profileFields && 'hashtags' in profileFields) {
            const newTags = profileFields['hashtags'].filter((tag) => tag != value)
            saveField('hashtags', newTags)
          }
        }
      },

    },
    bio: {
      defaultValue: '',
      componentType: 'text',
      componentProps: {
        label: '關於介紹',
        multiline: true,
        rows: 4,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={['fas', 'paragraph']} />
            </InputAdornment >
          )
        },
        onChange: ({ target: { value } }) => {
          saveField('bio', value)
        }
      }
    }
  }

  useEffect(() => {
    if (auth) {
      const { uid } = auth
      setProfilePath(`users/${uid}/profile`)
      setSocialLinkPath(`users/${uid}/social_links`)
    }
  }, [auth])

  useEffect(() => {
    if (profilePath) {
      watchPath(profilePath)
      return () => {
        unwatchPath(profilePath)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilePath])

  useEffect(() => {
    if (socialLinkPath) {
      watchPath(socialLinkPath)
      return () => {
        unwatchPath(socialLinkPath)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialLinkPath])

  return (
    <Box>
      {/* <FormDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false)
        }}
        handleSave={(savedLink) => {
          setOpenDialog(false)
          const newSocialLink = { [savedLink.socialType]: savedLink.profileField };
          console.log('profilePath', profilePath);
          (async () => {
            await firebaseApp
              .database()
              .ref(profilePath)
              .set(newSocialLink)
          })()
        }}
      /> */}
      {isLoading && `loading: ${isLoading}`}
      {!isLoading && (
        <Card
          style={{ width: '100%', maxWidth: 'calc(100vw - 200px)' }}
        >
          <CardHeader
            title={'個人卡片'}
          />
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              {
                ((!isLoading && profileData)
                  && (
                    Object
                      .entries(profileData)
                      .map(([field, props]) => (
                        <FormControl variant="standard"
                          style={{
                            marginBottom: '15px',
                            width: '100%'
                          }}>
                          {
                            props.labelComponentProps
                            && (
                              <InputLabel
                                variant="standard"
                                margin="normal"
                                {...props.labelComponentProps}
                              >
                                {props.labelComponentProps.label}
                              </InputLabel>
                            )
                          }
                          {
                            props.componentType === 'text'
                            && (
                              <TextField
                                {...props.componentProps}
                                value={
                                  (field in profileFields
                                    && profileFields[field])
                                  || profileData[field].defaultValue
                                }
                              />
                            )
                          }
                          {
                            props.componentType === 'sociallink-selector'
                            && (
                              <SocialLinksSelector
                                {...props.componentProps}
                                value={
                                  (field in profileFields
                                    && profileFields[field])
                                  || profileData[field].defaultValue
                                }
                              />
                            )
                          }{
                            props.componentType === 'chip-input'
                            && (
                              <ChipInput
                                {...props.componentProps}
                                value={
                                  (field in profileFields
                                    && profileFields[field])
                                  || profileData[field].defaultValue
                                }
                              />
                            )
                          }
                        </FormControl>
                      ))
                  ))
              }
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ProfileCard
