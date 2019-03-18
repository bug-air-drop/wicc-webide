using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContractIDE.Models
{
    public class BaseRsp<T>
    {
        /// <summary>
        /// 请求是否成功
        /// </summary>
        public bool success { get; set; }

        /// <summary>
        /// 指示错误的类型
        /// </summary>
        public int error { get; set; }

        /// <summary>
        /// 成功或失败的相关描述
        /// </summary>
        public string msg { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public T data { get; set; }
    }
}
