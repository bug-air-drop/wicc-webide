using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ContractIDE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NBitcoin;
using NBitcoin.SPV;
using NBitcoin.Wicc.Core;
using Newtonsoft.Json;

namespace ContractIDE.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        [HttpPost("Publish")]
        public BaseRsp<string> Publish(Models.ContractPublichModel model)
        {
            var resault = new BaseRsp<string>();
            var net = model.Net == "test" ? NBitcoin.Wicc.Wicc.Instance.Testnet : NBitcoin.Wicc.Wicc.Instance.Mainnet;
            var apiUrl = "http://rpc.wic.me/jsonrpc/" + model.Net;

            BitcoinPubKeyAddress address = null;

            try
            {
                var secret = new BitcoinSecret(model.PrivKey, net);
                address = secret.GetAddress();
            }
            catch
            {
                resault.data = "提供的私钥有误, 请检查私钥或网络";
                return resault;
            }

            if (model.Contract.Length > 64 * 1024)
            {
                resault.data = "合约代码长度超过64KB";
                return resault;
            }

            var accountInfo = HttpGet(apiUrl + "/GetAccountInfo/" + address.ToString());

            if (accountInfo == null)
            {
                resault.data = "RPC钱包服务暂时不可用";
                return resault;
            }

            var regId = accountInfo.data.regID?.ToString();

            if (string.IsNullOrEmpty(regId))
            {
                resault.data = "该地址未激活";
                return resault;
            }
            else if (long.Parse(accountInfo.data.balance.ToString()) < long.Parse(model.Fee))
            {
                resault.data = "该地址当前余额不足以支付手续费";
                return resault;
            }

            WalletServiceApi.Wallet wt = new WalletServiceApi.Wallet()
            {
                Network = net,
                Prikey = model.PrivKey,
                UserId = new UserId(uint.Parse(regId.Split('-')[0]), uint.Parse(regId.Split('-')[1]))
            };

            var height = HttpGet(apiUrl + "/GetBlockCount");

            try
            {
                var sign = wt.GetRegisteAppRaw(string.Empty, model.Contract, ulong.Parse(model.Fee), uint.Parse(height.data.ToString()));

                var submittx = HttpPost<dynamic>(apiUrl + "/SubmitTx", "\"" + sign + "\"");

                if (!submittx.success)
                {
                    resault.data = "上链失败: " + submittx.msg;
                    return resault;
                }
                else
                {
                    resault.data = "交易哈希: " + submittx.data.hash;
                    resault.success = true;
                    return resault;
                }

            }
            catch (Exception ex)
            {
                resault.data = "签名失败: " + ex.Message;
                return resault;
            }


            resault.success = false;
            resault.data = "发布失败";

            return resault;
        }

        /// <summary>
        /// 发起GET同步请求
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static dynamic HttpGet(string url)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("ContentType", "application/json");
                HttpResponseMessage response = client.GetAsync(url).Result;
                return response.Content.ReadAsAsync<dynamic>().Result;
            }
        }

        public static BaseRsp<T> HttpPost<T>(string url, string postData)
        {
            using (HttpClient client = new HttpClient())
            {
                using (HttpContent httpContent = new StringContent(postData, Encoding.UTF8, "application/json"))
                {
                    HttpResponseMessage response = client.PostAsync(url, httpContent).Result;
                    //var re = response.Content.ReadAsStringAsync().Result;
                    return response.Content.ReadAsAsync<BaseRsp<T>>().Result;
                }
            }
        }
    }
}