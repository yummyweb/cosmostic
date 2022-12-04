import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getAddress, getPrivKey, getPubKey, purgeAll, signMessage, getEvents, sendTx } from './methods';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'cosm_getAddress':
      return await getAddress();
    case 'cosm_getPubKey':
      return await getPubKey();
    // case 'cosm_getPrivKey':
    //   return await getPrivKey();
    case 'cosm_purgeData':
      return await purgeAll();
    case 'cosm_signMsg':
      return await signMessage(request.params?.message);
    case 'cosm_getEventsByAddr':
      return await getEvents(request.params?.address)
    case 'cosm_sendTx':
      return await sendTx(request.params?.amount, request.params?.recipient)
    default:
      throw new Error('Method not found.');
  }
};
