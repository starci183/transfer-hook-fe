import { NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({
  pinataJWTKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGU4MDMzYy01YWE0LTRiOTktYjY5OC0xNTY4ZTAzMjQ2MmIiLCJlbWFpbCI6ImN1b25nbnZ0c2UxNjA4NzVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImE2OWZmYWU1MGFkMDcwNDdmMzk0Iiwic2NvcGVkS2V5U2VjcmV0IjoiNjMyNzYyZWJiMWVjODY4ZmRmZTBiZWIxMTYzNjg4Y2EyNjY0MWM2Nzk0Y2JlNGY5OWFjZTgzYmMyN2FkOGRhYSIsImV4cCI6MTc4NjI1NzM0NH0.Ouk1wZGMpn-sbbsqEkzfBRv6UG3IT5zCAW4j32RXNqE",
});

export async function POST(req: Request) {
  try {
    const metadata = await req.json();
    const result = await pinata.pinJSONToIPFS(metadata);
    return NextResponse.json({
      uri: `https://violet-lazy-yak-333.mypinata.cloud/ipfs/${result.IpfsHash}`,
    });
  } catch (error) {
    console.error("Pinata upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}