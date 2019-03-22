using System;
using System.Text;

namespace NBitcoin.Wicc
{
    public static class HexHelper
    {
        public static byte[] ToByteArray(string s)
        {
            s = s.Replace("\t", String.Empty).Replace("\r", String.Empty).Replace("\n", String.Empty);
            var buffer = new byte[s.Length / 2];
            for (var i = 0; i < s.Length; i += 2)
                buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
            return buffer;
        }

        public static string ToHexString(byte[] bytes)
        {
            var sb = new StringBuilder();

            foreach (var item in bytes)
            {
                sb.Append(item.ToString("x2"));
            }

            return sb.ToString();
        }
    }
}
