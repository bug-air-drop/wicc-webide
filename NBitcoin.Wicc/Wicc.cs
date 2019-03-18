using System;
using NBitcoin.DataEncoders;

namespace NBitcoin.Wicc
{
    public class Wicc : NetworkSetBase
    {
        public static Wicc Instance { get; } = new Wicc();

        public override string CryptoCode => "WICC";

        protected override void PostInit()
        {
            RegisterDefaultCookiePath("WaykiChain");
        }

        /// <summary>
        /// 正式网络参数
        /// </summary>
        /// <returns></returns>
        protected override NetworkBuilder CreateMainnet()
        {
            var builder = new NetworkBuilder();
            builder.SetConsensus(new Consensus()
            {
                SubsidyHalvingInterval = 210000,
                MajorityEnforceBlockUpgrade = 750,
                MajorityRejectBlockOutdated = 950,
                MajorityWindow = 1000,
                BIP34Hash = new uint256("0x000000000000024b89b42a942fe0d9fea3bb44ab7bd1b19115dd6a759c0808b8"),
                PowLimit = new Target(
                        new uint256("00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff")),
                PowTargetTimespan = TimeSpan.FromSeconds(14 * 24 * 60 * 60),
                PowTargetSpacing = TimeSpan.FromSeconds(10 * 60),
                PowAllowMinDifficultyBlocks = false,
                PowNoRetargeting = false,
                RuleChangeActivationThreshold = 6048,
                MinerConfirmationWindow = 8064,
                CoinbaseMaturity = 100,
                ConsensusFactory = WiccConsensusFactory.Instance,

            })

            .SetBase58Bytes(Base58Type.PUBKEY_ADDRESS, new byte[] { 73 })//地址wif参数
            .SetBase58Bytes(Base58Type.SCRIPT_ADDRESS, new byte[] { 51 })
            .SetBase58Bytes(Base58Type.SECRET_KEY, new byte[] { 153 })//私钥wif参数
            .SetBase58Bytes(Base58Type.EXT_PUBLIC_KEY, new byte[] { 0x4c, 0x1d, 0x3d, 0x5f })
            .SetBase58Bytes(Base58Type.EXT_SECRET_KEY, new byte[] { 0x4c, 0x23, 0x3f, 0x4b })
            //.SetBase58Bytes(Base58Type.ACC_ADDRESS, new byte[] { 0 })
            //.SetNetworkStringParser(new LitecoinMainnetAddressStringParser())
            .SetBech32(Bech32Type.WITNESS_PUBKEY_ADDRESS, Encoders.Bech32("wicc"))
            .SetBech32(Bech32Type.WITNESS_SCRIPT_ADDRESS, Encoders.Bech32("wicc"))
            .SetMagic(0x1a1d42ff)
            .SetPort(8920)
            .SetRPCPort(18900)

            .SetName("wicc-main")
            .AddAlias("wicc-mainnet")
            .AddAlias("wiccoin-mainnet")
            .AddAlias("wiccoin-main")
            .AddDNSSeeds(new[]
            {
                new DNSSeedData("n1.waykichain.net", "seed1.waykichain.net"),
                new DNSSeedData("n2.waykichain.net", "seed2.waykichain.net"),
            });

            return builder;
        }

