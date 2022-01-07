import React, { useState } from 'react'
import useStyles from '../../styles'

import { createIdentity } from '../functions'

export default function CreateIdentity(): JSX.Element {
    const [username, setUsername] = useState('')
    const [url, setUrl] = useState('https://x94jzhh4el.execute-api.us-west-2.amazonaws.com/temp')
    const [wss, setWss] = useState('wss://56f7nk7zkg.execute-api.us-west-2.amazonaws.com/temp')
    const [apiKey, setApiKey] = useState('y3Qugm4ahC19oBjKObTYO2oSDNB5jcAE1QrzFRzz')

    const classes = useStyles()

    const createID = async () => {
        await createIdentity(username, url, wss, apiKey)
    }

    return (
        <div className={classes.inputset}>
            <div className={classes.inputitem}>
                <label htmlFor="username" className={classes.label}>
                    Username:
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(event) => {
                        setUsername(event.target.value)
                    }}
                />
            </div>
            <div className={classes.inputitem}>
                <label htmlFor="url" className={classes.label}>
                    REST API URL:
                </label>
                <input
                    type="text"
                    name="url"
                    id="url"
                    value={url}
                    onChange={(event) => {
                        setUrl(event.target.value)
                    }}
                />
            </div>
            <div className={classes.inputitem}>
                <label htmlFor="wss" className={classes.label}>
                    Websocket URI:
                </label>
                <input
                    type="text"
                    name="wss"
                    id="wss"
                    value={wss}
                    onChange={(event) => {
                        setWss(event.target.value)
                    }}
                />
            </div>
            <div className={classes.inputitem}>
                <label htmlFor="apikey" className={classes.label}>
                    API Key:
                </label>
                <input
                    type="text"
                    name="apikey"
                    id="apikey"
                    value={apiKey}
                    onChange={(event) => {
                        setApiKey(event.target.value)
                    }}
                />
            </div>
            <div>
                <button onClick={createID} className={classes.buttonitem}>
                    Create Identity
                </button>
            </div>
        </div>
    )
}
