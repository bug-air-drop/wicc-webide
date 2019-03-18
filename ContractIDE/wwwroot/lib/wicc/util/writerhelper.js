'use strict';

var _ = require('lodash');
var inherits = require('inherits');
var BufferWriter = require('../encoding/bufferwriter');
var Util = require('./util.js')
var bufferUtil = require('./buffer');
var assert = require('assert');

/**
 * @desc
 * Wrapper around BufferWriter for enhanced extention
 *
 * @param {Object|string|WriterHelper} obj
 * @constructor
 */
function WriterHelper(obj) {
    if (!(this instanceof WriterHelper)) {
        return new WriterHelper(obj);
    }
    if (obj instanceof WriterHelper) {
        return obj;
    }
    BufferWriter.call(this)

}

inherits(WriterHelper, BufferWriter);

WriterHelper.prototype.writeVarInt = function(sz, value) {
    var buf = Util.writeVarInt(sz, value)
    this.write(buf)
};

// write the string len and string
WriterHelper.prototype.writeString = function(value) {
    assert(value == undefined || _.isString(value) || bufferUtil.isBuffer(value))
    var len = 0
    var buf = value
    if (!_.isEmpty(value)) {
        if (!bufferUtil.isBuffer(buf)) {
            buf = Buffer.from(buf)
        }
        len = buf.length
    }
    this.writeVarintNum(len)
    if (len > 0) {
        this.write(buf)
    }
};

// write the buf len and buf
WriterHelper.prototype.writeBuf = function(value) {
    var len = 0
    if (!_.isEmpty(value)) {
        assert(bufferUtil.isBuffer(value))
        len = value.length
    }
    this.writeVarintNum(len)
    if (len > 0) {
        this.write(value)
    }
};

WriterHelper.prototype.writeRegId = function(value) {
    var regIdData = Util.splitRegID(value)

    var intWriter = new WriterHelper()
    intWriter.writeVarInt(4, regIdData.height)
    intWriter.writeVarInt(2, regIdData.index)
    this.writeBuf(intWriter.toBuffer())
};

WriterHelper.prototype.VoteOperType = {
  ADD_FUND: 1,       //!< add operate
  MINUS_FUND: 2      //!< minus operate
}

/**
 * delegateData    array,  item is object data of delegate
 * [
 *     {
 *         publicKey: string    the public key that the votes are received,
 *         votes: number        vote number
 *     },
 *]
 */
WriterHelper.prototype.writeDelegateData = function(delegateData) {

  this.writeVarintNum(delegateData.length);

  for(var i = 0; i < delegateData.length; i++) {
    var operType = this.VoteOperType.ADD_FUND; 
    if (delegateData.votes < 0) {
      operType = this.VoteOperType.MINUS_FUND; 
    }
    var votes_abs = Math.abs(delegateData[i].votes);
    this.writeUInt8(operType);
    this.writeString(delegateData[i].publicKey);
    this.writeVarInt(8, votes_abs)
  }
}

module.exports = WriterHelper;
