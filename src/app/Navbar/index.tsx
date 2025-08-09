"use client";
import { Button, Link, Navbar, NavbarBrand, NavbarContent, Image, NavbarItem, useDisclosure, ModalBody, Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
export const CustomNavbar = () => {
    const { select, wallets, wallet, connected, disconnect } = useWallet()
    const { onClose, onOpenChange, onOpen, isOpen } = useDisclosure()
    const router = useRouter();
    return (
        <>
            <Navbar>
                <NavbarBrand>
                    <p className="font-bold text-inherit">AMM with Transfer Hook</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link as={"button"} color="foreground" onPress={() => router.push("/create-spl")}>
                            Create SPL Token
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link aria-current="page" onPress={() => router.push("/create-pool")} color="foreground">
                            Create Pool
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" onPress={() => router.push("/add-liquidity")}>
                            Add Liquidity
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" onPress={() => router.push("/swap")}>
                            Swap
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button color="primary" variant="flat" onPress={
                            () => {
                                onOpen()
                            }
                        }>
                            {
                                connected ? (
                                    <div className="flex items-center gap-2">
                                    <Image
                                        src={wallet?.adapter.icon}
                                        alt={wallet?.adapter.name}
                                        className="w-5 h-5"
                                    />
                                    <span>{
                                    wallet?.adapter.publicKey?.toBase58().slice(0, 6) + "..." + wallet?.adapter.publicKey?.toBase58().slice(-4)
                                        }</span>
                                    </div>
                                ) : (
                                    "Connect Wallet"
                                )
                            }
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        Select a Wallet
                    </ModalHeader>
                    <ModalBody>
                        {
                            wallets.length > 0 ? (
                                wallets.map((wallet, index) => (
                                    <Button key={index} onPress={() => {
                                        select(wallet.adapter.name)
                                        onClose()
                                    }} fullWidth startContent={
                                        <Image
                                            src={wallet.adapter.icon}
                                            alt={wallet.adapter.name}
                                            className="w-5 h-5"
                                        />
                                    }>
                                        {wallet.adapter.name}
                                    </Button>
                                ))
                            ) : (
                                <p>No wallets available</p>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button fullWidth color="danger" onPress={
                            disconnect
                        }>
                            Disconnect
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}   