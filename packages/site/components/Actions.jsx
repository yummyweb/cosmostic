import { Container, useDisclosure, ButtonGroup, Button, Box, VStack, Input, FormControl, FormLabel } from '@chakra-ui/react'
import { getAddress, getPrivateKey, signMessage, getPublicKey, clearData, getEvents, sendTransaction } from '../utils'
import { useState, useEffect } from "react"
import SignatureDialog from './SignatureDialog';
import Cosmos from "@lunie/cosmos-api"
import TransactionTable from './TransactionTable';
import toast, { Toaster } from 'react-hot-toast';

export default function Actions() {
    const [address, setAddress] = useState("")
    const [publicKey, setPublicKey] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [signature, setSignature] = useState("")
    const [balance, setBalance] = useState("")
    const [message, setMessage] = useState("")
    const [events, setEvents] = useState([])
    const [amount, setAmount] = useState("")
    const [recipient, setRecipient] = useState("")

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        getAddress().then(async addr => {
            setAddress(addr)
            const res = await fetch(`https://sentry1.gcp-uscentral1.cudos.org:31317/cosmos/bank/v1beta1/balances/${addr}`)
            const data = await res.json()
            console.log(data)
            if (data.balances.length !== 0) {
                setBalance(data.balances[0].amount + " " + data.balances[0].denom)
            } else {
                setBalance("0 cudos")
            }

            const events = await getEvents(addr)
            setEvents(events)

            // const _res = await fetch(`https://sentry1.gcp-uscentral1.cudos.org:31317/txs?transfer.recipient=${addr}`)
            // const _data = await _res.json()
            // console.log(_data)
        })

        getPublicKey().then(pub => {
            setPublicKey(pub)
        })

        // const STARGATE_URL = "https://cors-anywhere.herokuapp.com/stargate.cosmos.network"

        // const cosmos = new Cosmos(STARGATE_URL, address)
        // console.log((async () => await cosmos.getAccount(address))())

        // Only for testing purposes:
        // getPrivateKey().then(priv => {
        //     setPrivateKey(priv)
        // })
    }, [])

    const handleClearData = () => {
        clearData()
    }

    const handleSignMessage = () => {
        signMessage(message).then(msg => {
            if (msg.confirmation) {
                setSignature(msg.signature)
                onOpen()
                setMessage("")
            } else {
                console.log("Didn't work, error happened or user rejected.")
                console.log(msg)
            }
        })
    }

    const handleSendTokens = () => {
        sendTransaction(parseInt(amount), recipient).then(res => {
            console.log(res)
            if (res.success) {
                toast.success(amount + "acudos sent successfully!")
            }
        }).catch(err => console.log(err))
    }

    return (
        <VStack width="100%">
            <FormControl>
                <FormLabel>Address</FormLabel>
                <Input value={address} isDisabled={true} />
            </FormControl>
            <FormControl>
                <FormLabel>Public Key</FormLabel>
                <Input value={publicKey} isDisabled={true} />
            </FormControl>
            <FormControl>
                <FormLabel>Balance</FormLabel>
                <Input value={balance} isDisabled={true} />
            </FormControl>
            <br />
            <Box width="100%" marginTop="50px">
                <FormControl>
                    <FormLabel>Message to Sign</FormLabel>
                    <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
                </FormControl>
            </Box>
            <br />
            <ButtonGroup spacing='6'>
                <Button onClick={() => handleSignMessage()}>Sign Message</Button>
                <Button colorScheme="red" onClick={() => handleClearData()}>Clear Data</Button>
            </ButtonGroup>
            <br />
            <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
            </FormControl>
            <br />
            <FormControl>
                <FormLabel>Recipient</FormLabel>
                <Input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient" />
            </FormControl>
            <br />
            <Button onClick={() => handleSendTokens()}>Send Tokens</Button>
            <SignatureDialog signature={signature} isOpen={isOpen} onClose={onClose} />
            <br />
            <br />
            <TransactionTable events={events} />
            <br />
            <Toaster />
        </VStack>
    )
}