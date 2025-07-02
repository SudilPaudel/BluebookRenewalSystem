const authSvc = require("../auth/auth.service");
const bluebookSvc = require("./bluebook.service");

require("dotenv").config();

class BluebookController {
    createBluebook = async (req, res, next) => {
        try {
            const data = bluebookSvc.transformCreateData(req);
            const bluebooknewData = {
                ...data,
                createdBy: req.authUser
            }
            const bluebookData = await bluebookSvc.createBluebook(bluebooknewData);
            res.status(201).json({
                result: bluebookData,
                message: "Bluebook Created Successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }
    verifyBluebook = async (req, res, next) => {
        try {
            const id = req.params.id
            const asssociatedBluebook = await bluebookSvc.findOneBluebook({
                _id: id
            })
            if (!asssociatedBluebook) {
                throw { code: 400, message: 'Bluebook with the id doessnot exists' }
            }
            const updatedResult = await bluebookSvc.verifydata({
                status: 'verified'

            }, asssociatedBluebook._id)
            res.json({
                result: updatedResult,
                message: "Bluebook verified successfully. "
            })
        } catch (exception) {
            next(exception)
        }
    }
    fetchBluebook = async (req, res, next) => {
        try {
            const { vehicleRegNo, vehicleOwnerName, vehicleModel, vehicleNumber } = req.body;
            const bluebookData = await bluebookSvc.findOneBluebook({
                vehicleRegNo,
                vehicleModel,
                vehicleOwnerName,
                vehicleNumber
            })

            if (!bluebookData) {
                throw { code: 400, message: "No bluebook record with the provided data" };
            }
            if(bluebookData.status !=="verified"){
                res.status(400).json({
                    message: "Please wait for the admin to verify the bluebook details",
                    meta: null
                })
            }

            res.status(200).json({
                result: bluebookData,
                message: "Bluebook fetched successfully",
                meta: null
            })



        } catch (exception) {
            next(exception)
        }

    }
    fetchBluebookById = async (req, res, next) => {
        try {
            const id = req.params.id
            const bluebookData = await bluebookSvc.findOneBluebook({
                _id: id
            })
            if(bluebookData.status === "pending"){
                res.status(400).json({
                    message: "Please wait for the admin to verify the bluebook details",
                    meta: null
                })

            }
            res.status(200).json({
                result: bluebookData,
                message: "Bluebook by id fetched successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }
    getMyBluebook = async (req, res, next) => {
        try {
            const userId = req.authUser._id; // assuming it's added by middleware

            const result = await bluebookSvc.findManyBluebooks({
                createdBy: userId
            });

            res.status(200).json({
                result: result,
                message: "Fetched user's bluebooks successfully",
                meta: null
            });
        } catch (exception) {
            next(exception)
        }
    }
}
const bluebookCtrl = new BluebookController()
module.exports = bluebookCtrl;