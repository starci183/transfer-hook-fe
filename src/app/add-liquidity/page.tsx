"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, addToast, Link } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AmmV3 } from "../../idl/ammv3";
import { TOKEN_2022_PROGRAM_ID, getExtensionTypes } from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import ammv3idl from "../../idl/ammv3-idl.json";

// Validation schema
const AddLiquiditySchema = Yup.object().shape({
  token0Mint: Yup.string()
    .required("Token 0 mint is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token 0 mint"),
  token1Mint: Yup.string()
    .required("Token 1 mint is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token 1 mint"),
  liquidity: Yup.number()
    .required("Liquidity is required")
    .min(1000, "Amount must be positive"),
  ammConfigIndex: Yup.number()
    .required("AMM configuration is required")
    .min(1, "AMM configuration must be positive"),
  tickLowerIndex: Yup.number()
    .required("Lower tick is required"),
  tickUpperIndex: Yup.number()
    .required("Upper tick is required")
    .moreThan(Yup.ref('tickLowerIndex'), "Upper tick must be greater than lower tick"),
});

const AddLiquidityPage = () => {
  const anchorWallet = useAnchorWallet();
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<anchor.Program<AmmV3>>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [poolInfo, setPoolInfo] = React.useState<any>(null);

  // Fix hydration error by only rendering client-side
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!anchorWallet || !connected) return;

    const provider = new anchor.AnchorProvider(
      connection,
      anchorWallet,
      anchor.AnchorProvider.defaultOptions()
    );
    anchor.setProvider(provider);

    const loadProgram = async () => {
      try {
        const program = new anchor.Program<AmmV3>(
          ammv3idl,
          provider
        );
        setProgram(program);
      } catch (err) {
        console.error("Failed to load program:", err);
        addToast({
          title: "Error",
          description: "Failed to load AMM V3 program",
        });
      }
    };

    loadProgram();
  }, [wallet, connected, connection]);

  const formik = useFormik({
    initialValues: {
      token0Mint: "",
      token1Mint: "",
      liquidity: "",
      ammConfigIndex: 1,
      tickLowerIndex: "-10000",
      tickUpperIndex: "10000",
    },
    validationSchema: AddLiquiditySchema,
    onSubmit: async (values) => {
      if (!program || !publicKey || !wallet) return;

      setIsLoading(true);

      try {
        const token0Mint = new PublicKey(values.token0Mint);
        const token1Mint = new PublicKey(values.token1Mint);
        const liquidity = new anchor.BN(values.liquidity);
        const ammConfigIndex = Number(values.ammConfigIndex);
        const tickLowerIndex = Number(values.tickLowerIndex);
        const tickUpperIndex = Number(values.tickUpperIndex);

        // Find amm config PDA
        const [ammConfigPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("amm_config"),
            Buffer.from(new anchor.BN(ammConfigIndex).toArray("be", 2))
          ],
          program.programId
        );

        // Find pool state PDA
        const [poolStatePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammConfigPda.toBuffer(),
            token0Mint.toBuffer(),
            token1Mint.toBuffer(),
          ],
          program.programId
        );

        // Fetch pool info
        const poolState = await program.account.poolState.fetch(poolStatePda);
        setPoolInfo(poolState);

        const TICK_ARRAY_SIZE = 60;
        const ticksPerArray = poolState.tickSpacing * TICK_ARRAY_SIZE;

        // Calculate tick array start indexes
        const tickArrayLowerStartIndex = Math.floor(tickLowerIndex / ticksPerArray) * ticksPerArray;
        const tickArrayUpperStartIndex = Math.floor(tickUpperIndex / ticksPerArray) * ticksPerArray;

        // Find tick array PDAs
        const [tickArrayLowerPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("tick_array"),
            poolStatePda.toBuffer(),
            new anchor.BN(tickArrayLowerStartIndex).toTwos(32).toArrayLike(Buffer, "be", 4),
          ],
          program.programId
        );

        const [tickArrayUpperPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("tick_array"),
            poolStatePda.toBuffer(),
            new anchor.BN(tickArrayUpperStartIndex).toTwos(32).toArrayLike(Buffer, "be", 4),
          ],
          program.programId
        );

        // Create position NFT mint
        const positionNftMint = Keypair.generate();
        const positionNftAccount = getAssociatedTokenAddressSync(
          positionNftMint.publicKey,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        // Get user token accounts
        const tokenAccount0 = getAssociatedTokenAddressSync(
          token0Mint,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        const tokenAccount1 = getAssociatedTokenAddressSync(
          token1Mint,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );
        // Open position
        const txId = await program.methods
          .openPositionWithToken22Nft(
            tickLowerIndex,
            tickUpperIndex,
            tickArrayLowerStartIndex,
            tickArrayUpperStartIndex,
            liquidity,
            new anchor.BN(1_000_000_000), // token0Amount - should be calculated
            new anchor.BN(1_000_000_000), // token1Amount - should be calculated
            true,
            true,
            3,
            3
          )
          .accounts({
            poolState: poolStatePda,
            vault0Mint: token0Mint,
            vault1Mint: token1Mint,
            tokenVault0: poolState.tokenVault0,
            tokenVault1: poolState.tokenVault1,
            payer: publicKey,
            tokenAccount0,
            tokenAccount1,
            positionNftMint: positionNftMint.publicKey,
            positionNftOwner: publicKey,
            positionNftAccount,
            protocolPosition: Keypair.generate().publicKey,
            // disable type checking
            // @ts-ignore
            tickArrayLower: tickArrayLowerPda,
            // @ts-ignore
            tickArrayUpper: tickArrayUpperPda,
          })
          .signers([positionNftMint])
          .remainingAccounts([{
            pubkey: PublicKey.findProgramAddressSync(
              [Buffer.from("counter")],
              new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq")
            )[0],
            isSigner: false,
            isWritable: true, // This should be writable to allow the transfer hook to modify the account
          },
          {
            pubkey: new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq"),
            isSigner: false,
            isWritable: true, // This should be writable to allow the transfer hook to modify the
          },
          {
            pubkey: PublicKey.findProgramAddressSync(
              [Buffer.from("extra-account-metas"), token0Mint.toBuffer()],
              new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq")
            )[0],
            isSigner: false,
            isWritable: true, // This should be writable to allow the transfer hook to modify the account
          }])
          .rpc();
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txId,
        });
        addToast({
          title: "Liquidity Added",
          description: (
            <div className="flex items-center gap-2">
              <div className="text-sm">Transaction:</div>
              <Link
                href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {txId.slice(0, 6)}...{txId.slice(-4)}
              </Link>
            </div>
          ),
        });

        formik.resetForm();
      } catch (err) {
        console.error("Failed to add liquidity:", err);
        addToast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add liquidity",
        });
      } finally {
        setIsLoading(false);
      }
    }
  });

  if (!mounted) {
    return (
      <Card className="max-w-[768px] mx-auto">
        <CardBody>
          <div className="text-center py-8">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-[768px] mx-auto">
      <CardHeader>
        <div className="text-2xl font-bold">Add Liquidity</div>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              name="token0Mint"
              placeholder="Token 0 Mint Address"
              labelPlacement="outside"
              label="Token 0 Mint Address"
              value={formik.values.token0Mint}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.token0Mint && formik.errors.token0Mint)}
              errorMessage={formik.touched.token0Mint && formik.errors.token0Mint}
              required
            />

            <Input
              name="token1Mint"
              placeholder="Token 1 Mint Address"
              labelPlacement="outside"
              label="Token 1 Mint Address"
              value={formik.values.token1Mint}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.token1Mint && formik.errors.token1Mint)}
              errorMessage={formik.touched.token1Mint && formik.errors.token1Mint}
              required
            />

            <Input
              name="liquidity"
              placeholder="Liquidity amount"
              labelPlacement="outside"
              label="Liquidity Amount"
              type="number"
              step="1000"
              min="1000"
              value={formik.values.liquidity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.liquidity && formik.errors.liquidity)}
              errorMessage={formik.touched.liquidity && formik.errors.liquidity}
              required
            />

            <Input
              name="ammConfigIndex"
              placeholder="1"
              labelPlacement="outside"
              label="AMM Config Index"
              type="number"
              step="1"
              min="1"
              value={formik.values.ammConfigIndex.toString()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.ammConfigIndex && formik.errors.ammConfigIndex)}
              errorMessage={formik.touched.ammConfigIndex && formik.errors.ammConfigIndex}
              required
            />

            <Input
              name="tickLowerIndex"
              placeholder="-10000"
              labelPlacement="outside"
              label="Lower Tick Index"
              type="number"
              value={formik.values.tickLowerIndex}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.tickLowerIndex && formik.errors.tickLowerIndex)}
              errorMessage={formik.touched.tickLowerIndex && formik.errors.tickLowerIndex}
              required
            />

            <Input
              name="tickUpperIndex"
              placeholder="10000"
              labelPlacement="outside"
              label="Upper Tick Index"
              type="number"
              value={formik.values.tickUpperIndex}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.tickUpperIndex && formik.errors.tickUpperIndex)}
              errorMessage={formik.touched.tickUpperIndex && formik.errors.tickUpperIndex}
              required
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
          isDisabled={!formik.isValid || isLoading || !connected}
          isLoading={isLoading}
        >
          {connected ? "Add Liquidity" : "Connect Wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddLiquidityPage;