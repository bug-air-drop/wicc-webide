'use strict';


var $ = require('./util/preconditions');
var Mnemonic = require('./mnemonic');
var Address = require('./address');
var RegisterAccountTx = require('./transaction/registeraccounttx');
var CommonTx = require('./transaction/commontx');
var ContractTx = require('./transaction/contracttx');
var DelegateTx = require('./transaction/delegatetx');
var Random = require('./crypto/random');
var Hash = require('./crypto/hash');
var buffer = require('buffer');
var scrypt = require('scryptsy');
var aes = require('./aes-cbc');
var CryptoJS = require('crypto-js');
var HDPrivateKey = require('./hdprivatekey');
var CustomBuffer = require('./util/buffer');
var RegisterAppTx = require('./transaction/registerapptx');
var _ = require('./lodash');

var WiccApi = function WiccApi(arg) {
    if (!(this instanceof WiccApi)) {
        return new WiccApi(arg);
    }
    var info = WiccApi._from(arg);
    this.network = arg.network;
    return this;
};

WiccApi._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
        info = WiccApi._fromObject(arg);
    } else {
        throw new TypeError('Unrecognized argument for WiccApi');
    }
    return info;
};

WiccApi._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
        network: data.network
    };
    return info;
};

WiccApi.prototype.createAllCoinMnemonicCode = function () {
    return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
}

WiccApi.prototype.checkMnemonicCode = function (mnemonic) {
    return Mnemonic.isValid(mnemonic);
}

WiccApi.prototype.validateAddress = function (address) {
    return Address.isValid(address, this.network)
}

WiccApi.prototype.createWallet = function (mnemonic, password) {
    var salt = Random.getRandomBuffer(8)

    var passbuf = new buffer.Buffer(password, 'utf8');
    var hashpwd = Hash.sha256(passbuf)

    var code = new Mnemonic(mnemonic)
    var strCode = code.toString()

    var seed = code.toSeed()

    var xpriv = code.toHDPrivateKey(null, this.network);
    var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");
    var address = p.privateKey.toAddress()
    var strAddress = address.toString()

    var d = new Date()
    var creationTimeSeconds = parseInt(d.getTime() / 1000)


    var data = scrypt(password, salt, 32768, 8, 1, 64)

    var key = data.slice(0, 32)
    var iv = data.slice(32, 48)

    var hexKey = key.toString('hex')
    var cryKey = CryptoJS.enc.Hex.parse(hexKey)

    var hexIv = iv.toString('hex')
    var cryIv = CryptoJS.enc.Hex.parse(hexIv)

    var strSeed = seed.toString('hex')
    var encryptedseed = aes.encrypt(cryKey, cryIv, strSeed)
    var encryptedMne = aes.encrypt(cryKey, cryIv, strCode)

    var encSeedData = {
        encryptedBytes: encryptedseed,
        iv: iv
    }

    var encMneData = {
        encryptedBytes: encryptedMne,
        iv: iv
    }

    var seedinfo = {
        encMneData: encMneData,
        encSeedData: encSeedData,
        creationTimeSeconds: creationTimeSeconds,
        hashPwd: hashpwd,
        salt: salt
    }

    var wallinfo = {
        seedinfo: seedinfo,
        symbol: 'WICC',
        address: strAddress
    }

    return wallinfo

}

WiccApi.prototype.getPriKeyFromSeed = function (seedinfo, password) {

    var passbuf = new buffer.Buffer(password, 'utf8');
    var hashpwd = Hash.sha256(passbuf)
    if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
        return null
    }

    var salt = seedinfo.salt
    var data = scrypt(password, salt, 32768, 8, 1, 64)

    var key = data.slice(0, 32)
    var iv = data.slice(32, 48)

    var hexKey = key.toString('hex')
    var cryKey = CryptoJS.enc.Hex.parse(hexKey)

    var hexIv = iv.toString('hex')
    var cryIv = CryptoJS.enc.Hex.parse(hexIv)

    var base64seed = seedinfo.encSeedData.encryptedBytes
    var strseed = aes.decrypt(cryKey, cryIv, base64seed)
    var seed = new Buffer(strseed, 'hex')
    /*
    var code = Mnemonic.fromSeed(seed, Mnemonic.Words.ENGLISH)
    var strCode = code.toString()
 
    var xpriv = code.toHDPrivateKey(null, 'testnet');
    */

    var xpriv = HDPrivateKey.fromSeed(seed, this.network);
    var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");

    return p.privateKey.toWIF()
}

