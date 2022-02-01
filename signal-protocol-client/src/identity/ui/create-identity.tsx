import React, { useState, useRef, useEffect } from 'react'

import { createIdentity } from '../functions'

export default function CreateIdentity(): JSX.Element {
    const [username, setUsername] = useState('')
    const [url, setUrl] = useState('https://x94jzhh4el.execute-api.us-west-2.amazonaws.com/temp')
    const [wss, setWss] = useState('wss://56f7nk7zkg.execute-api.us-west-2.amazonaws.com/temp')
    const [apiKey, setApiKey] = useState('')

    const unameRef = useRef<HTMLInputElement | null>(null)
    const apiRef = useRef<HTMLInputElement | null>(null)
    const wssRef = useRef<HTMLInputElement | null>(null)
    const apiKeyRef = useRef<HTMLInputElement | null>(null)
    const submitRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        unameRef.current?.focus()
    }, [])

    const createID = async () => {
        await createIdentity(username, url, wss, apiKey)
    }

    const nextOnTab = (nextRef: React.MutableRefObject<HTMLInputElement | HTMLButtonElement | null>) => (e : React.KeyboardEvent) => {
        if(e.key === 'Tab') {
            e.preventDefault()
            nextRef.current?.focus()
        }
    }
    return (
        <div className="inputset">
            <div className="inputitem">
                <label htmlFor="username" className="label">
                    Username:
                </label>
                <input
                    ref={unameRef}
                    onKeyDown={nextOnTab(apiRef)}
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(event) => {
                        setUsername(event.target.value)
                    }}
                />
            </div>
            <div className="inputitem">
                <label htmlFor="url" className="label">
                    REST API URL:
                </label>
                <input
                    ref={apiRef}
                    onKeyDown={nextOnTab(wssRef)}
                    type="text"
                    name="url"
                    id="url"
                    value={url}
                    onChange={(event) => {
                        setUrl(event.target.value)
                    }}
                />
            </div>
            <div className="inputitem">
                <label htmlFor="wss" className="label">
                    Websocket URI:
                </label>
                <input
                    ref={wssRef}
                    onKeyDown={nextOnTab(apiKeyRef)}
                    type="text"
                    name="wss"
                    id="wss"
                    value={wss}
                    onChange={(event) => {
                        setWss(event.target.value)
                    }}
                />
            </div>
            <div className="inputitem">
                <label htmlFor="apikey" className="label">
                    API Key:
                </label>
                <input
                    ref={apiKeyRef}
                    onKeyDown={nextOnTab(submitRef)}
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
                <button ref={submitRef}
                    onKeyDown={nextOnTab(unameRef)} onClick={createID} className="buttonitem">
                    Create Identity
                </button>
            </div>
        </div>
    )
}
