const express = require("express");
const router = express.Router();
const Customer = require("../../Models/customer");
const CMS = require("../../common-modules/index");
const langFunction = require("../../common-modules/lang-messages");

/**
 * @function  Get_Customer_BY_Id
 * @description API Will be /api/v1/a/customer/:id
 * @example Get_Customer_BY_Id
 */

router.get("/:id", async (req, res) => {
  try {
    let data = await Customer.findOne({
      _id: req.params.id,
    }).populate("image", { _id: 1, path: 1, name: 1 });
    if (data) {
      return res.status(200).json({
        message: CMS.Lang_Messages("en", "success"),
        data: data,
      });
    } else {
      return res.status(400).json({
        message: CMS.Lang_Messages("en", "cusnotfound"),
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: CMS.Lang_Messages("en", "servererr"),
    });
  }
});

/**
 * @function  Get_Customer_Pagin
 * @description API Will be /api/v1/a/customer/pagin
 * @example Customer_Pagin
 */

router.post("/pagin", async (req, res) => {
  try {
    let customerData = req.body;

    let array1 = ["page", "perPage"];
    for (let index = 0; index < array1.length; index++) {
      const element = array1[index];
      if (!customerData[element]) {
        return res.status(400).json({
          message: element + CMS.Lang_Messages("en", "feildmissing"),
        });
      }
    }

    let startIndex = (customerData.page - 1) * customerData.perPage;
    let perPage = parseInt(customerData.perPage);
    skipCondition = {
      skip: startIndex,
      limit: perPage,
      sort: { createdAt: -1 },
    };
    let con = {};

    if (customerData.searchString) {
      con["$or"] = [
        {
          name: new RegExp(customerData.searchString, "i"),
        },
        {
          email: new RegExp(customerData.searchString, "i"),
        },
        {
          phone: new RegExp(customerData.searchString, "i"),
        },
      ];
    }

    let doc = await Customer.find(con, {}, skipCondition);
    let totalCount = await Customer.countDocuments(con);

    res.status(200).json({
      result: doc,
      totalCount,
      message: CMS.Lang_Messages("en", "success"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: CMS.Lang_Messages("en", "servererr"),
    });
  }
});

router.post("/status/:id", async (req, res) => {
  try {
    let userData = req.body;
    let array1 = ["status"];
    for (let index = 0; index < array1.length; index++) {
      const element = array1[index];
      if (!userData[element]) {
        return res.status(400).json({
          message: element + langFunction("en", "feildmissing"),
        });
      }
    }
    await Customer.updateOne(
      { _id: req.params.id },
      { $set: { status: userData.status.toUpperCase() } }
    );

    res.status(200).json({
      message: langFunction("en", "dataupdated"),
      //   data: null,
      data: userData.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: langFunction("en", "servererr"),
    });
  }
});

module.exports = router;
