import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { 
    KeyHelper, 
    SignedPublicPreKeyType, 
    SignalProtocolAddress, 
    SessionBuilder, 
    PreKeyType, 
    SessionCipher, 
    MessageType } 
from '@privacyresearch/libsignal-protocol-typescript'


import './App.css'
import { Paper, Grid, Avatar, Typography, Button,  Chip, TextField } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';

import {SignalProtocolStore} from './storage-type'
import { SignalDirectory } from './signal-directory'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: '90%',
    },
    image: {
        width: 128,
        height: 128,
    },
    container: {
        padding: theme.spacing(2)
    },
    buttonitem: {
        margin: 10,
        padding: 10,
    },
    message: {
        padding: 10,
        backgroundColor: 'lightsteelblue',
        margin: 10,
        maxWidth: '90%',
        textAlign: 'left',
    },
    outgoingmessage: {
        padding: 10,
        backgroundColor: 'linen',
        margin: 10,
        maxWidth: '90%',
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}))

interface ChatMessage {
    id: number
    to: string
    from: string
    message: MessageType
    delivered: boolean
}
interface ProcessedChatMessage {
    id: number
    to: string
    from: string
    messageText: string
}
let msgID = 0

function getNewMessageID(): number {
    return msgID++
}

// define addresses

const adolfAddress = new SignalProtocolAddress('adalheid', 1)
const borisAddress = new SignalProtocolAddress('brünhild', 1)

