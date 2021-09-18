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
import Input from '@material-ui/core/Input'
import { socialLinksNames } from './socialLinksNames'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
}))

const FormDialog = ({ open, handleClose, handleSave }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    socialType: 'youtube',
    socialLink: '',
    socialLinkError: false,
  })
  const { socialType, socialLink, socialLinkError } = state
  const verifyLink = () => {
    if (!socialLink.startsWith('https://')) {
      setState({ ...state, socialLinkError: true })
      return false
    }
    setState({ ...state, socialLinkError: false })
    return true
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">新增連結</DialogTitle>
      <DialogContent>
        <DialogContentText>
          社群連結像是 YouTube、Twitch、Facebook、Twitter、Instagram。
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-social-type">社群</InputLabel>
          <Select
            labelId="select-social-type"
            id="social-type"
            value={socialType}
            onChange={({ target: { value } }) => {
              setState({ ...state, socialType: value })
            }}
            input={<Input />}
          >
            {Object.entries(socialLinksNames).map(([value, name]) => (
              <MenuItem value={value}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          className={classes.formControl}
          style={{ width: '100%' }}
        >
          <InputLabel
            id="social-link-field"
            error={socialLinkError}
          >
            連結
          </InputLabel>
          <Input
            autoFocus
            error={socialLinkError}
            margin="dense"
            labelId="social-link-field"
            id="social-link"
            type="url"
            fullWidth
            value={socialLink}
            onChange={({ target: { value } }) => {
              setState({ ...state, socialLink: value })
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          放棄
        </Button>
        <Button onClick={() => verifyLink() && handleSave(state)} color="primary">
          新增
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const EditableTextField = ({
  type,
  value,
  label,
  ariaLabel,
  onDelete,
  onChange
}) => {
  return (
    <TextField
      label={socialLinksNames[label]}
      value={value}
      margin="normal"
      fullWidth
      onChange={({ target: { value } }) => onChange(value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={['fab', type]} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={ariaLabel}
              onClick={() => onDelete()}
              edge="end"
            >
              <DeleteIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

const SocialLinksCard = () => {
  const { auth } = useAuth()
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

  const socialLinks = getPath(socialLinkPath, '')
  const error = JSON.stringify(getPathError(socialLinkPath))
  const isLoading = isPathLoading(socialLinkPath)

  useEffect(() => {
    if (auth) {
      const { uid } = auth
      setSocialLinkPath(`users/${uid}/social_links`)
    }
  }, [auth])

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
      <FormDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false)
        }}
        handleSave={(savedLink) => {
          setOpenDialog(false)
          const newSocialLink = { [savedLink.socialType]: savedLink.socialLink };
          (async () => {
            await firebaseApp
              .database()
              .ref(socialLinkPath)
              .push(newSocialLink)
          })()
        }}
      />
      {isLoading && `loading: ${isLoading}`}
      {!isLoading && (
        <Card
          style={{ width: '100%' }}
        >
          <CardHeader
            title={'社群連結'}
            action={
              <IconButton
                aria-label="settings"
                onClick={() => setOpenDialog(true)}
              >
                <AddCircleIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
        
              {
                (!socialLinks && (
                  <Typography variant="caption" align="center">
                    還沒有社群連結，按右上方按鈕新增
                  </Typography>
                ))
                || Object.entries(socialLinks)
                  .map(([id, value]) => {
                    let [type, link] = Object.entries(value)[0]
                    return (
                      <EditableTextField
                        type={type}
                        value={link}
                        label={type}
                        ariaLabel={type}
                        onDelete={() => {
                          (
                            async () => firebaseApp
                              .database()
                              .ref(`${socialLinkPath}/${id}`)
                              .remove()
                          )()
                        }}
                        onChange={(value) => {
                          (
                            async () => firebaseApp
                              .database()
                              .ref(`${socialLinkPath}/${id}/${type}`)
                              .set(value)
                          )()
                        }}
                      />
                    )
                  })
              }
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default SocialLinksCard


