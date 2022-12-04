export const connectSnap = async (
    snapId = "local:http://localhost:8080",
    params = {},
) => {
    await window.ethereum.request({
        method: 'wallet_enable',
        params: [
            {
                wallet_snap: {
                    [snapId]: {
                        ...params,
                    },
                },
            },
        ],
    });
};

export const getSnaps = async () => {
    return await window.ethereum.request({
        method: 'wallet_getSnaps',
    });
};

export const getSnap = async (version = null) => {
    try {
        const snaps = await getSnaps();
        console.log(snaps)

        return Object.values(snaps).find(
            (snap) =>
                snap.id === `local:http://localhost:8080` && (!version || snap.version === version),
        );
    } catch (e) {
        console.log('Failed to obtain installed snap', e);
        return undefined;
    }
}

export const getAddress = async () => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_getAddress"
            }
        ],
    });
}

export const getPublicKey = async () => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_getPubKey"
            }
        ],
    });
}

export const getPrivateKey = async () => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_getPrivKey"
            }
        ],
    });
}

export const clearData = async () => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_purgeData"
            }
        ],
    });
}

export const signMessage = async message => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_signMsg",
                params: { message }
            }
        ],
    });
}

export const getEvents = async address => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_getEventsByAddr",
                params: { address }
            }
        ]
    })
}

export const sendTransaction = async (amount, recipient) => {
    return await window.ethereum.request({
        method: 'wallet_snap_local:http://localhost:8080',
        params: [
            {
                method: "cosm_sendTx",
                params: { amount, recipient }
            }
        ]
    })
}