const  stock  = require('../models/stock');
const product = require('../models/product');


module.exports = {
    /**
     * add to stock example
     * addStockToProduct({ productId: p._id, addToStock: 10, vendorId: v._id, remark : 'adding stock'  })
     * 
     * remove to stock example
     * addStockToProduct({ productId: p._id, addToStock: -10, vendorId: v._id, remark : 'adding stock'  })
     * 
     */
    addStockToProduct : async function (data) {
        try{
            let addToStock = data.addToStock

            let array1 = ['productId', 'addToStock', 'vendorId', 'remark'];
          
            for (let index = 0; index < array1.length; index++) {
                const element = array1[index];
                if (!data[element]) {
                   throw new Error("Missing "+ element);
                }
            }

            if(!addToStock){
                throw new Error("addToStock is 0 ");
            }
            let prod = await product.findOne({_id: data.productId, vendorId: data.vendorId });
            if(!prod){
                throw new Error("Product Not found");
            }
            prod.stock = parseInt(prod.stock) + parseInt(data.addToStock);
            let newStockEntry =   new stock();      
            newStockEntry.product  = data.productId
            newStockEntry.vendor = data.vendorId
            newStockEntry.inward = data.addToStock>0?data.addToStock:0
            newStockEntry.outward = data.addToStock<0?-1*data.addToStock:0 
            newStockEntry.balance = prod.stock
            newStockEntry.remarks =  data.remark
            await prod.save();
            return await newStockEntry.save();
        }catch(err){
            throw err;
        }
    }

}