WiccApi.prototype.getMnemonicCodeFromSeed = function (seedinfo, password) {

    var passbuf = new buffer.Buffer(password, 'utf8');
    var hashpwd = Hash.sha256(passbuf)
    if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
        return null
    }

    var salt = seedinfo.salt
    var data = scrypt(password, salt, 32768, 8, 1, 64)

    var key = data.slice(0, 32)
    var iv = data.slice(32, 48)

    var hexKey = key.toString('hex')
    var cryKey = CryptoJS.enc.Hex.parse(hexKey)

    var hexIv = iv.toString('hex')
    var cryIv = CryptoJS.enc.Hex.parse(hexIv)

    var base64Mne = seedinfo.encMneData.encryptedBytes
    var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

    return Mne
}

WiccApi.prototype.changePassword = function (seedinfo, oldpassword, newpassword) {

    var passbuf = new buffer.Buffer(oldpassword, 'utf8');
    var hashpwd = Hash.sha256(passbuf)
    if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
        return null
    }

    var salt = seedinfo.salt
    var data = scrypt(oldpassword, salt, 32768, 8, 1, 64)

    var key = data.slice(0, 32)
    var iv = data.slice(32, 48)

    var hexKey = key.toString('hex')
    var cryKey = CryptoJS.enc.Hex.parse(hexKey)

    var hexIv = iv.toString('hex')
    var cryIv = CryptoJS.enc.Hex.parse(hexIv)

    var base64seed = seedinfo.encSeedData.encryptedBytes
    var strseed = aes.decrypt(cryKey, cryIv, base64seed)
    var base64Mne = seedinfo.encMneData.encryptedBytes
    var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

    var newpassbuf = new buffer.Buffer(newpassword, 'utf8');
    var newhashpwd = Hash.sha256(newpassbuf)

    data = scrypt(newpassword, salt, 32768, 8, 1, 64)

    key = data.slice(0, 32)
    iv = data.slice(32, 48)

    hexKey = key.toString('hex')
    cryKey = CryptoJS.enc.Hex.parse(hexKey)

    hexIv = iv.toString('hex')
    cryIv = CryptoJS.enc.Hex.parse(hexIv)

    var encryptedseed = aes.encrypt(cryKey, cryIv, strseed)
    var encryptedMne = aes.encrypt(cryKey, cryIv, Mne)

    var encSeedData = {
        encryptedBytes: encryptedseed,
        iv: iv
    }

    var encMneData = {
        encryptedBytes: encryptedMne,
        iv: iv
    }

    var newseedinfo = {
        encMneData: encMneData,
        encSeedData: encSeedData,
        creationTimeSeconds: seedinfo.creationTimeSeconds,
        hashPwd: newhashpwd,
        salt: salt
    }

    return newseedinfo
}

WiccApi.prototype.createSignTransaction = function (privkey, txType, txData) {
    if (txType == WiccApi.REGISTER_ACCOUNT_TX) {
        var register = new RegisterAccountTx(txData)
        return register.SerializeTx(privkey)
    }
    else if (txType == WiccApi.COMMON_TX) {
        var commonTx = new CommonTx(txData)
        return commonTx.SerializeTx(privkey)
    }
    else if (txType == WiccApi.CONTRACT_TX) {
        var contractTx = new ContractTx(txData)
        return contractTx.SerializeTx(privkey)
    }
    else if (txType == WiccApi.REG_APP_TX) {
        var registerAppTx = new RegisterAppTx(txData)
        return registerAppTx.SerializeTx(privkey)
    }
    else if (txType == WiccApi.DELEGATE_TX) {
        var delegateTx = new DelegateTx(txData)
        return delegateTx.SerializeTx(privkey)
    }
}

module.exports = WiccApi;
