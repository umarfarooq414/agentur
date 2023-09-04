import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { Button } from 'react-bootstrap-v5'
import { Typography } from '@mui/material'
import { typeOf } from 'react-is'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageRow: {
      display: 'flex',
      paddingLeft: '20px',
    },
    messageRowRight: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: '20px',
    },
    wrapForm: {
      display: 'flex',
      justifyContent: 'center',
      width: '95%',
      margin: `${theme.spacing(0)} auto`,
    },
    wrapText: {
      width: '100%',
    },
    clear: {
      clear: 'both',
    },
    right_sec1: {
      width: '32px',
      order: 2,
    },
    // right_sec2: {
    //   float: 'left',
    // },
    right_sec2: {
      maxWidth: '60%',
      marginRight: '20px'
    },

    // button:{
    //     //
    // },
    messageBlue: {
      position: 'relative',
      marginLeft: '20px',
      marginBottom: '10px',
      padding: '10px',
      // backgroundColor: '#fff5f8',
      width: '90%',
      //   height: "50px",
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      border: '1px solid #666464',
      borderRadius: '10px',
    },
    messageOrange: {
      position: 'relative',
      // marginRight: '40px',
      marginBottom: '10px',
      padding: '10px',
      // backgroundColor: '#2d2d3f',
      width: '100%',
      // display: 'flex',
      // flexDirection: 'column',
      // maxWidth: '60%',
      //height: "50px",
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      border: '1px solid #666464',
      borderRadius: '10px',
      // maxWidth: '80%',
      // color: '#000',
    },

    messageContent: {
      padding: 0,
      margin: 0,
      maxWidth: '100%',
    },
    messageTimeStampRight: {
      position: 'absolute',
      fontSize: '.85em',
      //   fontWeight: "300",
      marginTop: '10px',
      bottom: '-3px',
      right: '5px',
    },
    orange: {
      color: '#f1416c',
      //   backgroundColor: deepOrange[500],
      backgroundColor: '#fff5f8',
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontWeight: 'bold',
    },
    lightOrange: {
      color: '#f1416c',
      backgroundColor: '#fff5f8',
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontWeight: 'bold',
    },
    avatarNothing: {
      color: 'transparent',
      backgroundColor: 'transparent',
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    displayName: {
      marginLeft: '20px',
      marginBottom: '6px',
      fontSize: '13px',
      fontWeight: 'bold',
      marginRight: '20px',
    },
    displayNameRight: {
      marginLeft: '20px',
      marginBottom: '6px',
      fontSize: '13px',
      fontWeight: 'bold',
      // marginRight: '20px',
      textAlign: 'right',
    },
    downloadButton: {
      backgroundColor: '#f1416c',
      color: 'white',
      padding: theme.spacing(1),
      borderRadius: 5,
      textTransform: 'none',
      fontWeight: 'bold',
      marginLeft: '6px',
      marginTop: '5px',
      textAlign: 'center',
      '&:hover': {
        backgroundColor: '#218838',
      },
    },
    fileName: {
      marginRight: theme.spacing(1),
    },
  })
)
//avatarが左にあるメッセージ（他人）
export const MessageLeft = (props: any) => {
  const message = props.message ? props.message : null
  const timestamp = props.timestamp ? props.timestamp : ''
  const photoURL = props.photoURL ? props.photoURL : 'dummy.js'
  const displayName = props.displayName ? props.displayName : ''
  const file = props.file ? props.file : null
  const fileName = props.fileName ? props.fileName : null
  const classes = useStyles()
  return (
    <>
      <div className={classes.messageRow}>
        <Avatar alt={displayName} className={classes.orange} src={photoURL}></Avatar>
        <div className={classes.right_sec2}>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageBlue}>
            <div>
              <p className={classes.messageContent}>{message}</p>
              {file && <FileDownloadLink file={file} fileName={fileName} />}
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  )
}
//avatarが右にあるメッセージ（自分）
export const MessageRight = (props: any) => {
  const classes = useStyles()
  const message = props.message ? props.message : null
  const timestamp = props.timestamp ? props.timestamp : ''
  const displayName = props.displayName ? props.displayName : 'You'
  const photoURL = props.photoURL ? props.photoURL : 'dummy.js'
  const file = props.file ? props.file : null
  const fileName = props.fileName ? props.fileName : null
  return (
    <>
      <div className={classes.messageRowRight}>
        <div className={classes.right_sec1}>
          <Avatar alt={displayName} className={classes.lightOrange} src={photoURL}></Avatar>
        </div>
        <div className={classes.right_sec2}>
          <div className={classes.displayNameRight}>{displayName}</div>
          <div className={classes.messageOrange}>
            <div>
              <p className={classes.messageContent}>{message}</p>
              {file && <FileDownloadLink file={file} fileName={fileName} />}
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
        <div className={classes.clear}></div>
      </div>
    </>
  )
}

const FileDownloadLink = (props: any) => {
  const file = props.file
  let url = ''
  if (typeof file === 'object') {
    const fileBlob = new Blob([file], { type: 'application/pdf' })
    url = URL.createObjectURL(fileBlob)
  } else if (typeof file === 'string') {
    url = file
  }
  const extension = props.fileName.slice(props.fileName.lastIndexOf('.'))
  const name = props.fileName.slice(0, props.fileName.lastIndexOf('.'))
  const initials = name
    .split(' ')
    .map((word: any) => word[0])
    .join('')
  const displayName = `${initials}...${extension}`
  const classes = useStyles()
  return (
    <a href={url} download target='_blank' rel='noreferrer'>
      <Button className={classes.downloadButton}>
        <Typography className={classes.fileName}>{displayName}</Typography>
      </Button>
    </a>
  )
}
