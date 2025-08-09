"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, Link, Alert, addToast } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TransferHook } from "../../idl/transfer-hook";
import IDL from "../../idl/transfer-hook-idl.json";

// Validation schema
const CounterSchema = Yup.object().shape({
  mintAddress: Yup.string()
    .required("Mint address is required")
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid mint address"),
});

const CounterPage = () => {
  const anchorWallet = useAnchorWallet();
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<anchor.Program<TransferHook>>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [counter, setCounter] = React.useState<number | null>(null);
  const [transferHookProgramId] = React.useState(new PublicKey("9bUPPxMFGzdwyjWCUkZhDtgKoKQXKzFXPaEvTPcnoyaA"));

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
        const program = new anchor.Program<TransferHook>(
          IDL as any,
          provider
        );
        setProgram(program);
      } catch (err) {
        console.error("Failed to load program:", err);
        addToast({
          title: "Error",
          description: "Failed to load Transfer Hook program",
        });
      }
    };

    loadProgram();
  }, [wallet, connected, connection]);

  const formik = useFormik({
    initialValues: {
      mintAddress: "",
    },
    validationSchema: CounterSchema,
    onSubmit: async (values) => {
      if (!program || !publicKey || !wallet) return;

      setIsLoading(true);

      try {
        const mintPubkey = new PublicKey(values.mintAddress);
        
        // Get the counter account PDA
        const [counterAccountPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("counter")],
          program.programId
        );

        // Fetch the counter account
        const counterAccount = await program.account.counterAccount.fetch(
          counterAccountPda
        );

        setCounter(counterAccount.counter);

        addToast({
          title: "Counter Fetched",
          description: `Current transfer count: ${counterAccount.counter}`,
        });
      } catch (err) {
        console.error("Failed to fetch counter:", err);
        addToast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to fetch counter",
        });
        setCounter(null);
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
        <div className="text-2xl font-bold">Transfer Hook Counter</div>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              name="mintAddress"
              placeholder="Token Mint Address"
              labelPlacement="outside"
              label="Token Mint"
              value={formik.values.mintAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.mintAddress && formik.errors.mintAddress)}
              errorMessage={formik.touched.mintAddress && formik.errors.mintAddress}
              required
            />

            {counter !== null && (
              <Alert color="success">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Transfer Count:</span>
                  <span className="text-2xl font-bold">{counter}</span>
                  <span className="text-sm text-gray-600">
                    For mint: {formik.values.mintAddress}
                  </span>
                </div>
              </Alert>
            )}

            {formik.values.mintAddress && (
              <Alert color="warning">
                <div className="flex items-center gap-2">
                  <span>Transfer Hook Program:</span>
                  <Link 
                    href={`https://explorer.solana.com/address/${transferHookProgramId.toBase58()}?cluster=devnet`}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {transferHookProgramId.toBase58().slice(0, 6)}...{transferHookProgramId.toBase58().slice(-4)}
                  </Link>
                </div>
              </Alert>
            )}
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
          {connected ? "Get Counter" : "Connect Wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CounterPage;