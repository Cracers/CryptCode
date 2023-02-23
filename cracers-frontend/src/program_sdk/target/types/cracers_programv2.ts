export type CracersProgram = {
  version: "0.1.0";
  name: "cracers_program";
  instructions: [
    {
      name: "createRace";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "race";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "raceName";
          type: "string";
        },
        {
          name: "entryFee";
          type: "u64";
        },
        {
          name: "raceRank";
          type: "u8";
        },
        {
          name: "raceStart";
          type: "u64";
        },
        {
          name: "raceEnd";
          type: "u64";
        },
        {
          name: "numberOfCheckpoints";
          type: "u8";
        },
        {
          name: "estimations";
          type: {
            vec: "string";
          };
        },
        {
          name: "rewardXp";
          type: "u32";
        }
      ];
    },
    {
      name: "register";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "racer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "racerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "race";
          isMut: true;
          isSigner: false;
        },
        {
          name: "devTreasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "estimations";
          type: {
            vec: {
              vec: "u64";
            };
          };
        }
      ];
    },
    {
      name: "closeRegistration";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "racer";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createAccount";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "racerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "racerName";
          type: "string";
        }
      ];
    },
    {
      name: "claimXp";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "racerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "race";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "payout";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "race";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "closeAccount";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "racerAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "race";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "entryFee";
            type: "u64";
          },
          {
            name: "raceRank";
            type: "u8";
          },
          {
            name: "raceStart";
            type: "u64";
          },
          {
            name: "raceEnd";
            type: "u64";
          },
          {
            name: "registeredRacers";
            type: "u64";
          },
          {
            name: "numberOfCheckpoints";
            type: "u8";
          },
          {
            name: "estimations";
            type: {
              vec: "string";
            };
          },
          {
            name: "rewardXp";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "racer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "race";
            type: "publicKey";
          },
          {
            name: "checkpointEstimations";
            type: {
              vec: {
                vec: "u64";
              };
            };
          },
          {
            name: "xp";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "racerAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "xp";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};

export const IDL: CracersProgram = {
  version: "0.1.0",
  name: "cracers_program",
  instructions: [
    {
      name: "createRace",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "race",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "raceName",
          type: "string",
        },
        {
          name: "entryFee",
          type: "u64",
        },
        {
          name: "raceRank",
          type: "u8",
        },
        {
          name: "raceStart",
          type: "u64",
        },
        {
          name: "raceEnd",
          type: "u64",
        },
        {
          name: "numberOfCheckpoints",
          type: "u8",
        },
        {
          name: "estimations",
          type: {
            vec: "string",
          },
        },
        {
          name: "rewardXp",
          type: "u32",
        },
      ],
    },
    {
      name: "register",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "racer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "racerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "race",
          isMut: true,
          isSigner: false,
        },
        {
          name: "devTreasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "estimations",
          type: {
            vec: {
              vec: "u64",
            },
          },
        },
      ],
    },
    {
      name: "closeRegistration",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "racer",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createAccount",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "racerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "racerName",
          type: "string",
        },
      ],
    },
    {
      name: "claimXp",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "racerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "race",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "payout",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "race",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "closeAccount",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "racerAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "race",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "entryFee",
            type: "u64",
          },
          {
            name: "raceRank",
            type: "u8",
          },
          {
            name: "raceStart",
            type: "u64",
          },
          {
            name: "raceEnd",
            type: "u64",
          },
          {
            name: "registeredRacers",
            type: "u64",
          },
          {
            name: "numberOfCheckpoints",
            type: "u8",
          },
          {
            name: "estimations",
            type: {
              vec: "string",
            },
          },
          {
            name: "rewardXp",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "racer",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "race",
            type: "publicKey",
          },
          {
            name: "checkpointEstimations",
            type: {
              vec: {
                vec: "u64",
              },
            },
          },
          {
            name: "xp",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "racerAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "xp",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
};
