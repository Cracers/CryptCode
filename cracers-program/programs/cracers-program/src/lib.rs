use anchor_lang::prelude::*;
use solana_program::program::invoke;

declare_id!("3WFbj2c24xazpewqPTCjVpnMnLBMJneZy5Fh4H7BTGBW");

#[program]
pub mod cracers_program {
    use super::*;

    pub fn create_race(
        ctx: Context<CreateRace>,
        race_name: String,
        entry_fee: u64,
        race_rank: u8,
        race_start: u64,
        race_end: u64,
        number_of_checkpoints: u8,
        estimations: Vec<String>,
        reward_xp: u32,
    ) -> Result<()> {
        let race = &mut ctx.accounts.race;
        race.name = race_name;
        race.authority = ctx.accounts.signer.key();
        race.entry_fee = entry_fee;
        race.race_rank = race_rank;
        race.race_start = race_start;
        race.race_end = race_end;
        race.registered_racers = 0;
        race.number_of_checkpoints = number_of_checkpoints;

        // @TODO add check if coins greater then 3 we need to resize the account
        race.estimations = estimations;
        race.reward_xp = reward_xp;

        race.bump = *ctx.bumps.get("race").unwrap();
        Ok(())
    }

    pub fn register(ctx: Context<Register>, estimations: Vec<Vec<u64>>) -> Result<()> {
        let racer = &mut ctx.accounts.racer;
        let race = &mut ctx.accounts.race;
        // Take the entry fee and send it to the treasury
        if race.entry_fee > 0 {
            let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.signer.key,
                &ctx.accounts.treasury.key,
                race.entry_fee,
            );
            invoke(
                &sol_transfer,
                &[
                    ctx.accounts.signer.to_account_info().clone(),
                    ctx.accounts.treasury.clone(),
                    ctx.accounts.system_program.to_account_info().clone(),
                ],
            )?;
        }

        // Take royaltie fee
        let fee_sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.signer.key,
            &ctx.accounts.dev_treasury.key,
            2500000,
        );
        invoke(
            &fee_sol_transfer,
            &[
                ctx.accounts.signer.to_account_info().clone(),
                ctx.accounts.dev_treasury.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        // Set up racer account
        racer.name = ctx.accounts.racer_account.name.clone();
        racer.xp = ctx.accounts.racer_account.xp;
        racer.address = ctx.accounts.signer.key();
        racer.race = race.key();
        racer.checkpoint_estimations = estimations;
        racer.bump = *ctx.bumps.get("racer").unwrap();

        Ok(())
    }

    pub fn close_registration(_ctx: Context<CloseRegistration>) -> Result<()> {
        Ok(())
    }

    pub fn create_account(ctx: Context<CreateAccount>, racer_name: String) -> Result<()> {
        let racer_account = &mut ctx.accounts.racer_account;

        // Take the royalty fee and send it to the dev treasury
        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.signer.key,
            &ctx.accounts.treasury.key,
            2000000,
        );
        invoke(
            &sol_transfer,
            &[
                ctx.accounts.signer.to_account_info().clone(),
                ctx.accounts.treasury.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        // Set up racer account
        racer_account.name = racer_name;
        //@TODO add discord account + discriminator, plus discord id, add twitter handle
        racer_account.address = ctx.accounts.signer.key();
        racer_account.xp = 0;
        racer_account.bump = *ctx.bumps.get("racer_account").unwrap();

        Ok(())
    }

    pub fn claim_xp(ctx: Context<ClaimXp>) -> Result<()> {
        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.signer.key,
            &ctx.accounts.treasury.key,
            2000000,
        );
        invoke(
            &sol_transfer,
            &[
                ctx.accounts.signer.to_account_info().clone(),
                ctx.accounts.treasury.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;
        let racer = &mut ctx.accounts.racer_account;
        racer.xp += ctx.accounts.race.reward_xp;

        Ok(())
    }

    pub fn close_account(_ctx: Context<CloseAccount>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(race_name: String)]
pub struct CreateRace<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        space =  Race::LEN + 8,
        seeds =[
            b"race".as_ref(),
            race_name.as_ref(),
        ],
        bump,
        payer = signer,

    )]
    pub race: Account<'info, Race>,

    pub system_program: Program<'info, System>,
}

//State
#[account]
pub struct Race {
    pub name: String,              //25: Max length of name is 25 characters
    pub authority: Pubkey,         //32
    pub treasury_address: Pubkey,  //32
    pub entry_fee: u64,            // 8
    pub race_rank: u8,             // 1
    pub race_start: u64,           // 8
    pub race_end: u64,             // 8
    pub registered_racers: u64,    // 8
    pub number_of_checkpoints: u8, // 1
    pub estimations: Vec<String>,  // 5 * number of estimations
    pub reward_xp: u32,            // 4
    pub bump: u8,                  // 1
}

impl Race {
    pub const LEN: usize = 1 +
        25 + // Name
        32 + // Authority
        32 + // Treasury Address
        8 +  // Entry Fee
        1 +  // Race Rank
        8 +  // Race Start
        8 +  // Race End
        8 +  // Registered Racers
        1 +  // Number of Checkpoints
        15 + // Number of Coins starting point (default 3 coins)
        1; // Bump
}

#[derive(Accounts)]
pub struct Register<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        space =  Racer::LEN + 8,
        seeds =[
            b"racer".as_ref(),
            signer.key().as_ref(),
            race.key().as_ref(),
        ],
        bump,
        payer = signer,
    )]
    pub racer: Account<'info, Racer>,

    #[account(mut)]
    pub racer_account: Account<'info, RacerAccount>,

    #[account(mut)]
    pub race: Account<'info, Race>,

    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(mut)]
    pub dev_treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimXp<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub racer_account: Account<'info, RacerAccount>,

    #[account(mut)]
    pub race: Account<'info, Race>,

    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseRegistration<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        close = signer
    )]
    pub racer: Account<'info, Racer>,
}

#[account]
pub struct Racer {
    pub name: String,                          //25: Max length of name is 25 characters
    pub address: Pubkey,                       //32
    pub race: Pubkey,                          //32
    pub checkpoint_estimations: Vec<Vec<u64>>, // 8 * number of checkpoints
    pub xp: u32,                               // 1
    pub bump: u8,                              // 1
}

impl Racer {
    pub const LEN: usize = 1 +
        25 + // Name
        32 + // Address
        32 + // race address
        32 * 15 +  // Estimation start
        1 + // Level
        1; // Bump
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        space =  RacerAccount::LEN + 8,
        seeds =[
            b"account".as_ref(),
            signer.key().as_ref(),
        ],
        bump,
        payer = signer,
    )]
    pub racer_account: Account<'info, RacerAccount>,

    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, close = signer)]
    pub racer_account: Account<'info, RacerAccount>,
}

#[account]
pub struct RacerAccount {
    pub name: String,    //25: Max length of name is 25 characters
    pub address: Pubkey, //32
    pub xp: u32,         // 4
    pub bump: u8,        // 1
}

impl RacerAccount {
    pub const LEN: usize = 1 +
        25 + // Name
        32 + // Address
        4 + // Experience
        1; // Bump
}
