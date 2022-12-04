import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

export default function TransactionTable({ events }) {
    return (
        <TableContainer width="60vw">
            <Table variant='simple'>
                <TableCaption>Transactions</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Event Type</Th>
                        <Th>Reciever/Spender</Th>
                        <Th>Value</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {events.map(ev => (<>{ev.type !== "message" ? (
                        <Tr>
                            <Td>{ ev.type }</Td>
                            <Td>{ ev.attributes[0].value }</Td>
                            <Td>{ ev.attributes[1].value }</Td>
                        </Tr>
                    ) : null}</>))}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Event Type</Th>
                        <Th>Reciever/Spender</Th>
                        <Th>Value</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}