        protected override NetworkBuilder CreateTestnet()
        {
            var builder = new NetworkBuilder();
            builder.SetConsensus(new Consensus()
            {
                SubsidyHalvingInterval = 210000,
                MajorityEnforceBlockUpgrade = 750,
                MajorityRejectBlockOutdated = 950,
                MajorityWindow = 1000,
                BIP34Hash = new uint256("0x000000000000024b89b42a942fe0d9fea3bb44ab7bd1b19115dd6a759c0808b8"),
                PowLimit = new Target(
                        new uint256("00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff")),
                PowTargetTimespan = TimeSpan.FromSeconds(14 * 24 * 60 * 60),
                PowTargetSpacing = TimeSpan.FromSeconds(10 * 60),
                PowAllowMinDifficultyBlocks = false,
                PowNoRetargeting = false,
                RuleChangeActivationThreshold = 6048,
                MinerConfirmationWindow = 8064,
                CoinbaseMaturity = 100,
                ConsensusFactory = WiccConsensusFactory.Instance
            })

                .SetBase58Bytes(Base58Type.PUBKEY_ADDRESS, new byte[] { 135 })
                .SetBase58Bytes(Base58Type.SCRIPT_ADDRESS, new byte[] { 88 })
                .SetBase58Bytes(Base58Type.SECRET_KEY, new byte[] { 210 })
                .SetBase58Bytes(Base58Type.EXT_PUBLIC_KEY, new byte[] { 0x7d, 0x57, 0x3a, 0x2c })
                .SetBase58Bytes(Base58Type.EXT_SECRET_KEY, new byte[] { 0x7d, 0x5c, 0x5a, 0x26 })
                //.SetBase58Bytes(Base58Type.ACC_ADDRESS, new byte[] { 0 })
                //.SetNetworkStringParser(new LitecoinMainnetAddressStringParser())
                .SetBech32(Bech32Type.WITNESS_PUBKEY_ADDRESS, Encoders.Bech32("wicc"))
                .SetBech32(Bech32Type.WITNESS_SCRIPT_ADDRESS, Encoders.Bech32("wicc"))
                .SetMagic(0xD75C7DFD)
                .SetPort(18921)
                .SetRPCPort(18901)
                .SetName("wicc-test")
                .AddAlias("wicc-testnet")
                .AddAlias("wiccoin-testnet")
                .AddAlias("wiccoin-test")
                .AddDNSSeeds(new[]
                {
                    new DNSSeedData("n1.waykichain.net", "seed1.waykichain.net"),
                    new DNSSeedData("n2.waykichain.net", "seed2.waykichain.net"),
                });

            return builder;
        }

        protected override NetworkBuilder CreateRegtest()
        {
            var builder = new NetworkBuilder();
            builder.SetConsensus(new Consensus()
            {
                SubsidyHalvingInterval = 210000,
                MajorityEnforceBlockUpgrade = 750,
                MajorityRejectBlockOutdated = 950,
                MajorityWindow = 1000,
                BIP34Hash = new uint256("0x000000000000024b89b42a942fe0d9fea3bb44ab7bd1b19115dd6a759c0808b8"),
                PowLimit = new Target(
                        new uint256("00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff")),
                PowTargetTimespan = TimeSpan.FromSeconds(14 * 24 * 60 * 60),
                PowTargetSpacing = TimeSpan.FromSeconds(10 * 60),
                PowAllowMinDifficultyBlocks = false,
                PowNoRetargeting = false,
                RuleChangeActivationThreshold = 6048,
                MinerConfirmationWindow = 8064,
                CoinbaseMaturity = 100,
                ConsensusFactory = WiccConsensusFactory.Instance
            })

                .SetBase58Bytes(Base58Type.PUBKEY_ADDRESS, new byte[] { 73 })
                .SetBase58Bytes(Base58Type.SCRIPT_ADDRESS, new byte[] { 51 })
                .SetBase58Bytes(Base58Type.SECRET_KEY, new byte[] { 153 })
                .SetBase58Bytes(Base58Type.EXT_PUBLIC_KEY, new byte[] { 0x4c, 0x1d, 0x3d, 0x5f })
                .SetBase58Bytes(Base58Type.EXT_SECRET_KEY, new byte[] { 0x4c, 0x23, 0x3f, 0x4b })
                //.SetBase58Bytes(Base58Type.ACC_ADDRESS, new byte[] { 0 })
                //.SetNetworkStringParser(new LitecoinMainnetAddressStringParser())
                .SetBech32(Bech32Type.WITNESS_PUBKEY_ADDRESS, Encoders.Bech32("wicc"))
                .SetBech32(Bech32Type.WITNESS_SCRIPT_ADDRESS, Encoders.Bech32("wicc"))
                .SetMagic(0xFF421D1A)
                .SetPort(8922)
                .SetRPCPort(18902)
                .SetName("wicc-reg")
                .AddAlias("wicc-regnet")
                .AddAlias("wiccoin-regnet")
                .AddAlias("wiccoin-reg")
                .AddDNSSeeds(new[]
                {
                    new DNSSeedData("n1.waykichain.net", "seed1.waykichain.net"),
                    new DNSSeedData("n2.waykichain.net", "seed2.waykichain.net"),
                });

            return builder;
        }

    }
}
