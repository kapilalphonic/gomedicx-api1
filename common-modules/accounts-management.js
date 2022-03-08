const config = require('./config');
const Vendor = require('../models/vendor');
const Rider = require('../models/driver');
const Admin = require('../models/admin');
const Transactions = require('../models/account');
// const Information = require('../models/information');


// DR -- DEBIT whats comes in
// CR -- Credit whats goes out
let accountModule = {

  addToVendor: async (data) => {

    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      // 
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
    
      txn.txnType = 'DR'
      txn.amountIn = data.amountIn || 0
      txn.amountOut = 0
      txn.balance = oldBalance + data.amountIn
      txn.userId = data.userId
      txn.userType = 'VENDOR'
      let newTxn = await txn.save();

      await Vendor.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: data.amountIn
        }
      }, {
        upsert: true
      })

      return newTxn
    } catch (error) {
      throw error
    }
  },
  payFromVendor: async function (data) {

    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      //  
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
     
      txn.txnType = 'CR'
      txn.amountIn = 0
      txn.amountOut = data.amountOut
      txn.balance = oldBalance - data.amountOut
      txn.userId = data.userId
      txn.userType = 'VENDOR'
      let newTxn = await txn.save();

      await Vendor.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: (data.amountOut * -1)
        }
      }, {
        upsert: true
      })

      return newTxn
    } catch (error) {
      throw error
    }
  },
  addToAdmin: async function (data) {
    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      // 
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
      //inc or dec ac to  infornation 
      txn.txnType = 'DR'
      txn.amountIn = data.amountIn || 0
      txn.amountOut = 0
      txn.balance = oldBalance + data.amountIn
      txn.userId = data.userId
      txn.userType = 'ADMIN'
      let newTxn = await txn.save();

      await Vendor.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: data.amountIn
        }
      }, {
        upsert: true
      })
    } catch (error) {
      throw error
    }
  },
  payFromAdmin: async function (data) {
    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      // 
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
     
      txn.txnType = 'CR'
      txn.amountIn = 0
      txn.amountOut = data.amountOut || 0
      txn.balance = oldBalance - data.amountOut
      txn.userId = data.userId
      txn.userType = 'ADMIN'
      let newTxn = await txn.save();

      await Admin.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: (data.amountOut * -1),
          amtTransfered: data.amountOut
        }
      }, {
        upsert: true
      })
    } catch (error) {
      throw error
    }
  },
  addToDriver: async function (data) {
    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      // 
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
   
      txn.txnType = 'DR'
      txn.amountIn = data.amountIn || 0
      txn.amountOut = 0
      txn.balance = oldBalance + data.amountIn
      txn.userId = data.userId
      txn.userType = 'DRIVER'
      let newTxn = await txn.save();

      await Rider.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: data.amountIn
        }
      }, {
        upsert: true
      })

      return newTxn
    } catch (error) {
      throw error
    }
  },
  payFromDriver: async function (data) {
    try {
      //  add entry for users 
      //  add user balance
      //  this will be used to for when order is complete and money needs to be transfer to other hosts
      // 
      let lastTxn = (await Transactions.find({
        userId: data.userId
      }).limit(1).sort({
        createdAt: -1
      }))[0];
      let oldBalance = 0
      if (lastTxn) {
        oldBalance = lastTxn.balance;
      }
      let txn = new Transactions();
      txn.remarks = data.remarks
     
      txn.txnType = 'CR'
      txn.amountIn = 0
      txn.amountOut = data.amountOut || 0
      txn.balance = oldBalance - data.amountOut
      txn.userId = data.userId
      txn.userType = 'DRIVER'
      let newTxn = await txn.save();

      await Rider.updateOne({
        _id: newTxn.userId
      }, {
        $inc: {
          balance: (data.amountOut * -1),
          amtTransfered: data.amountOut
        }
      }, {
        upsert: true
      })

      return newTxn
    } catch (error) {
      throw error
    }
  },
}





module.exports = accountModule;