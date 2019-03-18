namespace NBitcoin.Wicc
{
    public class WiccConsensusFactory : ConsensusFactory
    {
        public static WiccConsensusFactory Instance { get; } = new WiccConsensusFactory();
    }
}
