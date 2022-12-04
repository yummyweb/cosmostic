import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Container, Heading, Center, Box, Text, VStack, Button } from '@chakra-ui/react'
import MetaMaskLogo from '../icons/metamask.svg';
import { useEffect, useState } from "react"
import detectEthereumProvider from '@metamask/detect-provider';
import { connectSnap, getSnap } from '../utils';
import Actions from '../components/Actions';

export default function Home() {
  const [hasFlask, setHasFlask] = useState(null)
  const [connectedSnap, setConnectedSnap] = useState(null)

  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider();

      // web3_clientVersion returns the installed MetaMask version as a string
      const isFlask = (
        await provider?.request({ method: 'web3_clientVersion' })
      )?.includes('flask');

      if (provider && isFlask) {
        setHasFlask(true)
      } else {
        setHasFlask(false)
      }
    })()
  }, [])

  const handleConnection = () => {
    connectSnap().then(async () => {
      getSnap().then(snap => {
        console.log(snap)
        if (snap === undefined) {
          alert("Something wrong happened. Could not get snap.")
          console.log(snap)
        } else {
          setConnectedSnap(snap)
        }
      })
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Cosmostic Demo - Cosmos Snap for MetaMask</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container height="90vh">
        <Box marginTop={50}>
          <Center>
            <VStack align="stretch" spacing={12}>
              <VStack>
                <Heading fontSize={40}>Cosmostic Demo App</Heading>
                <Text fontSize={22} color="gray.500">A Cosmos Wallet inside MetaMask using Snaps.</Text>
              </VStack>
              <Center>
                {
                  !connectedSnap ? (
                    <Button onClick={() => handleConnection()} isDisabled={!hasFlask} leftIcon={<Image width={30} src={MetaMaskLogo} />} bgColor="white" border="2px" borderColor="orange.500">{hasFlask ? "Connect to MetaMask" : "Please install MetaMask Flask"}</Button>
                  ) : (
                    <Actions />
                  )
                }
              </Center>
            </VStack>
          </Center>
        </Box>
        <>{!connectedSnap ? (<Center><Text fontWeight="bold" fontSize="24px" position="absolute" bottom={5}>Powered by MetaMask & Cudos</Text></Center>) : null}</>
      </Container>
    </div>
  )
}