function App() {
    const [adiStore] = useState(new SignalProtocolStore())
    const [borisStore] = useState(new SignalProtocolStore())

    const [aHasIdentity, setAHasIdentity] = useState(false)
    const [bHasIdentity, setBHasIdentity] = useState(false)
    
    const [directory] = useState(new SignalDirectory())
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [processedMessages, setProcessedMessages] = useState<ProcessedChatMessage[]>([])

    const [hasSession, setHasSession] = useState(false)

    const [adolfTyping, setAdolfTyping] = useState('')
    const [borisTyping, setBorisTyping] = useState('')

    const [processing, setProcessing] = useState(false)

    const classes = useStyles()

    const sendMessage = (to: string, from: string, message: MessageType) => {
        const msg = {to, from, message, delivered: false, id: getNewMessageID()}
        setMessages([...messages, msg])
    }

    useEffect( () => {
        if(!messages.find(m => !m.delivered) || processing) {
            return
        }

        const getReceivingSessionCipherForRecipient = (to: string) => {
            // send from Brünhild to Adalheid so use his store
            const store = to === 'brünhild' ? borisStore : adiStore
            const address = to === 'brünhild' ? adolfAddress : borisAddress
            return new SessionCipher(store, address)
        }

        const doProcessing = async () => {
            while(messages.length > 0) {
                const nextMsg = messages.shift()
                if(!nextMsg) {
                    continue
                }
                const cipher = getReceivingSessionCipherForRecipient(nextMsg.to)
                const processed = await readMessage(nextMsg, cipher)
                processedMessages.push(processed)
            }
            setMessages([...messages])
            setProcessedMessages([...processedMessages])
        }
        setProcessing(true)
        doProcessing().then(() => {
            setProcessing(false)
        })
    }, [adiStore, borisStore, messages, processedMessages, processing])

    
    const readMessage = async (msg: ChatMessage, cipher: SessionCipher) => {
        let plaintext: ArrayBuffer = new Uint8Array().buffer
        if(msg.message.type === 3) {
            console.log({msg})
            plaintext = await cipher.decryptPreKeyWhisperMessage(msg.message.body!, 'binary')
            setHasSession(true)
        } else if(msg.message.type === 1) {
            plaintext = await cipher.decryptWhisperMessage(msg.message.body!, 'binary')
        }
        const stringPlaintext =  new TextDecoder().decode(new Uint8Array(plaintext)) 
        console.log(stringPlaintext)

        const {id, to, from} = msg
        return {id, to, from, messageText: stringPlaintext}

    }

    const storeSomewhereSafe = (store: SignalProtocolStore) => (key: string, value: any) => {
        store.put(key, value)
    }

    const createID = async (name: string, store: SignalProtocolStore) => {
        const registrationId = KeyHelper.generateRegistrationId()
        // Store registrationId somewhere durable and safe... Or do this.
        storeSomewhereSafe(store)(`registrationID`, registrationId)

        const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
        // Store identityKeyPair somewhere durable and safe... Or do this.
        storeSomewhereSafe(store)('identityKey', identityKeyPair)

        const baseKeyId = Math.floor(10000*Math.random())
        const preKey = await KeyHelper.generatePreKey(baseKeyId)
        store.storePreKey(`${baseKeyId}`, preKey.keyPair)

        const signedPreKeyId = Math.floor(10000*Math.random())
        const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
        store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
        const publicSignedPreKey: SignedPublicPreKeyType = {
            keyId: signedPreKeyId,
            publicKey: signedPreKey.keyPair.pubKey,
            signature: signedPreKey.signature
        }

        // Now we register this with the server so all users can see them
        const publicPreKey : PreKeyType = {
            keyId: preKey.keyId,
            publicKey: preKey.keyPair.pubKey
        }
        directory.storeKeyBundle(
            name, 
            {
                registrationId,
                identityPubKey: identityKeyPair.pubKey, 
                signedPreKey: publicSignedPreKey, 
                oneTimePreKeys: [publicPreKey]
            }
        )
    }

    const createAdolfIdentity = async () => {
        await createID('adalheid', adiStore)
        console.log({adiStore})
        setAHasIdentity(true)
    }

    const createBorisIdentity = async () => {
        await createID('brünhild', borisStore)
        setBHasIdentity(true)
    }

    const starterMessageBytes = Uint8Array.from([0xce, 0x93, 0xce, 0xb5, 0xce, 0xb9, 0xce, 0xac, 0x20, 0xcf, 0x83, 0xce, 0xbf, 0xcf, 0x85])

    const startSessionWithBoris = async () => {
        // get Brünhild' key bundle
        const borisBundle = directory.getPreKeyBundle('brünhild')
        console.log({borisBundle})

        const recipientAddress = borisAddress

        // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
        const sessionBuilder = new SessionBuilder(adiStore, recipientAddress)

        // Process a prekey fetched from the server. Returns a promise that resolves
        // once a session is created and saved in the store, or rejects if the
        // identityKey differs from a previously seen identity for this address.
        console.log('adalheid processing prekey')
        await sessionBuilder.processPreKey(borisBundle!)

        // Now we can send an encrypted message
        const adolfSessionCipher = new SessionCipher(adiStore, recipientAddress)
        const ciphertext = await adolfSessionCipher.encrypt(starterMessageBytes.buffer)

        sendMessage('brünhild', 'adalheid', ciphertext)
    
    }

    const startSessionWithAdolf = async () => {
        // get Adalheid's key bundle
        const adolfBundle = directory.getPreKeyBundle('adalheid')
        console.log({adolfBundle})

        const recipientAddress = adolfAddress

        // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
        const sessionBuilder = new SessionBuilder(borisStore, recipientAddress)

        // Process a prekey fetched from the server. Returns a promise that resolves
        // once a session is created and saved in the store, or rejects if the
        // identityKey differs from a previously seen identity for this address.
        console.log('brünhild processing prekey')
        await sessionBuilder.processPreKey(adolfBundle!)

        // Now we can send an encrypted message
        const borisSessionCipher = new SessionCipher(borisStore, recipientAddress)
        const ciphertext = await borisSessionCipher.encrypt(starterMessageBytes.buffer)

        sendMessage('adalheid', 'brünhild', ciphertext)
    
    }

    const displayMessages = (sender: string) => {
        return processedMessages
            .map(m => (
                <React.Fragment>
                    {m.from === sender ? <Grid xs={2} item /> : <div /> }
                    <Grid xs={10} item key={m.id}>
                        <Paper className={m.from ===  sender ? classes.outgoingmessage : classes.message}>
                            <Typography variant="body1">{m.messageText}</Typography>
                        </Paper>
                    </Grid>
                    {m.from !== sender ? <Grid xs={2} item /> : <div /> }
                </React.Fragment>
            ))
    }

    const getSessionCipherForRecipient = (to: string) => {
        // send from Brünhild to adalheid so use his store
        const store = to === 'adalheid' ? borisStore : adiStore
        const address = to === 'adalheid' ? adolfAddress : borisAddress
        return new SessionCipher(store, address)
    }

    const encryptAndSendMessage = async (to: string, message: string) => {
        const cipher = getSessionCipherForRecipient(to)
        const from = to === 'adalheid' ? 'brünhild' : 'adalheid'
        const ciphertext = await cipher.encrypt(new TextEncoder().encode(message).buffer)
        if(from === 'adalheid') {
            setAdolfTyping('')
        } else {
            setBorisTyping('')
        }
        sendMessage(to, from, ciphertext)
    }

    const sendMessageControl = (to: string) => {
        const value = to === 'adalheid' ? borisTyping: adolfTyping
        const onTextChange = to === 'adalheid' ? setBorisTyping: setAdolfTyping
        return <Grid item xs={12} key='input'>
            <Paper className={classes.paper}>
                <TextField
                    id="outlined-multiline-static"
                    label={`Message ${to}`}
                    multiline
                    value={value}
                    onChange={(event) => {onTextChange(event.target.value)}}
                    variant="outlined">
                </TextField>
                <Button onClick={() => encryptAndSendMessage(to, value)} variant='contained' className={classes.buttonitem}> <SendIcon/></Button>
            </Paper>
        </Grid>
    }

    return (
        <div className="App">
            <Paper className={classes.paper}>
                <Grid container spacing={2} className={classes.container}>
                    <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography variant="h5" style={{textAlign:'right', verticalAlign:'top'}} gutterBottom >Adalheid's View</Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={2}>
                                <Avatar>A</Avatar>
                            </Grid>
                            <Grid item xs={12}>
                                {aHasIdentity ? 
                                <React.Fragment>
                                    <Chip label={`Adalheid Registration ID: ${ adiStore.get('registrationID', '') }`}></Chip>
                                    {hasSession || !(aHasIdentity && bHasIdentity) 
                                        ? <div /> 
                                        : <Button className={classes.buttonitem} variant='contained' onClick={startSessionWithBoris}>
                                            Start session with Brünhild
                                          </Button>}
                                </React.Fragment>
                                : <Button className={classes.buttonitem} variant='contained' onClick={createAdolfIdentity}>Create an identity for Adalheid</Button>}
                            </Grid>
                             {hasSession ? sendMessageControl('brünhild'): <div/>}
                            {displayMessages('adalheid')}
                        </Grid>
                    </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper  className={classes.paper}>
                            <Typography variant="h3" component="h3" gutterBottom>
                                Adalheid talks to Brünhild
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper  className={classes.paper}>
                        <Grid container>
                            <Grid item xs={2}>
                                <Avatar>B</Avatar>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h5" style={{textAlign:'left', verticalAlign:'top'}} gutterBottom >Brünhild's View</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {bHasIdentity ? 
                                <React.Fragment>
                                    <Chip label={`Brünhild's Registration ID: ${ borisStore.get('registrationID', '') }`}></Chip>
                                    {hasSession || !(aHasIdentity && bHasIdentity)
                                        ? <div /> 
                                        : <Button className={classes.buttonitem} variant='contained' onClick={startSessionWithAdolf}>
                                            Start session with Adalheid
                                          </Button>}
                                </React.Fragment>
                                : <Button variant='contained' onClick={createBorisIdentity}>Create an identity for Brünhild</Button>}
                             </Grid>
                             {hasSession ? sendMessageControl('adalheid') : <div/>}
                            {displayMessages('brünhild')}
                         </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default App
