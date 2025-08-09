"use client";
import { Card, CardBody, CardHeader, Input, Button, CardFooter, toast, addToast } from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import ammv3idl from "../../idl/ammv3-idl.json";
import { AmmV3 } from "../../idl/ammv3";
import { PublicKey } from "@solana/web3.js";

const AmmConfigSchema = Yup.object().shape({
  index: Yup.number()
    .required("Config index is required")
    .min(0, "Index must be positive"),
  tickSpacing: Yup.number()
    .required("Tick spacing is required")
    .min(1, "Tick spacing must be at least 1"),
  tradeFeeRate: Yup.number()
    .required("Trade fee rate is required")
    .min(0, "Fee rate must be positive"),
  protocolFeeRate: Yup.number()
    .required("Protocol fee rate is required")
    .min(0, "Fee rate must be positive"),
  fundFeeRate: Yup.number()
    .required("Fund fee rate is required")
    .min(0, "Fee rate must be positive"),
});

const CreateAmmConfigPage = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<anchor.Program<AmmV3>>();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!wallet) return;
    
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
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
  }, [wallet, connection]);

  const formik = useFormik({
    initialValues: {
      index: "1",
      tickSpacing: "60",
      tradeFeeRate: "2500", // 0.25%
      protocolFeeRate: "800", // 0.08%
      fundFeeRate: "0",
    },
    validationSchema: AmmConfigSchema,
    onSubmit: async (values) => {
      if (!program || !wallet) return;
      
      setIsLoading(true);
      
      try {
        const [ammConfigPda] = await PublicKey.findProgramAddress(
          [
            Buffer.from("amm_config"),
            Buffer.from(new anchor.BN(Number(values.index)).toArray("be", 2))
          ],
          program.programId
        );

        const tx = await program.methods
          .createAmmConfig(
            Number(values.index),
            Number(values.tickSpacing),
            Number(values.tradeFeeRate),
            Number(values.protocolFeeRate),
            Number(values.fundFeeRate)
          )
          .accounts({
            ammConfig: ammConfigPda,
            owner: wallet.publicKey,
          })
          .rpc();

        addToast({
          title: "AMM Config Created",
          description: `Config created with index ${values.index}`,
        });

        formik.resetForm();
      } catch (err) {
        console.error("Failed to create AMM config:", err);
        addToast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create AMM config",
        });
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <Card className="max-w-[768px] mx-auto">
      <CardHeader>
        <div className="text-2xl font-bold">Create AMM Config</div>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              name="index"
              placeholder="1"
              labelPlacement="outside"
              label="Config Index"
              type="number"
              value={formik.values.index}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.index && formik.errors.index)}
              errorMessage={formik.touched.index && formik.errors.index}
              required
            />
            <Input
              name="tickSpacing"
              placeholder="60"
              labelPlacement="outside"
              label="Tick Spacing"
              type="number"
              value={formik.values.tickSpacing}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.tickSpacing && formik.errors.tickSpacing)}
              errorMessage={formik.touched.tickSpacing && formik.errors.tickSpacing}
              required
            />
            <Input
              name="tradeFeeRate"
              placeholder="2500"
              labelPlacement="outside"
              label="Trade Fee Rate (basis points)"
              type="number"
              value={formik.values.tradeFeeRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.tradeFeeRate && formik.errors.tradeFeeRate)}
              errorMessage={formik.touched.tradeFeeRate && formik.errors.tradeFeeRate}
              required
            />
            <Input
              name="protocolFeeRate"
              placeholder="800"
              labelPlacement="outside"
              label="Protocol Fee Rate (basis points)"
              type="number"
              value={formik.values.protocolFeeRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.protocolFeeRate && formik.errors.protocolFeeRate)}
              errorMessage={formik.touched.protocolFeeRate && formik.errors.protocolFeeRate}
              required
            />
            <Input
              name="fundFeeRate"
              placeholder="0"
              labelPlacement="outside"
              label="Fund Fee Rate (basis points)"
              type="number"
              value={formik.values.fundFeeRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.fundFeeRate && formik.errors.fundFeeRate)}
              errorMessage={formik.touched.fundFeeRate && formik.errors.fundFeeRate}
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
          isDisabled={!formik.isValid || isLoading || !wallet}
          isLoading={isLoading}
        >
          {wallet ? "Create AMM Config" : "Connect Wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateAmmConfigPage;