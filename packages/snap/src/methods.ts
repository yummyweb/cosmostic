import { getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import converter from "bech32-converting"
// @ts-ignore - there are no types for bcrypto
import { secp256k1 } from 'bcrypto'
// @ts-ignore - there are no types for secp256k1
// import secp256k1 from "secp256k1"
import { signWithPrivateKey } from "@lunie/cosmos-keys"
// @ts-ignore - there are no types for zondax/filecoin-signing-tools
import { transactionSignRaw } from "@zondax/filecoin-signing-tools/js"
import * as CryptoJS from 'crypto-js'
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "cudosjs";

const generateKeyPair = async () => {
    const atomNode = (await wallet.request({
        method: 'snap_getBip44Entropy',
        params: {
            coinType: 1,
        },
    }) as JsonBIP44CoinTypeNode);

    const deriveAtomAddress = await getBIP44AddressKeyDeriver(atomNode, {
        account: 0,
        change: 0
    });
    const extendedPrivateKey = await deriveAtomAddress(0);
    const publicKey = extendedPrivateKey.publicKey
    const _wallet = await DirectSecp256k1Wallet.fromKey(extendedPrivateKey.privateKeyBytes as Uint8Array, "cudos")
    const [firstAccount] = await _wallet.getAccounts();

    return {
        publicKey,
        privateKey: extendedPrivateKey.privateKey,
        address: firstAccount.address,
        privateKeyArray: extendedPrivateKey.privateKeyBytes
    }
}

export const getAddress = async () => {
    const snapState = await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    });

    if (snapState === null) {
        const { publicKey, privateKey, privateKeyArray, address } = await generateKeyPair()

        await wallet.request({
            method: 'snap_manageState',
            params: ['update', {
                account: {
                    address: address,
                    privKey: privateKey,
                    pubKey: publicKey,
                    privKeyArray: privateKeyArray
                }
            }],
        });

        return address
    }

    return snapState?.account?.address
}

export const getPubKey = async () => {
    const snapState = await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    });

    if (snapState === null) {
        const { publicKey, privateKey, address } = await generateKeyPair()

        // const { cosmosAddress, privateKey, publicKey } = getNewWallet()

        await wallet.request({
            method: 'snap_manageState',
            params: ['update', {
                account: {
                    address: address,
                    privKey: privateKey,
                    pubKey: publicKey
                }
            }],
        });

        return publicKey
    }

    return snapState?.account?.pubKey
}

export const getPrivKey = async () => {
    const snapState = await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    });

    if (snapState === null) {
        const { publicKey, privateKey, address } = await generateKeyPair()

        // const { cosmosAddress, privateKey, publicKey } = getNewWallet()

        await wallet.request({
            method: 'snap_manageState',
            params: ['update', {
                account: {
                    address: address,
                    privKey: privateKey,
                    pubKey: publicKey
                }
            }],
        });

        return privateKey
    }

    return snapState?.account?.privKey
}

export const purgeAll = async () => {
    await wallet.request({
        method: "snap_manageState",
        params: ["clear"],
    });

    return null
}

export const signMessage = async (message: string) => {
    const { privateKey, privateKeyArray, address } = await generateKeyPair()

    const confirmation = await wallet.request({
        method: "snap_confirm",
        params: [
            {
                description: `It will be signed with address: ${address}`,
                prompt: `Do you want to sign this message?`,
                textAreaContent: message,
            }
        ],
    })

    if (confirmation) {
        const sig = transactionSignRaw(message, privateKeyArray)

        return {
            confirmation: true,
            signature: Buffer.from(sig).toString("hex")
        }
    }

    return {
        confirmation: false,
        signature: null
    }
}

export const getEvents = async (addr: string) => {
    let events = []
    const _res = await fetch(`https://sentry1.gcp-uscentral1.cudos.org:31317/txs?transfer.recipient=${addr}`)
    const _data = await _res.json()
    if (_data.total_count !== '0') {
        for (let i = 0; i < _data.txs.length; i++) {
            const tx = _data.txs[i];
            for (let j = 0; j < tx.logs.length; j++) {
                const log = tx.logs[j];
                for (let w = 0; w < log.events.length; w++) {
                    const event = log.events[w];
                    events.push(event)
                }
            }
        }
    }

    return events
}

export const sendTx = async (amount: number, recipient: string, message = "sent from cosmostic") => {
    const { privateKeyArray, address } = await generateKeyPair()

    const _wallet = await DirectSecp256k1Wallet.fromKey(privateKeyArray as Uint8Array, "cudos")
    const [firstAccount] = await _wallet.getAccounts();
    const client = await SigningCosmWasmClient.connectWithSigner("https://sentry1.gcp-uscentral1.cudos.org:36657", _wallet);

    const formattedAmount = {
        denom: "acudos",
        amount: amount.toString(),
    }

    const fee = {
        amount: [ {denom: "acudos", amount: "500000000000000000"}],
        gas: "100000"
    }

    const confirmation = await wallet.request({
        method: "snap_confirm",
        params: [
            {
                description: `You are sending tokens to ${recipient}`,
                prompt: `Do you want to send the tokens?`,
                textAreaContent: amount.toString() + "acudos",
            }
        ],
    })

    if (confirmation) {
        const result = await client.sendTokens(firstAccount.address, recipient, [formattedAmount], fee, message);
        return {
            success: true,
            code: result.code,
            addr: firstAccount.address
        }
    } else {
        return {
            success: false,
            code: -1,
            data: null
        }
    }
}