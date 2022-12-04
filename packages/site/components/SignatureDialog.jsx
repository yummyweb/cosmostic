import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Text,
    Button,
    ModalCloseButton,
} from '@chakra-ui/react'

export default function SignatureDialog({ isOpen, onClose, signature }) {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Signed Message</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Here's your signature: { signature }</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}