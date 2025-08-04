const electricBluebookSvc = require("./electricBluebook.service");
const PDFDocument = require('pdfkit');

require("dotenv").config();

class ElectricBluebookController {
    createBluebook = async (req, res, next) => {
        try {
            console.log('Creating electric bluebook with data:', req.body);
            const data = electricBluebookSvc.transformCreateData(req);
            const bluebooknewData = {
                ...data,
                isElectric: true,
                createdBy: req.authUser
            }
            console.log('Transformed data:', bluebooknewData);
            const electricBluebookData = await electricBluebookSvc.createBluebook(bluebooknewData);
            console.log('Created bluebook:', electricBluebookData);
            res.status(201).json({
                result: electricBluebookData,
                message: "Bluebook Created for electric vehicle Successfully",
                meta: null
            })
        } catch (exception) {
            console.error('Error creating electric bluebook:', exception);
            next(exception);
        }

    }
    verifyBluebook = async (req, res, next) => {
        try {
            const id = req.params.id;
            const associatedBluebook = await electricBluebookSvc.findOneBluebook({
                _id: id
            })
            if (!associatedBluebook) {
                throw { code: 400, message: 'Electric Vehicle Bluebook with the id does not exist' }
            }
            const updatedResult = await electricBluebookSvc.verifydata({
                status: 'verified',
                updatededBy: req.authUser
            }, associatedBluebook._id);
            res.status(200).json({
                result: updatedResult,
                message: "Electric Vehicle Bluebook Verified Successfully"
            })
        } catch (exception) {
            next(exception);
        }
    }
    fetchBluebook = async (req, res, next) => {
        try {
            const { vehicleRegNo, vehicleOwnerName, vehicleModel, vehicleNumber } = req.body;
            const query = {};
            if (vehicleRegNo) query.vehicleRegNo = vehicleRegNo;
            if (vehicleOwnerName) query.vehicleOwnerName = vehicleOwnerName;
            if (vehicleModel) query.vehicleModel = vehicleModel;
            if (vehicleNumber) query.vehicleNumber = vehicleNumber;

            if (Object.keys(query).length === 0) {
                return res.status(400).json({ message: "Please provide at least one search field." });
            }
            const electricBluebookData = await electricBluebookSvc.findManyBluebooks(query);
            if (!electricBluebookData || electricBluebookData.length === 0) {
                return res.status(404).json({ message: "No bluebook record with the provided data" });
            }

            // Optionally, filter for only verified bluebooks
            // const verifiedBluebooks = bluebookData.filter(bb => bb.status === "verified");

            res.status(200).json({
                result: electricBluebookData,
                message: "Bluebook(s) fetched successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }
    fetchBluebookById = async (req, res, next) => {
        try {
            const id = req.params.id
            console.log('Fetching electric bluebook with ID:', id);
            const bluebookData = await electricBluebookSvc.findOneBluebook({
                _id: id
            })
            console.log('Fetched bluebook data:', bluebookData);
            if (bluebookData.status === "pending") {
                return res.status(400).json({
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
            console.error('Error fetching electric bluebook:', exception);
            next(exception)
        }
    }
    getMyBluebook = async (req, res, next) => {
        try {
            const userId = req.authUser._id; // assuming it's added by middleware

            const result = await electricBluebookSvc.findManyBluebooks({
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
    downloadBluebook = async (req, res, next) => {
        try {
            const id = req.params.id;
            const bluebookData = await electricBluebookSvc.findOneBluebook({ _id: id });

            if (!bluebookData) {
                return res.status(404).json({
                    message: "Bluebook not found",
                    meta: null
                });
            }

            // Check if user has permission to download this bluebook
            if (bluebookData.createdBy.toString() !== req.authUser._id.toString()) {
                return res.status(403).json({
                    message: "You don't have permission to download this bluebook",
                    meta: null
                });
            }

            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="electric-bluebook-${bluebookData.vehicleRegNo}.pdf"`);

            // Pipe PDF to response
            doc.pipe(res);

            // --- Add Background Image (with logo included in the image) ---
            const backgroundPath = process.env.TRANSPORT_BG_PATH || 'public/images/transport-logo.png';
            try {
                // Set watermark size (e.g., 300x300 or adjust as needed)
                const watermarkWidth = 300;
                const watermarkHeight = 300;
                const centerX = (doc.page.width - watermarkWidth) / 2;
                const centerY = (doc.page.height - watermarkHeight) / 2;

                // Set opacity for watermark effect
                doc.save();
                doc.opacity(0.15);
                doc.image(backgroundPath, centerX, centerY, { width: watermarkWidth, height: watermarkHeight });
                doc.opacity(1);
                doc.restore();
            } catch (e) {
                // If background not found, continue without error
            }

            // --- Optionally, overlay logo at the top center if needed ---
            const logoPath = process.env.TRANSPORT_LOGO_PATH || 'public/images/transport-logo.png';
            let logoHeight = 100;
            try {
                const logoWidth = 100;
                logoHeight = 100;
                const centerX = (doc.page.width - logoWidth) / 2;
                doc.image(logoPath, centerX, 40, { width: logoWidth, height: logoHeight });
            } catch (e) {
                // If logo not found, continue without error
            }

            // Move cursor below the logo before adding the certificate title
            doc.moveDown();
            doc.y = 40 + logoHeight + 20; // 40 (logo y) + logoHeight + 20px padding

            // Add content to PDF
            doc.fontSize(24)
                .font('Helvetica-Bold')
                .text('ELECTRIC VEHICLE BLUEBOOK CERTIFICATE', { align: 'center' })
                .moveDown();

            doc.fontSize(12)
                .font('Helvetica')
                .text('Government of Nepal', { align: 'center' })
                .text('Department of Transport Management', { align: 'center' })
                .moveDown(2);

            // Vehicle Information Section
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text('Vehicle Information')
                .moveDown();

            const vehicleInfo = [
                ['Registration Number:', bluebookData.vehicleRegNo],
                ['Vehicle Type:', bluebookData.vehicleType],
                ['Vehicle Model:', bluebookData.vehicleModel],
                ['Manufacture Year:', bluebookData.manufactureYear.toString()],
                ['Vehicle Number:', bluebookData.vehicleNumber],
                ['Chassis Number:', bluebookData.chasisNumber],
                ['Vehicle Color:', bluebookData.vehicleColor],
                ['Battery Capacity:', `${bluebookData.vehicleBatteryCapacity} kWh`]
            ];

            vehicleInfo.forEach(([label, value]) => {
                doc.fontSize(12)
                    .font('Helvetica-Bold')
                    .text(label, { continued: true })
                    .font('Helvetica')
                    .text(` ${value}`)
                    .moveDown(0.5);
            });

            doc.moveDown();

            // Owner Information
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text('Owner Information')
                .moveDown();

            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('Owner Name:', { continued: true })
                .font('Helvetica')
                .text(` ${bluebookData.vehicleOwnerName}`)
                .moveDown(0.5);

            // Registration and Tax Information
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text('Registration & Tax Information')
                .moveDown();

            const registrationInfo = [
                ['Registration Date:', new Date(bluebookData.vehicleRegistrationDate).toLocaleDateString()],
                ['Tax Pay Date:', new Date(bluebookData.taxPayDate).toLocaleDateString()],
                ['Tax Expire Date:', new Date(bluebookData.taxExpireDate).toLocaleDateString()],
                ['Status:', bluebookData.status.toUpperCase()]
            ];

            registrationInfo.forEach(([label, value]) => {
                doc.fontSize(12)
                    .font('Helvetica-Bold')
                    .text(label, { continued: true })
                    .font('Helvetica')
                    .text(` ${value}`)
                    .moveDown(0.5);
            });

            doc.moveDown(2);

            // --- Add Stamp (bottom right, visible) ---
            const stampPath = process.env.TRANSPORT_STAMP_PATH || 'public/images/transport-stamp.png';
            try {
                doc.image(
                    stampPath,
                    doc.page.width - 150, // x position
                    doc.page.height - 180, // y position
                    { width: 100 }
                );
            } catch (e) {
                // If stamp not found, continue without error
            }

            // Footer
            doc.fontSize(10)
                .font('Helvetica')
                .text('This is an official document generated by the Bluebook Renewal System.', { align: 'center' })
                .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (exception) {
            next(exception);
        }
    }
    getAllBluebooks = async (req, res, next) => {
        try {
            const result = await electricBluebookSvc.findManyBluebooks({});

            res.status(200).json({
                result: result,
                message: "All bluebooks fetched successfully",
                meta: {
                    total: result.length,
                    pending: result.filter(bb => bb.status === 'pending').length,
                    verified: result.filter(bb => bb.status === 'verified').length
                }
            });
        } catch (exception) {
            next(exception);
        }
    }
    getPendingBluebooks = async (req, res, next) => {
            try {
                const result = await electricBluebookSvc.findManyBluebooks({ status: 'pending' });
                
                res.status(200).json({
                    result: result,
                    message: "Pending bluebooks fetched successfully",
                    meta: {
                        total: result.length
                    }
                });
            } catch (exception) {
                next(exception);
            }
        }
    
        // Fetches all bluebooks with status 'verified' for admin.
        getVerifiedBluebooks = async (req, res, next) => {
            try {
                const result = await electricBluebookSvc.findManyBluebooks({ status: 'verified' });
                
                res.status(200).json({
                    result: result,
                    message: "Verified bluebooks fetched successfully",
                    meta: {
                        total: result.length
                    }
                });
            } catch (exception) {
                next(exception);
            }
        }
    
        // Rejects a pending bluebook by ID and updates its status to 'rejected'.
        rejectBluebook = async (req, res, next) => {
            try {
                const id = req.params.id;
                const associatedBluebook = await electricBluebookSvc.findOneBluebook({
                    _id: id
                });
                
                if (!associatedBluebook) {
                    throw { code: 400, message: 'Bluebook with the id does not exist' };
                }
                
                if (associatedBluebook.status !== 'pending') {
                    throw { code: 400, message: 'Only pending bluebooks can be rejected' };
                }
                
                const updatedResult = await electricBluebookSvc.verifydata({
                    status: 'rejected'
                }, associatedBluebook._id);
                
                res.json({
                    result: updatedResult,
                    message: "Bluebook rejected successfully."
                });
            } catch (exception) {
                next(exception);
            }
        }
    
        // Updates a bluebook's information by ID after validating required fields and status.
        updateBluebook = async (req, res, next) => {
            try {
                const id = req.params.id;
                const updateData = req.body;
                
                // Check if bluebook exists
                const existingBluebook = await electricBluebookSvc.findOneBluebook({ _id: id });
                if (!existingBluebook) {
                    throw { code: 404, message: 'Bluebook not found' };
                }
                
                // Validate required fields
                const requiredFields = [
                    'vehicleRegNo', 'vehicleOwnerName', 'vehicleType', 'vehicleModel',
                    'manufactureYear', 'chasisNumber', 'vehicleColor', 'vehicleBatteryCapacity', 'vehicleNumber'
                ];
                
                for (const field of requiredFields) {
                    if (!updateData[field]) {
                        throw { code: 400, message: `${field} is required` };
                    }
                }
                
                // Validate status
                if (updateData.status && !['pending', 'verified', 'rejected'].includes(updateData.status)) {
                    throw { code: 400, message: 'Invalid status. Must be pending, verified, or rejected' };
                }
                
                // Update the bluebook
                const updatedBluebook = await electricBluebookSvc.updateBluebook(updateData, id);
                
                res.json({
                    result: updatedBluebook,
                    message: "Bluebook updated successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }
}

const electricBluebookCtrl = new ElectricBluebookController();
module.exports = electricBluebookCtrl;