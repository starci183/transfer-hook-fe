"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, addToast, Link, Alert } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AmmV3 } from "../../idl/ammv3";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import ammv3idl from "../../idl/ammv3-idl.json";

// Validation schema
const SwapSchema = Yup.object().shape({
  inputTokenMint: Yup.string()
    .required("Input token mint is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token mint"),
  outputTokenMint: Yup.string()
    .required("Output token mint is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token mint"),
  amountIn: Yup.number()
    .required("Amount is required")
    .min(0.000001, "Amount must be positive"),
  amountOutMin: Yup.number()
    .required("Minimum amount out is required")
    .min(0.000001, "Amount must be positive"),
  isBaseInput: Yup.boolean()
    .required("Trade direction is required"),
});

const SwapPage = () => {
  const anchorWallet = useAnchorWallet();
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<anchor.Program<AmmV3>>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [poolInfo, setPoolInfo] = React.useState<any>(null);

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
      inputTokenMint: "",
      outputTokenMint: "",
      amountIn: "",
      amountOutMin: "",
      isBaseInput: true,
    },
    validationSchema: SwapSchema,
    onSubmit: async (values) => {
      if (!program || !publicKey || !wallet) return;

      setIsLoading(true);

      try {
        const inputTokenMint = new PublicKey(values.inputTokenMint);
        const outputTokenMint = new PublicKey(values.outputTokenMint);
        const amountIn = new anchor.BN(Number(values.amountIn) * 10**6); // Adjust for decimals
        const amountOutMin = new anchor.BN(Number(values.amountOutMin) * 10**6); // Adjust for decimals
        const isBaseInput = values.isBaseInput;

        // Find amm config PDA (using default index 1)
        const ammConfigIndex = 1;
        const [ammConfigPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("amm_config"),
            Buffer.from(new anchor.BN(ammConfigIndex).toArray("be", 2))
          ],
          program.programId
        );

        // Find pool state PDA - need to determine token order
        const token0 = inputTokenMint.toBuffer().compare(outputTokenMint.toBuffer()) < 0 
          ? inputTokenMint 
          : outputTokenMint;
        const token1 = inputTokenMint.toBuffer().compare(outputTokenMint.toBuffer()) < 0 
          ? outputTokenMint 
          : inputTokenMint;

        const [poolStatePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammConfigPda.toBuffer(),
            token0.toBuffer(),
            token1.toBuffer(),
          ],
          program.programId
        );

        // Get vaults
        const poolState = await program.account.poolState.fetch(poolStatePda);
        setPoolInfo(poolState);

        // Get user token accounts
        const inputTokenAccount = getAssociatedTokenAddressSync(
          inputTokenMint,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        const outputTokenAccount = getAssociatedTokenAddressSync(
          outputTokenMint,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        // Determine input/output vaults based on token order
        const inputVault = inputTokenMint.equals(token0) 
          ? poolState.tokenVault0 
          : poolState.tokenVault1;
        const outputVault = outputTokenMint.equals(token0) 
          ? poolState.tokenVault0 
          : poolState.tokenVault1;

        // Find observation state PDA
        const [observationStatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("observation"), poolStatePda.toBuffer()],
          program.programId
        );

        // Find tick array bitmap extension PDA
        const [tickArrayBitmapExtensionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("pool_tick_array_bitmap_extension"), poolStatePda.toBuffer()],
          program.programId
        );

        const TICK_ARRAY_SIZE = 60;
        const ticksPerArray = poolState.tickSpacing * TICK_ARRAY_SIZE; // 3000
        const tickLowerIndex = -30000;  // Lower tick bound
        const tickUpperIndex = 30000;   // Upper tick bound
        const tickArrayLowerStartIndex = Math.floor(tickLowerIndex / ticksPerArray) * ticksPerArray;
        const tickArrayUpperStartIndex = Math.floor(tickUpperIndex / ticksPerArray) * ticksPerArray;

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
        // Execute swap
        const txId = await program.methods
          .swapV2(
            amountIn,
            amountOutMin,
            new anchor.BN(0), // sqrtPriceLimitX64 (0 = no limit)
            isBaseInput,
            2, // tick_array_bitmap_extension_end_index
            5, // token0_end_index
            5  // token1_end_index
          )
          .accounts({
            poolState: poolStatePda,
            ammConfig: ammConfigPda,
            payer: publicKey,
            inputTokenAccount,
            outputTokenAccount,
            inputVault,
            outputVault,
            observationState: observationStatePda,
            inputVaultMint: inputTokenMint,
            outputVaultMint: outputTokenMint,
          })
          .remainingAccounts([
            {
              pubkey: tickArrayLowerPda,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: tickArrayUpperPda,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: PublicKey.findProgramAddressSync(
                [Buffer.from("counter")],
                new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq")
              )[0],
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq"),
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: PublicKey.findProgramAddressSync(
                [Buffer.from("extra-account-metas"), inputTokenMint.toBuffer()],
                new PublicKey("ELtetBxqUZzsv2P98edTEK6cbvJDz9b3CSP6iurgXZWq")
              )[0],
              isSigner: false,
              isWritable: true,
            },
            // Add tick array accounts here based on current tick
          ])
          .rpc();

        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txId,
        });

        addToast({
          title: "Swap Executed",
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
        console.error("Failed to execute swap:", err);
        addToast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to execute swap",
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
        <div className="text-2xl font-bold">Swap Tokens</div>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              name="inputTokenMint"
              placeholder="Input Token Mint Address"
              labelPlacement="outside"
              label="Input Token Mint"
              value={formik.values.inputTokenMint}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.inputTokenMint && formik.errors.inputTokenMint)}
              errorMessage={formik.touched.inputTokenMint && formik.errors.inputTokenMint}
              required
            />
            {
                formik.values.inputTokenMint && (
                    <Alert color="warning">
                        The token has transfer hook enabled. The hook verification status currently is not not validated.
                    </Alert>
                )
            }

            <Input
              name="outputTokenMint"
              placeholder="Output Token Mint Address"
              labelPlacement="outside"
              label="Output Token Mint"
              value={formik.values.outputTokenMint}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.outputTokenMint && formik.errors.outputTokenMint)}
              errorMessage={formik.touched.outputTokenMint && formik.errors.outputTokenMint}
              required
            />

            <Input
              name="amountIn"
              placeholder="Amount to swap"
              labelPlacement="outside"
              label="Amount In"
              type="number"
              step="0.000001"
              min="0.000001"
              value={formik.values.amountIn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.amountIn && formik.errors.amountIn)}
              errorMessage={formik.touched.amountIn && formik.errors.amountIn}
              required
            />

            <Input
              name="amountOutMin"
              placeholder="Minimum amount out"
              labelPlacement="outside"
              label="Minimum Amount Out"
              type="number"
              step="0.000001"
              min="0.000001"
              value={formik.values.amountOutMin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.amountOutMin && formik.errors.amountOutMin)}
              errorMessage={formik.touched.amountOutMin && formik.errors.amountOutMin}
              required
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBaseInput"
                name="isBaseInput"
                checked={formik.values.isBaseInput}
                onChange={formik.handleChange}
              />
              <label htmlFor="isBaseInput">Is Base Input (token0)</label>
            </div>
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
          {connected ? "Execute Swap" : "Connect Wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwapPage;