/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/amm_v3.json`.
 */
export type AmmV3 = {
  "address": "8PrWBjEhYrhgTa7DezekVw2n7sAnXH4VR7tn29KPFvMc",
  "metadata": {
    "name": "ammV3",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Anchor client and source for Raydium concentrated liquidity AMM"
  },
  "instructions": [
    {
      "name": "approveHookProgram",
      "docs": [
        "Approve a hook program, which can be used to store the hook data"
      ],
      "discriminator": [
        28,
        161,
        124,
        85,
        51,
        217,
        214,
        64
      ],
      "accounts": [
        {
          "name": "hookAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  111,
                  107,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "hookAccounts"
          ]
        }
      ],
      "args": [
        {
          "name": "programId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "closePosition",
      "docs": [
        "Close the user's position and NFT account. If the NFT mint belongs to token2022, it will also be closed and the funds returned to the NFT owner.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        ""
      ],
      "discriminator": [
        123,
        134,
        81,
        0,
        49,
        68,
        98,
        98
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "docs": [
            "The position nft owner"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftMint",
          "docs": [
            "Mint address bound to the personal position."
          ],
          "writable": true
        },
        {
          "name": "positionNftAccount",
          "docs": [
            "User token account where position NFT be minted to"
          ],
          "writable": true
        },
        {
          "name": "personalPosition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program to close the position state account"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token/Token2022 program to close token/mint account"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeProtocolPosition",
      "docs": [
        "The CLMM protocol decides to discard the protocol position account, which can reduce users' opening costs.",
        "After the original protocol position account is closed, the gas fee will be refunded to the user who created it.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        ""
      ],
      "discriminator": [
        201,
        117,
        152,
        144,
        85,
        85,
        108,
        178
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "protocolPosition",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "collectFundFee",
      "docs": [
        "Collect the fund fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "discriminator": [
        167,
        138,
        78,
        149,
        223,
        194,
        6,
        126
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Only admin or fund_owner can collect fee now"
          ],
          "signer": true
        },
        {
          "name": "poolState",
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ],
          "writable": true
        },
        {
          "name": "ammConfig",
          "docs": [
            "Amm config account stores fund_owner"
          ]
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount1",
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The SPL program to perform token transfers"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectProtocolFee",
      "docs": [
        "Collect the protocol fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "discriminator": [
        136,
        136,
        252,
        221,
        194,
        66,
        126,
        89
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Only admin or config owner can collect fee now"
          ],
          "signer": true
        },
        {
          "name": "poolState",
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ],
          "writable": true
        },
        {
          "name": "ammConfig",
          "docs": [
            "Amm config account stores owner"
          ]
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount1",
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The SPL program to perform token transfers"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectRemainingRewards",
      "docs": [
        "Collect remaining reward token for reward founder",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        ""
      ],
      "discriminator": [
        18,
        237,
        166,
        197,
        34,
        16,
        213,
        144
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "docs": [
            "The founder who init reward info previously"
          ],
          "signer": true
        },
        {
          "name": "funderTokenAccount",
          "docs": [
            "The funder's reward token account"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "docs": [
            "Set reward for this pool"
          ],
          "writable": true
        },
        {
          "name": "rewardTokenVault",
          "docs": [
            "Reward vault transfer remaining token to founder token account"
          ],
          "writable": true
        },
        {
          "name": "rewardVaultMint",
          "docs": [
            "The mint of reward token vault"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Token program 2022"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "memoProgram",
          "docs": [
            "memo program"
          ],
          "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createAmmConfig",
      "docs": [
        "# Arguments",
        "",
        "* `ctx`- The accounts needed by instruction.",
        "* `index` - The index of amm config, there may be multiple config.",
        "* `tick_spacing` - The tickspacing binding with config, cannot be changed.",
        "* `trade_fee_rate` - Trade fee rate, can be changed.",
        "* `protocol_fee_rate` - The rate of protocol fee within trade fee.",
        "* `fund_fee_rate` - The rate of fund fee within trade fee.",
        ""
      ],
      "discriminator": [
        137,
        52,
        237,
        212,
        215,
        117,
        108,
        104
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Address to be set as protocol owner."
          ],
          "writable": true,
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "ammConfig",
          "docs": [
            "Initialize config state account to store protocol owner address and fee rates."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "index"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "tickSpacing",
          "type": "u16"
        },
        {
          "name": "tradeFeeRate",
          "type": "u32"
        },
        {
          "name": "protocolFeeRate",
          "type": "u32"
        },
        {
          "name": "fundFeeRate",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createOperationAccount",
      "docs": [
        "Creates an operation account for the program",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "discriminator": [
        63,
        87,
        148,
        33,
        109,
        35,
        8,
        104
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Address to be set as operation account owner."
          ],
          "writable": true,
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "operationState",
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "docs": [
        "Creates a pool for the given token pair and the initial price",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `sqrt_price_x64` - the initial sqrt price (amount_token_1 / amount_token_0) of the pool as a Q64.64",
        "Note: The open_time must be smaller than the current block_timestamp on chain."
      ],
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "poolCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "ammConfig"
        },
        {
          "name": "poolState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "ammConfig"
              },
              {
                "kind": "account",
                "path": "tokenMint0"
              },
              {
                "kind": "account",
                "path": "tokenMint1"
              }
            ]
          }
        },
        {
          "name": "tokenMint0"
        },
        {
          "name": "tokenMint1"
        },
        {
          "name": "tokenVault0",
          "docs": [
            "This account is created and initialized inside the program with deterministic seeds.",
            "Therefore, no further validation is required here."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "account",
                "path": "tokenMint0"
              }
            ]
          }
        },
        {
          "name": "tokenVault1",
          "docs": [
            "This account is created and initialized inside the program with deterministic seeds.",
            "Therefore, no further validation is required here."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "account",
                "path": "tokenMint1"
              }
            ]
          }
        },
        {
          "name": "observationState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  98,
                  115,
                  101,
                  114,
                  118,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              }
            ]
          }
        },
        {
          "name": "tickArrayBitmap",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121,
                  95,
                  98,
                  105,
                  116,
                  109,
                  97,
                  112,
                  95,
                  101,
                  120,
                  116,
                  101,
                  110,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              }
            ]
          }
        },
        {
          "name": "tokenProgram0"
        },
        {
          "name": "tokenProgram1"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createSupportMintAssociated",
      "docs": [
        "Create support token22 mint account which can create pool and send rewards with ignoring the not support extensions."
      ],
      "discriminator": [
        17,
        251,
        65,
        92,
        136,
        242,
        14,
        169
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Address to be set as protocol owner."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenMint",
          "docs": [
            "Support token mint"
          ]
        },
        {
          "name": "supportMintAssociated",
          "docs": [
            "Initialize support mint state account to store support mint address and bump."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  112,
                  112,
                  111,
                  114,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "decreaseLiquidity",
      "docs": [
        "#[deprecated(note = \"Use `decrease_liquidity_v2` instead.\")]",
        "Decreases liquidity for an existing position",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "discriminator": [
        160,
        38,
        208,
        111,
        104,
        91,
        44,
        1
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "docs": [
            "The position owner or delegated authority"
          ],
          "signer": true
        },
        {
          "name": "nftAccount",
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "docs": [
            "Decrease liquidity for this position"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "tokenVault0",
          "docs": [
            "Token_0 vault"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "Token_1 vault"
          ],
          "writable": true
        },
        {
          "name": "tickArrayLower",
          "docs": [
            "Stores init state for the lower tick"
          ],
          "writable": true
        },
        {
          "name": "tickArrayUpper",
          "docs": [
            "Stores init state for the upper tick"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount0",
          "docs": [
            "The destination token account for receive amount_0"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount1",
          "docs": [
            "The destination token account for receive amount_1"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "SPL program to transfer out tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "decreaseLiquidityV2",
      "docs": [
        "Decreases liquidity for an existing position, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "discriminator": [
        58,
        127,
        188,
        62,
        79,
        82,
        196,
        96
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "docs": [
            "The position owner or delegated authority"
          ],
          "signer": true
        },
        {
          "name": "nftAccount",
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "docs": [
            "Decrease liquidity for this position"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "tokenVault0",
          "docs": [
            "Token_0 vault"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "Token_1 vault"
          ],
          "writable": true
        },
        {
          "name": "tickArrayLower",
          "docs": [
            "Stores init state for the lower tick"
          ],
          "writable": true
        },
        {
          "name": "tickArrayUpper",
          "docs": [
            "Stores init state for the upper tick"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount0",
          "docs": [
            "The destination token account for receive amount_0"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount1",
          "docs": [
            "The destination token account for receive amount_1"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "SPL program to transfer out tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Token program 2022"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "memoProgram",
          "docs": [
            "memo program"
          ],
          "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increaseLiquidity",
      "docs": [
        "#[deprecated(note = \"Use `increase_liquidity_v2` instead.\")]",
        "Increases liquidity for an existing position, with amount paid by `payer`",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, can't be zero",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "discriminator": [
        46,
        156,
        243,
        118,
        13,
        205,
        251,
        178
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "docs": [
            "Pays to mint the position"
          ],
          "signer": true
        },
        {
          "name": "nftAccount",
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "personalPosition",
          "docs": [
            "Increase liquidity for this position"
          ],
          "writable": true
        },
        {
          "name": "tickArrayLower",
          "docs": [
            "Stores init state for the lower tick"
          ],
          "writable": true
        },
        {
          "name": "tickArrayUpper",
          "docs": [
            "Stores init state for the upper tick"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount0",
          "docs": [
            "The payer's token account for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount1",
          "docs": [
            "The token account spending token_1 to mint the position"
          ],
          "writable": true
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Program to create mint account and mint tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increaseLiquidityV2",
      "docs": [
        "Increases liquidity for an existing position, with amount paid by `payer`, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, if zero, calculate liquidity base amount_0 or amount_1 according base_flag",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `base_flag` - must be specified if liquidity is zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "discriminator": [
        133,
        29,
        89,
        223,
        69,
        238,
        176,
        10
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "docs": [
            "Pays to mint the position"
          ],
          "signer": true
        },
        {
          "name": "nftAccount",
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "personalPosition",
          "docs": [
            "Increase liquidity for this position"
          ],
          "writable": true
        },
        {
          "name": "tickArrayLower",
          "docs": [
            "Stores init state for the lower tick"
          ],
          "writable": true
        },
        {
          "name": "tickArrayUpper",
          "docs": [
            "Stores init state for the upper tick"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount0",
          "docs": [
            "The payer's token account for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount1",
          "docs": [
            "The token account spending token_1 to mint the position"
          ],
          "writable": true
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Program to create mint account and mint tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Token program 2022"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "initializeHookPrograms",
      "docs": [
        "Initialize hook accounts, which can be used to store the hook data"
      ],
      "discriminator": [
        109,
        77,
        104,
        80,
        21,
        162,
        4,
        135
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "hookAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  111,
                  107,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeReward",
      "docs": [
        "Initialize a reward info for a given pool and reward index",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        "* `open_time` - reward open timestamp",
        "* `end_time` - reward end timestamp",
        "* `emissions_per_second_x64` - Token reward per second are earned per unit of liquidity.",
        ""
      ],
      "discriminator": [
        95,
        135,
        192,
        196,
        242,
        129,
        230,
        68
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "docs": [
            "The founder deposit reward token to vault"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "funderTokenAccount",
          "writable": true
        },
        {
          "name": "ammConfig",
          "docs": [
            "For check the reward_funder authority"
          ]
        },
        {
          "name": "poolState",
          "docs": [
            "Set reward for this pool"
          ],
          "writable": true
        },
        {
          "name": "operationState",
          "docs": [
            "load info from the account to judge reward permission"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "rewardTokenMint",
          "docs": [
            "Reward mint"
          ]
        },
        {
          "name": "rewardTokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "account",
                "path": "rewardTokenMint"
              }
            ]
          }
        },
        {
          "name": "rewardTokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "param",
          "type": {
            "defined": {
              "name": "initializeRewardParam"
            }
          }
        }
      ]
    },
    {
      "name": "openPosition",
      "docs": [
        "#[deprecated(note = \"Use `open_position_with_token22_nft` instead.\")]",
        "Creates a new position wrapped in a NFT",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "discriminator": [
        135,
        128,
        47,
        77,
        15,
        152,
        240,
        49
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "Pays to mint the position"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftOwner"
        },
        {
          "name": "positionNftMint",
          "docs": [
            "Unique token mint address"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftAccount",
          "docs": [
            "Token account where position NFT will be minted",
            "This account created in the contract by cpi to avoid large stack variables"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "positionNftOwner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "docs": [
            "To store metaplex metadata"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "docs": [
            "Add liquidity for this pool"
          ],
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "tickArrayLower",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayLowerStartIndex"
              }
            ]
          }
        },
        {
          "name": "tickArrayUpper",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayUpperStartIndex"
              }
            ]
          }
        },
        {
          "name": "personalPosition",
          "docs": [
            "personal position state"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount0",
          "docs": [
            "The token_0 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount1",
          "docs": [
            "The token_1 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "rent",
          "docs": [
            "Sysvar for token mint and ATA creation"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Program to create the position manager state account"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Program to create mint account and mint tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "docs": [
            "Program to create NFT metadata"
          ],
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPositionV2",
      "docs": [
        "#[deprecated(note = \"Use `open_position_with_token22_nft` instead.\")]",
        "Creates a new position wrapped in a NFT, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added, if zero, and the base_flag is specified, calculate liquidity base amount_0_max or amount_1_max according base_flag, otherwise open position with zero liquidity",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `with_metadata` - The flag indicating whether to create NFT mint metadata",
        "* `base_flag` - if the liquidity specified as zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "discriminator": [
        77,
        184,
        74,
        214,
        112,
        86,
        241,
        199
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "Pays to mint the position"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftOwner"
        },
        {
          "name": "positionNftMint",
          "docs": [
            "Unique token mint address"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftAccount",
          "docs": [
            "Token account where position NFT will be minted"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "positionNftOwner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "docs": [
            "To store metaplex metadata"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "docs": [
            "Add liquidity for this pool"
          ],
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "tickArrayLower",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayLowerStartIndex"
              }
            ]
          }
        },
        {
          "name": "tickArrayUpper",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayUpperStartIndex"
              }
            ]
          }
        },
        {
          "name": "personalPosition",
          "docs": [
            "personal position state"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount0",
          "docs": [
            "The token_0 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount1",
          "docs": [
            "The token_1 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "rent",
          "docs": [
            "Sysvar for token mint and ATA creation"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Program to create the position manager state account"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Program to create mint account and mint tokens"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "docs": [
            "Program to create NFT metadata"
          ],
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Program to create mint account and mint tokens"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "withMetadata",
          "type": "bool"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "openPositionWithToken22Nft",
      "docs": [
        "Creates a new position wrapped in a Token2022 NFT without relying on metadata_program and metadata_account, reduce the cost for user to create a personal position.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added, if zero, and the base_flag is specified, calculate liquidity base amount_0_max or amount_1_max according base_flag, otherwise open position with zero liquidity",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `with_metadata` - The flag indicating whether to create NFT mint metadata",
        "* `base_flag` - if the liquidity specified as zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "discriminator": [
        77,
        255,
        174,
        82,
        125,
        29,
        201,
        46
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "Pays to mint the position"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftOwner"
        },
        {
          "name": "positionNftMint",
          "docs": [
            "Unique token mint address, initialize in contract"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftAccount",
          "writable": true
        },
        {
          "name": "poolState",
          "docs": [
            "Add liquidity for this pool"
          ],
          "writable": true
        },
        {
          "name": "protocolPosition"
        },
        {
          "name": "tickArrayLower",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayLowerStartIndex"
              }
            ]
          }
        },
        {
          "name": "tickArrayUpper",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  105,
                  99,
                  107,
                  95,
                  97,
                  114,
                  114,
                  97,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "poolState"
              },
              {
                "kind": "arg",
                "path": "tickArrayUpperStartIndex"
              }
            ]
          }
        },
        {
          "name": "personalPosition",
          "docs": [
            "personal position state"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "positionNftMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount0",
          "docs": [
            "The token_0 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenAccount1",
          "docs": [
            "The token_1 account deposit token to the pool"
          ],
          "writable": true
        },
        {
          "name": "tokenVault0",
          "docs": [
            "The address that holds pool tokens for token_0"
          ],
          "writable": true
        },
        {
          "name": "tokenVault1",
          "docs": [
            "The address that holds pool tokens for token_1"
          ],
          "writable": true
        },
        {
          "name": "rent",
          "docs": [
            "Sysvar for token mint and ATA creation"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Program to create the position manager state account"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Program to transfer for token account"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Program to create NFT mint/token account and transfer for token22 account"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "vault0Mint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "withMetadata",
          "type": "bool"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "token0EndIndex",
          "type": "i32"
        },
        {
          "name": "token1EndIndex",
          "type": "i32"
        }
      ]
    },
    {
      "name": "registerHookProgram",
      "docs": [
        "Register a hook program, which can be used to store the hook data"
      ],
      "discriminator": [
        51,
        39,
        228,
        186,
        16,
        88,
        254,
        89
      ],
      "accounts": [
        {
          "name": "hookAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  111,
                  107,
                  115
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "programId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setRewardParams",
      "docs": [
        "Reset reward param, start a new reward cycle or extend the current cycle.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `reward_index` - The index of reward token in the pool.",
        "* `emissions_per_second_x64` - The per second emission reward, when extend the current cycle,",
        "new value can't be less than old value",
        "* `open_time` - reward open timestamp, must be set when starting a new cycle",
        "* `end_time` - reward end timestamp",
        ""
      ],
      "discriminator": [
        112,
        52,
        167,
        75,
        32,
        201,
        211,
        137
      ],
      "accounts": [
        {
          "name": "authority",
          "docs": [
            "Address to be set as protocol owner. It pays to create factory state account."
          ],
          "signer": true
        },
        {
          "name": "ammConfig"
        },
        {
          "name": "poolState",
          "writable": true
        },
        {
          "name": "operationState",
          "docs": [
            "load info from the account to judge reward permission"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "Token program 2022"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        },
        {
          "name": "emissionsPerSecondX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "docs": [
        "#[deprecated(note = \"Use `swap_v2` instead.\")]",
        "Swaps one token for as much as possible of another token across a single pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "The user performing the swap"
          ],
          "signer": true
        },
        {
          "name": "ammConfig",
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ],
          "writable": true
        },
        {
          "name": "inputTokenAccount",
          "docs": [
            "The user token account for input token"
          ],
          "writable": true
        },
        {
          "name": "outputTokenAccount",
          "docs": [
            "The user token account for output token"
          ],
          "writable": true
        },
        {
          "name": "inputVault",
          "docs": [
            "The vault token account for input token"
          ],
          "writable": true
        },
        {
          "name": "outputVault",
          "docs": [
            "The vault token account for output token"
          ],
          "writable": true
        },
        {
          "name": "observationState",
          "docs": [
            "The program account for the most recent oracle observation"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "SPL program for token transfers"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tickArray",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapRouterBaseIn",
      "docs": [
        "Swap token for as much as possible of another token across the path provided, base input",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_in` - Token amount to be swapped in",
        "* `amount_out_minimum` - Panic if output amount is below minimum amount. For slippage.",
        ""
      ],
      "discriminator": [
        69,
        125,
        115,
        218,
        245,
        186,
        242,
        196
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "The user performing the swap"
          ],
          "signer": true
        },
        {
          "name": "inputTokenAccount",
          "docs": [
            "The token account that pays input tokens for the swap"
          ],
          "writable": true
        },
        {
          "name": "inputTokenMint",
          "docs": [
            "The mint of input token"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "SPL program for token transfers"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "SPL program 2022 for token transfers"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "memoProgram",
          "docs": [
            "Memo program"
          ],
          "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountOutMinimum",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapV2",
      "docs": [
        "Swaps one token for as much as possible of another token across a single pool, support token program 2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "discriminator": [
        43,
        4,
        237,
        11,
        26,
        201,
        30,
        98
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "The user performing the swap"
          ],
          "signer": true
        },
        {
          "name": "ammConfig",
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ],
          "writable": true
        },
        {
          "name": "inputTokenAccount",
          "docs": [
            "The user token account for input token"
          ],
          "writable": true
        },
        {
          "name": "outputTokenAccount",
          "docs": [
            "The user token account for output token"
          ],
          "writable": true
        },
        {
          "name": "inputVault",
          "docs": [
            "The vault token account for input token"
          ],
          "writable": true
        },
        {
          "name": "outputVault",
          "docs": [
            "The vault token account for output token"
          ],
          "writable": true
        },
        {
          "name": "observationState",
          "docs": [
            "The program account for the most recent oracle observation"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "SPL program for token transfers"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "docs": [
            "SPL program 2022 for token transfers"
          ],
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "memoProgram",
          "docs": [
            "Memo program"
          ],
          "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        },
        {
          "name": "inputVaultMint",
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "outputVaultMint",
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        },
        {
          "name": "swapRemainingAccountsEndIndex",
          "type": "i32"
        },
        {
          "name": "token0EndIndex",
          "type": "i32"
        },
        {
          "name": "token1EndIndex",
          "type": "i32"
        }
      ]
    },
    {
      "name": "transferRewardOwner",
      "docs": [
        "Transfer reward owner",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `new_owner`- new owner pubkey",
        ""
      ],
      "discriminator": [
        7,
        22,
        12,
        83,
        242,
        43,
        48,
        121
      ],
      "accounts": [
        {
          "name": "authority",
          "docs": [
            "Address to be set as operation account owner."
          ],
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "poolState",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateAmmConfig",
      "docs": [
        "Updates the owner of the amm config",
        "Must be called by the current owner or admin",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0",
        "* `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1",
        "* `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2",
        "* `new_owner`- The config's new owner, be set when `param` is 3",
        "* `new_fund_owner`- The config's new fund owner, be set when `param` is 4",
        "* `param`- The value can be 0 | 1 | 2 | 3 | 4, otherwise will report a error",
        ""
      ],
      "discriminator": [
        49,
        60,
        174,
        136,
        154,
        28,
        116,
        200
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "The amm config owner or admin"
          ],
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "ammConfig",
          "docs": [
            "Amm config account to be changed"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "value",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateOperationAccount",
      "docs": [
        "Update the operation account",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `param`- The value can be 0 | 1 | 2 | 3, otherwise will report a error",
        "* `keys`- update operation owner when the `param` is 0",
        "remove operation owner when the `param` is 1",
        "update whitelist mint when the `param` is 2",
        "remove whitelist mint when the `param` is 3",
        ""
      ],
      "discriminator": [
        127,
        70,
        119,
        40,
        188,
        227,
        61,
        7
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "Address to be set as operation account owner."
          ],
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "operationState",
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "keys",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "updatePoolStatus",
      "docs": [
        "Update pool status for given value",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `status` - The value of status",
        ""
      ],
      "discriminator": [
        130,
        87,
        108,
        6,
        46,
        224,
        117,
        123
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "address": "8cqh3E3XwYoij3uP3tbF4ZmsZe6H5M9uyret75M9EyBb"
        },
        {
          "name": "poolState",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "status",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateRewardInfos",
      "docs": [
        "Update rewards info of the given pool, can be called for everyone",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "discriminator": [
        163,
        172,
        224,
        52,
        11,
        154,
        106,
        223
      ],
      "accounts": [
        {
          "name": "poolState",
          "docs": [
            "The liquidity pool for which reward info to update"
          ],
          "writable": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "discriminator": [
        218,
        244,
        33,
        104,
        203,
        203,
        43,
        111
      ]
    },
    {
      "name": "hooksAccount",
      "discriminator": [
        193,
        54,
        227,
        167,
        98,
        174,
        76,
        87
      ]
    },
    {
      "name": "observationState",
      "discriminator": [
        122,
        174,
        197,
        53,
        129,
        9,
        165,
        132
      ]
    },
    {
      "name": "operationState",
      "discriminator": [
        19,
        236,
        58,
        237,
        81,
        222,
        183,
        252
      ]
    },
    {
      "name": "personalPositionState",
      "discriminator": [
        70,
        111,
        150,
        126,
        230,
        15,
        25,
        117
      ]
    },
    {
      "name": "poolState",
      "discriminator": [
        247,
        237,
        227,
        245,
        215,
        195,
        222,
        70
      ]
    },
    {
      "name": "protocolPositionState",
      "discriminator": [
        100,
        226,
        145,
        99,
        146,
        218,
        160,
        106
      ]
    },
    {
      "name": "supportMintAssociated",
      "discriminator": [
        134,
        40,
        183,
        79,
        12,
        112,
        162,
        53
      ]
    },
    {
      "name": "tickArrayBitmapExtension",
      "discriminator": [
        60,
        150,
        36,
        219,
        97,
        128,
        139,
        153
      ]
    },
    {
      "name": "tickArrayState",
      "discriminator": [
        192,
        155,
        85,
        205,
        49,
        249,
        129,
        42
      ]
    }
  ],
  "events": [
    {
      "name": "collectPersonalFeeEvent",
      "discriminator": [
        166,
        174,
        105,
        192,
        81,
        161,
        83,
        105
      ]
    },
    {
      "name": "collectProtocolFeeEvent",
      "discriminator": [
        206,
        87,
        17,
        79,
        45,
        41,
        213,
        61
      ]
    },
    {
      "name": "configChangeEvent",
      "discriminator": [
        247,
        189,
        7,
        119,
        106,
        112,
        95,
        151
      ]
    },
    {
      "name": "createPersonalPositionEvent",
      "discriminator": [
        100,
        30,
        87,
        249,
        196,
        223,
        154,
        206
      ]
    },
    {
      "name": "decreaseLiquidityEvent",
      "discriminator": [
        58,
        222,
        86,
        58,
        68,
        50,
        85,
        56
      ]
    },
    {
      "name": "increaseLiquidityEvent",
      "discriminator": [
        49,
        79,
        105,
        212,
        32,
        34,
        30,
        84
      ]
    },
    {
      "name": "liquidityCalculateEvent",
      "discriminator": [
        237,
        112,
        148,
        230,
        57,
        84,
        180,
        162
      ]
    },
    {
      "name": "liquidityChangeEvent",
      "discriminator": [
        126,
        240,
        175,
        206,
        158,
        88,
        153,
        107
      ]
    },
    {
      "name": "poolCreatedEvent",
      "discriminator": [
        25,
        94,
        75,
        47,
        112,
        99,
        53,
        63
      ]
    },
    {
      "name": "swapEvent",
      "discriminator": [
        64,
        198,
        205,
        232,
        38,
        8,
        113,
        226
      ]
    },
    {
      "name": "updateRewardInfosEvent",
      "discriminator": [
        109,
        127,
        186,
        78,
        114,
        65,
        37,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "hookAlreadyExists",
      "msg": "Hook already exists"
    },
    {
      "code": 6001,
      "name": "tooManyHooks",
      "msg": "Too many hooks"
    },
    {
      "code": 6002,
      "name": "hookNotFound",
      "msg": "Hook not found"
    },
    {
      "code": 6003,
      "name": "lok",
      "msg": "lok"
    },
    {
      "code": 6004,
      "name": "notApproved",
      "msg": "Not approved"
    },
    {
      "code": 6005,
      "name": "invalidUpdateConfigFlag",
      "msg": "invalid update amm config flag"
    },
    {
      "code": 6006,
      "name": "accountLack",
      "msg": "Account lack"
    },
    {
      "code": 6007,
      "name": "unauthorizedAdmin",
      "msg": "Unauthorized admin"
    },
    {
      "code": 6008,
      "name": "closePositionErr",
      "msg": "Remove liquitity, collect fees owed and reward then you can close position account"
    },
    {
      "code": 6009,
      "name": "zeroMintAmount",
      "msg": "Minting amount should be greater than 0"
    },
    {
      "code": 6010,
      "name": "invalidTickIndex",
      "msg": "Tick out of range"
    },
    {
      "code": 6011,
      "name": "tickInvalidOrder",
      "msg": "The lower tick must be below the upper tick"
    },
    {
      "code": 6012,
      "name": "tickLowerOverflow",
      "msg": "The tick must be greater, or equal to the minimum tick(-443636)"
    },
    {
      "code": 6013,
      "name": "tickUpperOverflow",
      "msg": "The tick must be lesser than, or equal to the maximum tick(443636)"
    },
    {
      "code": 6014,
      "name": "tickAndSpacingNotMatch",
      "msg": "tick % tick_spacing must be zero"
    },
    {
      "code": 6015,
      "name": "invalidTickArray",
      "msg": "Invalid tick array account"
    },
    {
      "code": 6016,
      "name": "invalidTickArrayBoundary",
      "msg": "Invalid tick array boundary"
    },
    {
      "code": 6017,
      "name": "sqrtPriceLimitOverflow",
      "msg": "Square root price limit overflow"
    },
    {
      "code": 6018,
      "name": "sqrtPriceX64",
      "msg": "sqrt_price_x64 out of range"
    },
    {
      "code": 6019,
      "name": "liquiditySubValueErr",
      "msg": "Liquidity sub delta L must be smaller than before"
    },
    {
      "code": 6020,
      "name": "liquidityAddValueErr",
      "msg": "Liquidity add delta L must be greater, or equal to before"
    },
    {
      "code": 6021,
      "name": "invalidLiquidity",
      "msg": "Invalid liquidity when update position"
    },
    {
      "code": 6022,
      "name": "forbidBothZeroForSupplyLiquidity",
      "msg": "Both token amount must not be zero while supply liquidity"
    },
    {
      "code": 6023,
      "name": "liquidityInsufficient",
      "msg": "Liquidity insufficient"
    },
    {
      "code": 6024,
      "name": "transactionTooOld",
      "msg": "Transaction too old"
    },
    {
      "code": 6025,
      "name": "priceSlippageCheck",
      "msg": "Price slippage check"
    },
    {
      "code": 6026,
      "name": "tooLittleOutputReceived",
      "msg": "Too little output received"
    },
    {
      "code": 6027,
      "name": "tooMuchInputPaid",
      "msg": "Too much input paid"
    },
    {
      "code": 6028,
      "name": "zeroAmountSpecified",
      "msg": "Swap special amount can not be zero"
    },
    {
      "code": 6029,
      "name": "invalidInputPoolVault",
      "msg": "Input pool vault is invalid"
    },
    {
      "code": 6030,
      "name": "tooSmallInputOrOutputAmount",
      "msg": "Swap input or output amount is too small"
    },
    {
      "code": 6031,
      "name": "notEnoughTickArrayAccount",
      "msg": "Not enought tick array account"
    },
    {
      "code": 6032,
      "name": "invalidFirstTickArrayAccount",
      "msg": "Invalid first tick array account"
    },
    {
      "code": 6033,
      "name": "invalidRewardIndex",
      "msg": "Invalid reward index"
    },
    {
      "code": 6034,
      "name": "fullRewardInfo",
      "msg": "The init reward token reach to the max"
    },
    {
      "code": 6035,
      "name": "rewardTokenAlreadyInUse",
      "msg": "The init reward token already in use"
    },
    {
      "code": 6036,
      "name": "exceptRewardMint",
      "msg": "The reward tokens must contain one of pool vault mint except the last reward"
    },
    {
      "code": 6037,
      "name": "invalidRewardInitParam",
      "msg": "Invalid reward init param"
    },
    {
      "code": 6038,
      "name": "invalidRewardDesiredAmount",
      "msg": "Invalid collect reward desired amount"
    },
    {
      "code": 6039,
      "name": "invalidRewardInputAccountNumber",
      "msg": "Invalid collect reward input account number"
    },
    {
      "code": 6040,
      "name": "invalidRewardPeriod",
      "msg": "Invalid reward period"
    },
    {
      "code": 6041,
      "name": "notApproveUpdateRewardEmissiones",
      "msg": "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    },
    {
      "code": 6042,
      "name": "unInitializedRewardInfo",
      "msg": "uninitialized reward info"
    },
    {
      "code": 6043,
      "name": "notSupportMint",
      "msg": "Not support token_2022 mint extension"
    },
    {
      "code": 6044,
      "name": "missingTickArrayBitmapExtensionAccount",
      "msg": "Missing tickarray bitmap extension account"
    },
    {
      "code": 6045,
      "name": "insufficientLiquidityForDirection",
      "msg": "Insufficient liquidity for this direction"
    },
    {
      "code": 6046,
      "name": "maxTokenOverflow",
      "msg": "Max token overflow"
    },
    {
      "code": 6047,
      "name": "calculateOverflow",
      "msg": "Calculate overflow"
    },
    {
      "code": 6048,
      "name": "transferFeeCalculateNotMatch",
      "msg": "TransferFee calculate not match"
    }
  ],
  "types": [
    {
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "docs": [
              "Address of the protocol owner"
            ],
            "type": "pubkey"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The tick spacing"
            ],
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "paddingU32",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "pubkey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "collectPersonalFeeEvent",
      "docs": [
        "Emitted when tokens are collected for a position"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "positionNftMint",
            "docs": [
              "The ID of the token for which underlying tokens were collected"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipientTokenAccount0",
            "docs": [
              "The token account that received the collected token_0 tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipientTokenAccount1",
            "docs": [
              "The token account that received the collected token_1 tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount0",
            "docs": [
              "The amount of token_0 owed to the position that was collected"
            ],
            "type": "u64"
          },
          {
            "name": "amount1",
            "docs": [
              "The amount of token_1 owed to the position that was collected"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "collectProtocolFeeEvent",
      "docs": [
        "Emitted when the collected protocol fees are withdrawn by the factory owner"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolState",
            "docs": [
              "The pool whose protocol fee is collected"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipientTokenAccount0",
            "docs": [
              "The address that receives the collected token_0 protocol fees"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipientTokenAccount1",
            "docs": [
              "The address that receives the collected token_1 protocol fees"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount0",
            "docs": [
              "The amount of token_0 protocol fees that is withdrawn"
            ],
            "type": "u64"
          },
          {
            "name": "amount1",
            "docs": [
              "The amount of token_0 protocol fees that is withdrawn"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "configChangeEvent",
      "docs": [
        "Emitted when create or update a config"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "protocolFeeRate",
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "createPersonalPositionEvent",
      "docs": [
        "Emitted when create a new position"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolState",
            "docs": [
              "The pool for which liquidity was added"
            ],
            "type": "pubkey"
          },
          {
            "name": "minter",
            "docs": [
              "The address that create the position"
            ],
            "type": "pubkey"
          },
          {
            "name": "nftOwner",
            "docs": [
              "The owner of the position and recipient of any minted liquidity"
            ],
            "type": "pubkey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity minted to the position range"
            ],
            "type": "u128"
          },
          {
            "name": "depositAmount0",
            "docs": [
              "The amount of token_0 was deposit for the liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "depositAmount1",
            "docs": [
              "The amount of token_1 was deposit for the liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "depositAmount0TransferFee",
            "docs": [
              "The token transfer fee for deposit_amount_0"
            ],
            "type": "u64"
          },
          {
            "name": "depositAmount1TransferFee",
            "docs": [
              "The token transfer fee for deposit_amount_1"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "decreaseLiquidityEvent",
      "docs": [
        "Emitted when liquidity is decreased."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "positionNftMint",
            "docs": [
              "The ID of the token for which liquidity was decreased"
            ],
            "type": "pubkey"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount by which liquidity for the position was decreased"
            ],
            "type": "u128"
          },
          {
            "name": "decreaseAmount0",
            "docs": [
              "The amount of token_0 that was paid for the decrease in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "decreaseAmount1",
            "docs": [
              "The amount of token_1 that was paid for the decrease in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "feeAmount0",
            "type": "u64"
          },
          {
            "name": "feeAmount1",
            "docs": [
              "The amount of token_1 fee"
            ],
            "type": "u64"
          },
          {
            "name": "rewardAmounts",
            "docs": [
              "The amount of rewards"
            ],
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          },
          {
            "name": "transferFee0",
            "docs": [
              "The amount of token_0 transfer fee"
            ],
            "type": "u64"
          },
          {
            "name": "transferFee1",
            "docs": [
              "The amount of token_1 transfer fee"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "hooksAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "authority of the hook"
            ],
            "type": "pubkey"
          },
          {
            "name": "safeHookPrograms",
            "docs": [
              "hook programs"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "unsafeHookPrograms",
            "docs": [
              "unsafe hook programs"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "pendingHookPrograms",
            "docs": [
              "pending hook programs"
            ],
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "increaseLiquidityEvent",
      "docs": [
        "Emitted when liquidity is increased."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "positionNftMint",
            "docs": [
              "The ID of the token for which liquidity was increased"
            ],
            "type": "pubkey"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount by which liquidity for the NFT position was increased"
            ],
            "type": "u128"
          },
          {
            "name": "amount0",
            "docs": [
              "The amount of token_0 that was paid for the increase in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "amount1",
            "docs": [
              "The amount of token_1 that was paid for the increase in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "amount0TransferFee",
            "docs": [
              "The token transfer fee for amount_0"
            ],
            "type": "u64"
          },
          {
            "name": "amount1TransferFee",
            "docs": [
              "The token transfer fee for amount_1"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initializeRewardParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Token reward per second are earned per unit of liquidity"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "liquidityCalculateEvent",
      "docs": [
        "Emitted when liquidity decreased or increase."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolLiquidity",
            "docs": [
              "The pool liquidity before decrease or increase"
            ],
            "type": "u128"
          },
          {
            "name": "poolSqrtPriceX64",
            "docs": [
              "The pool price when decrease or increase in liquidity"
            ],
            "type": "u128"
          },
          {
            "name": "poolTick",
            "docs": [
              "The pool tick when decrease or increase in liquidity"
            ],
            "type": "i32"
          },
          {
            "name": "calcAmount0",
            "docs": [
              "The amount of token_0 that was calculated for the decrease or increase in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "calcAmount1",
            "docs": [
              "The amount of token_1 that was calculated for the decrease or increase in liquidity"
            ],
            "type": "u64"
          },
          {
            "name": "tradeFeeOwed0",
            "type": "u64"
          },
          {
            "name": "tradeFeeOwed1",
            "docs": [
              "The amount of token_1 fee"
            ],
            "type": "u64"
          },
          {
            "name": "transferFee0",
            "docs": [
              "The amount of token_0 transfer fee without trade_fee_amount_0"
            ],
            "type": "u64"
          },
          {
            "name": "transferFee1",
            "docs": [
              "The amount of token_1 transfer fee without trade_fee_amount_0"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidityChangeEvent",
      "docs": [
        "Emitted pool liquidity change when increase and decrease liquidity"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolState",
            "docs": [
              "The pool for swap"
            ],
            "type": "pubkey"
          },
          {
            "name": "tick",
            "docs": [
              "The tick of the pool"
            ],
            "type": "i32"
          },
          {
            "name": "tickLower",
            "docs": [
              "The tick lower of position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpper",
            "docs": [
              "The tick lower of position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidityBefore",
            "docs": [
              "The liquidity of the pool before liquidity change"
            ],
            "type": "u128"
          },
          {
            "name": "liquidityAfter",
            "docs": [
              "The liquidity of the pool after liquidity change"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u32"
          },
          {
            "name": "tickCumulative",
            "docs": [
              "the cumulative of tick during the duration time"
            ],
            "type": "i64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "recentEpoch",
            "docs": [
              "recent update epoch"
            ],
            "type": "u64"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "poolId",
            "docs": [
              "belongs to which pool"
            ],
            "type": "pubkey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "observation"
                  }
                },
                100
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "operationState",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "operationOwners",
            "docs": [
              "Address of the operation owner"
            ],
            "type": {
              "array": [
                "pubkey",
                10
              ]
            }
          },
          {
            "name": "whitelistMints",
            "docs": [
              "The mint address of whitelist to emit reward"
            ],
            "type": {
              "array": [
                "pubkey",
                100
              ]
            }
          }
        ]
      }
    },
    {
      "name": "personalPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "nftMint",
            "docs": [
              "Mint address of the tokenized position"
            ],
            "type": "pubkey"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "pubkey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "positionRewardInfo"
                  }
                },
                3
              ]
            }
          },
          {
            "name": "recentEpoch",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolCreatedEvent",
      "docs": [
        "Emitted when a pool is created and initialized with a starting price",
        ""
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint0",
            "docs": [
              "The first token of the pool by address sort order"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenMint1",
            "docs": [
              "The second token of the pool by address sort order"
            ],
            "type": "pubkey"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The minimum number of ticks between initialized ticks"
            ],
            "type": "u16"
          },
          {
            "name": "poolState",
            "docs": [
              "The address of the created pool"
            ],
            "type": "pubkey"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "The initial sqrt price of the pool, as a Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "tick",
            "docs": [
              "The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool"
            ],
            "type": "i32"
          },
          {
            "name": "tokenVault0",
            "docs": [
              "Vault of token_0"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenVault1",
            "docs": [
              "Vault of token_1"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "poolState",
      "docs": [
        "The pool state",
        "",
        "PDA of `[POOL_SEED, config, token_mint_0, token_mint_1]`",
        ""
      ],
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "ammConfig",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenMint0",
            "docs": [
              "Token pair of the pool, where token_mint_0 address < token_mint_1 address"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenMint1",
            "type": "pubkey"
          },
          {
            "name": "tokenVault0",
            "docs": [
              "Token pair vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenVault1",
            "type": "pubkey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account key"
            ],
            "type": "pubkey"
          },
          {
            "name": "mintDecimals0",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mintDecimals1",
            "type": "u8"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The minimum number of ticks between initialized ticks"
            ],
            "type": "u16"
          },
          {
            "name": "liquidity",
            "docs": [
              "The currently in range liquidity available to the pool."
            ],
            "type": "u128"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "The current price of the pool as a sqrt(token_1/token_0) Q64.64 value"
            ],
            "type": "u128"
          },
          {
            "name": "tickCurrent",
            "docs": [
              "The current tick of the pool, i.e. according to the last tick transition that was run."
            ],
            "type": "i32"
          },
          {
            "name": "padding3",
            "type": "u16"
          },
          {
            "name": "padding4",
            "type": "u16"
          },
          {
            "name": "feeGrowthGlobal0X64",
            "docs": [
              "The fee growth as a Q64.64 number, i.e. fees of token_0 and token_1 collected per",
              "unit of liquidity for the entire life of the pool."
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthGlobal1X64",
            "type": "u128"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the protocol."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "swapInAmountToken0",
            "docs": [
              "The amounts in and out of swap token_0 and token_1"
            ],
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapInAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken0",
            "type": "u128"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable open position and increase liquidity, 0: normal",
              "bit1, 1: disable decrease liquidity, 0: normal",
              "bit2, 1: disable collect fee, 0: normal",
              "bit3, 1: disable collect reward, 0: normal",
              "bit4, 1: disable swap, 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "padding",
            "docs": [
              "Leave blank for future use"
            ],
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "rewardInfo"
                  }
                },
                3
              ]
            }
          },
          {
            "name": "tickArrayBitmap",
            "docs": [
              "Packed initialized tick array state"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "totalFeesToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesToken1",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "recentEpoch",
            "type": "u64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                24
              ]
            }
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "positionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "growthInsideLastX64",
            "type": "u128"
          },
          {
            "name": "rewardAmountOwed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "protocolPositionState",
      "docs": [
        "Info stored for each user's position"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "pubkey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1"
            ],
            "type": "u64"
          },
          {
            "name": "rewardGrowthInside",
            "docs": [
              "The reward growth per unit of liquidity as of the last update to liquidity"
            ],
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "recentEpoch",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "rewardInfo",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardState",
            "docs": [
              "Reward state"
            ],
            "type": "u8"
          },
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "docs": [
              "Reward last update time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Q64.64 number indicates how many tokens per second are earned per unit of liquidity."
            ],
            "type": "u128"
          },
          {
            "name": "rewardTotalEmissioned",
            "docs": [
              "The total amount of reward emissioned"
            ],
            "type": "u64"
          },
          {
            "name": "rewardClaimed",
            "docs": [
              "The total amount of claimed reward"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Reward token mint."
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenVault",
            "docs": [
              "Reward vault token account."
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "The owner that has permission to set reward param"
            ],
            "type": "pubkey"
          },
          {
            "name": "rewardGrowthGlobalX64",
            "docs": [
              "Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward",
              "emissions were turned on."
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "supportMintAssociated",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "mint",
            "docs": [
              "Address of the supported token22 mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "swapEvent",
      "docs": [
        "Emitted by when a swap is performed for a pool"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolState",
            "docs": [
              "The pool for which token_0 and token_1 were swapped"
            ],
            "type": "pubkey"
          },
          {
            "name": "sender",
            "docs": [
              "The address that initiated the swap call, and that received the callback"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenAccount0",
            "docs": [
              "The payer token account in zero for one swaps, or the recipient token account",
              "in one for zero swaps"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenAccount1",
            "docs": [
              "The payer token account in one for zero swaps, or the recipient token account",
              "in zero for one swaps"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount0",
            "docs": [
              "The real delta amount of the token_0 of the pool or user"
            ],
            "type": "u64"
          },
          {
            "name": "transferFee0",
            "docs": [
              "The transfer fee charged by the withheld_amount of the token_0"
            ],
            "type": "u64"
          },
          {
            "name": "amount1",
            "docs": [
              "The real delta of the token_1 of the pool or user"
            ],
            "type": "u64"
          },
          {
            "name": "transferFee1",
            "docs": [
              "The transfer fee charged by the withheld_amount of the token_1"
            ],
            "type": "u64"
          },
          {
            "name": "zeroForOne",
            "docs": [
              "if true, amount_0 is negtive and amount_1 is positive"
            ],
            "type": "bool"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "The sqrt(price) of the pool after the swap, as a Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "liquidity",
            "docs": [
              "The liquidity of the pool after the swap"
            ],
            "type": "u128"
          },
          {
            "name": "tick",
            "docs": [
              "The log base 1.0001 of price of the pool after the swap"
            ],
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "tickArrayBitmapExtension",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "pubkey"
          },
          {
            "name": "positiveTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is positive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          },
          {
            "name": "negativeTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is negitive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "pubkey"
          },
          {
            "name": "startTickIndex",
            "type": "i32"
          },
          {
            "name": "ticks",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "tickState"
                  }
                },
                60
              ]
            }
          },
          {
            "name": "initializedTickCount",
            "type": "u8"
          },
          {
            "name": "recentEpoch",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                107
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tick",
            "type": "i32"
          },
          {
            "name": "liquidityNet",
            "docs": [
              "Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left)"
            ],
            "type": "i128"
          },
          {
            "name": "liquidityGross",
            "docs": [
              "The total position liquidity that references this tick"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside0X64",
            "docs": [
              "Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)",
              "only has relative meaning, not absolute — the value depends on when the tick is initialized"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside1X64",
            "type": "u128"
          },
          {
            "name": "rewardGrowthsOutsideX64",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                13
              ]
            }
          }
        ]
      }
    },
    {
      "name": "updateRewardInfosEvent",
      "docs": [
        "Emitted when Reward are updated for a pool"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardGrowthGlobalX64",
            "docs": [
              "Reward info"
            ],
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          }
        ]
      }
    }
  ]
};
