"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, addToast, Link } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createInitializeTransferHookInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddress, getMintLen, getOrCreateAssociatedTokenAccount, LENGTH_SIZE, MINT_SIZE, mintTo, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    createInitializeInstruction,
    createUpdateFieldInstruction,
    pack,
    TokenMetadata,
} from "@solana/spl-token-metadata";

// Validation schema
const TokenSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .max(32, "Name must be at most 32 characters"),
    symbol: Yup.string()
        .required("Symbol is required")
        .max(10, "Symbol must be at most 10 characters"),
    decimals: Yup.number()
        .required("Decimals is required")
        .min(0, "Decimals must be at least 0")
        .max(9, "Decimals must be at most 9"),
    logo: Yup.string()
        .required("Logo is required")
});

const Page = () => {
    const { wallet } = useWallet()
    const { connection } = useConnection();
    const formik = useFormik({
        initialValues: {
            name: "",
            symbol: "",
            decimals: "",
            logo: "",
            transferHook: "",
        },
        validationSchema: TokenSchema,
        onSubmit: async (values) => {
            const mint = Keypair.generate();
            const metadataJson = {
                name: values.name,
                symbol: values.symbol,
                image: values.logo,
                description: "This is a custom SPL token created with Transfer Hook",
                attributes: [],
            };
            const res = await fetch("/api/uploadToPinata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(metadataJson),
            });
            const { uri } = await res.json();
            const metadata: TokenMetadata = {
                name: values.name,
                symbol: values.symbol,
                uri,
                mint: mint.publicKey,
                additionalMetadata: [
                    ["description", "This is a custom SPL token created with Transfer Hook"],
                ]
            };
            const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
            const metadataLen = pack(metadata).length;

            // Định nghĩa extensions
            const extensions = [ExtensionType.MetadataPointer];
            if (values.transferHook) {
                extensions.unshift(ExtensionType.TransferHook);
            }
            const mintLen = getMintLen(extensions);
            const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen + metadataExtension);

            // Tạo transaction
            const tx = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet?.adapter.publicKey!,
                    newAccountPubkey: mint.publicKey,
                    space: mintLen,
                    lamports: mintLamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                })
            );

            //Init TransferHook (nếu có)
            if (values.transferHook) {
                tx.add(
                    createInitializeTransferHookInstruction(
                        mint.publicKey,
                        wallet?.adapter.publicKey!,
                        new PublicKey(values.transferHook),
                        TOKEN_2022_PROGRAM_ID
                    )
                );
            }

            // // Init MetadataPointer
            tx.add(
                createInitializeMetadataPointerInstruction(
                    mint.publicKey,
                    wallet?.adapter.publicKey!,
                    mint.publicKey, // metadata account chính là mint account
                    TOKEN_2022_PROGRAM_ID
                )
            );

            // // Init Mint
            tx.add(
                createInitializeMintInstruction(
                    mint.publicKey,
                    parseInt(values.decimals, 10),
                    wallet?.adapter.publicKey!,
                    null,
                    TOKEN_2022_PROGRAM_ID
                )
            );

            // // Init Metadata
            tx.add(
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mint.publicKey,
                    mintAuthority: wallet?.adapter.publicKey!,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri,
                    updateAuthority: wallet?.adapter.publicKey!,
                    metadata: mint.publicKey,
                })
            );

            // Update field 
            tx.add(
                createUpdateFieldInstruction({
                    programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
                    metadata: mint.publicKey, // Account address that holds the metadata
                    updateAuthority: wallet?.adapter.publicKey!, // Authority that can update the metadata
                    field: metadata.additionalMetadata[0][0], // key
                    value: metadata.additionalMetadata[0][1], // value
                })
            )
            try {
                const sig = await wallet?.adapter.sendTransaction(tx, connection, {
                    signers: [mint],
                    preflightCommitment: "confirmed",
                });

                addToast({
                    title: "Token Created",
                    description: (
                        <div className="flex items-center gap-2">
                            <div className="text-sm">Tx</div>
                            <Link
                                href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
                                target="_blank"
                                className="text-blue-500 hover:underline"
                            >
                                {sig?.slice(0, 6)}...{sig?.slice(-4)}
                            </Link>
                        </div>
                    ),
                });
                const fetchAta = await getAssociatedTokenAddress(
                    mint.publicKey,
                    wallet?.adapter.publicKey!,
                    true,
                    TOKEN_2022_PROGRAM_ID
                );
                // create ata
                const ata = createAssociatedTokenAccountInstruction(
                    wallet?.adapter.publicKey!,
                    fetchAta,
                    wallet?.adapter.publicKey!,
                    mint.publicKey,
                    TOKEN_2022_PROGRAM_ID
                );
                // send transaction
                const tx2 = new Transaction().add(ata);
                await wallet?.adapter.sendTransaction(tx2, connection, {
                    preflightCommitment: "confirmed",
                });
                addToast({
                    title: "Associated Token Account Created",
                    description: (
                        <div className="flex items-center gap-2">
                            <div className="text-sm">Tx</div>
                            <Link
                                href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
                                target="_blank"
                                className="text-blue-500 hover:underline"
                            >
                                {sig?.slice(0, 6)}...{sig?.slice(-4)}
                            </Link>
                        </div>
                    ),
                });
                console.log("fetchAta", fetchAta.toBase58());
                // after that, mint 1m tokens
                const mintInstruction = createMintToInstruction(
                    mint.publicKey,
                    fetchAta,
                    wallet?.adapter.publicKey!,
                    BigInt(1_000_000_000),
                    [],
                    TOKEN_2022_PROGRAM_ID
                );
                const mintTx = new Transaction().add(mintInstruction);
                await wallet?.adapter.sendTransaction(mintTx, connection, {
                    preflightCommitment: "confirmed",
                });
                addToast({
                    title: "Mint 1k tokens",
                    description: (
                        <div className="flex items-center gap-2">
                            <div className="text-sm">Tx</div>
                            <Link
                                href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
                                target="_blank"
                                className="text-blue-500 hover:underline"
                            >
                                {sig?.slice(0, 6)}...{sig?.slice(-4)}
                            </Link>
                        </div>
                    ),
                });
            } catch (err: any) {
                console.error("Transaction failed:", err);
                if (!err.logs) {
                    const sim = await connection.simulateTransaction(tx, [mint]);
                    console.error("Simulation logs:", sim.value.logs);
                } else {
                    console.error("Program logs:", err.logs);
                }
            }
        }
    });
    console.log(formik.errors)

    return (
        <Card className="max-w-[768px] mx-auto">
            <CardHeader>
                <div className="text-2xl font-bold">Create SPL Token</div>
            </CardHeader>
            <CardBody>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Input
                            name="name"
                            placeholder="USD Coin"
                            labelPlacement="outside"
                            label="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.name && formik.errors.name)}
                            errorMessage={formik.touched.name && formik.errors.name}
                            required
                        />
                        <Input
                            name="symbol"
                            placeholder="USDC"
                            labelPlacement="outside"
                            label="Symbol"
                            value={formik.values.symbol}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.symbol && formik.errors.symbol)}
                            errorMessage={formik.touched.symbol && formik.errors.symbol}
                            required
                        />
                        <Input
                            name="decimals"
                            placeholder="6"
                            labelPlacement="outside"
                            label="Decimals"
                            type="number"
                            value={formik.values.decimals}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.decimals && formik.errors.decimals)}
                            errorMessage={formik.touched.decimals && formik.errors.decimals}
                            required
                        />
                        <Input
                            name="logo"
                            placeholder="https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/468551698_551419647787337_4757030506567463756_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEQZqiNTlgN6xrWNIzllh6sxNcAvDPnxmXE1wC8M-fGZTu0p6avkvCwAxGlbqbHhzsxeR0VcGjhyEhCbZOCAroB&_nc_ohc=n3g6Xa3XeSIQ7kNvwF0suo9&_nc_oc=AdnkOU3PnAoPSGeLgT5cJjok_OokO_Nokn2hCqLoy9GE2LOFj63IPu2cOUobI4VbtmSCRE2joTOjkxSBjbxG4cKw&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=v7VTo3YbEok1M5wdTIb8zg&oh=00_AfV9h44UUoKQAmOz-09ykF1PzypYFrepg9UC4sXsMhHZ5g&oe=689CC21E"
                            labelPlacement="outside"
                            label="Logo URL"
                            value={formik.values.logo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.logo && formik.errors.logo)}
                            errorMessage={formik.touched.logo && formik.errors.logo}
                            required
                        />
                        <Input
                            name="transferHook"
                            placeholder="Transfer Hook Address (optional)"
                            type="text"
                            labelPlacement="outside"
                            label="Transfer Hook Address"
                            value={formik.values.transferHook}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.transferHook && formik.errors.transferHook)}
                            errorMessage={formik.touched.transferHook && formik.errors.transferHook}
                        />
                    </div>
                </form>
            </CardBody>
            <CardFooter>
                <Button
                    onPress={() => formik.handleSubmit()}
                    type="submit"
                    color="primary"
                    className="w-full"
                    isDisabled={!formik.isValid || formik.isSubmitting}
                >
                    Create Token
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Page;