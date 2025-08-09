"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, addToast, Link } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AmmV3 } from "../../idl/ammv3"
import ammv3idl from "../../idl/ammv3-idl.json"
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
// Validation schema
const PoolSchema = Yup.object().shape({
  token0: Yup.string()
    .required("Token 0 is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token address")
    .test(
      'token-order',
      'Token 0 address must be less than Token 1 address',
      function(value) {
        const { token1 } = this.parent;
        if (!value || !token1) return true;
        
        try {
          const pubkey0 = new PublicKey(value);
          const pubkey1 = new PublicKey(token1);
          return pubkey0.toBuffer().compare(pubkey1.toBuffer()) < 0;
        } catch {
          return true; // Nếu không phải public key hợp lệ, sẽ bị validate bởi rule trước
        }
      }
    ),
  token1: Yup.string()
    .required("Token 1 is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid token address")
    .notOneOf([Yup.ref('token0')], "Tokens must be different"),
  ammConfigIndex: Yup.number()
    .required("AMM Config Index is required")
    .min(0, "AMM Config Index must be at least 0"),
  initialPrice: Yup.number()
    .required("Initial price is required")
    .min(0.000001, "Price must be positive"),
});

const CreatePoolPage = () => {
  const anchorWallet = useAnchorWallet()
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<anchor.Program<AmmV3>>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

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
          ammv3idl
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
      token0: "",
      token1: "",
      ammConfigIndex: 1,
      initialPrice: "1.0",
    },
    validationSchema: PoolSchema,
    onSubmit: async (values) => {
      if (!program || !publicKey || !wallet) return;
      
      setIsLoading(true);
      
      try {
        const token0 = new PublicKey(values.token0);
        const token1 = new PublicKey(values.token1);
        const ammConfigIndex = Number(values.ammConfigIndex);
        const sqrtPriceX64 = new anchor.BN(BigInt(Math.sqrt(Number(values.initialPrice)) * Math.pow(2, 64)));
        const openTime = new anchor.BN(0);

        const [ammConfigPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("amm_config"),
            Buffer.from(new anchor.BN(ammConfigIndex).toArray("be", 2))
          ],
          program.programId
        );
        const ammConfig = await program.account.ammConfig.fetch(ammConfigPda);
        console.log("AMM Config:", ammConfig);

        const [poolStatePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammConfigPda.toBuffer(),
            token0.toBuffer(),
            token1.toBuffer(),
          ],
          program.programId
        );
        const txId = await program.methods
          .createPool(sqrtPriceX64, openTime)
          .accounts({
            poolCreator: publicKey,
            ammConfig: ammConfigPda,
            tokenMint0: token0,
            tokenMint1: token1,
            tokenProgram0: TOKEN_2022_PROGRAM_ID,
            tokenProgram1: TOKEN_2022_PROGRAM_ID,
          })
          .rpc();
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txId,
        });

        addToast({
          title: "Pool Created",
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
      } catch (err) {
        console.log(err)
        console.error("Failed to create pool:", err);
        addToast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create pool",
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
        <div className="text-2xl font-bold">Create New Pool</div>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              name="token0"
              placeholder="Token 0 Address"
              labelPlacement="outside"
              label="Token 0 Address"
              value={formik.values.token0}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.token0 && formik.errors.token0)}
              errorMessage={formik.touched.token0 && formik.errors.token0}
              required
            />
            <Input
              name="token1"
              placeholder="Token 1 Address"
              labelPlacement="outside"
              label="Token 1 Address"
              value={formik.values.token1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.token1 && formik.errors.token1)}
              errorMessage={formik.touched.token1 && formik.errors.token1}
              required
            />
            <Input
              name="ammConfigIndex"
              placeholder="60"
              labelPlacement="outside"
              label="AMM Config Index"
              type="number"
              value={formik.values.ammConfigIndex.toString()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.ammConfigIndex && formik.errors.ammConfigIndex)}
              errorMessage={formik.touched.ammConfigIndex && formik.errors.ammConfigIndex}
              required
            />
            <Input
              name="initialPrice"
              placeholder="1.0"
              labelPlacement="outside"
              label="Initial Price (Token 0 / Token 1)"
              type="number"
              step="0.000001"
              min="0.000001"
              value={formik.values.initialPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.initialPrice && formik.errors.initialPrice)}
              errorMessage={formik.touched.initialPrice && formik.errors.initialPrice}
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
          {connected ? "Create Pool" : "Connect Wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePoolPage;