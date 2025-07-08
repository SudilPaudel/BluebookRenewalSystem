const PDFDocument = require('pdfkit');
const UserModel = require('../user/user.model');
const BluebookModel = require('../Bluebook/bluebook.model');
const PaymentModel = require('../payment/payment.model');

class AdminController {
    // Generates a PDF report for users, bluebooks, or payments based on the 'type' parameter.
    // Fetches relevant data, formats it, and streams a PDF file as the response.
    generateReport = async (req, res, next) => {
        try {
            const { type } = req.params;
            
            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${type}_report_${new Date().toISOString().split('T')[0]}.pdf"`);

            // Pipe PDF to response
            doc.pipe(res);

            // Add header
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .text(`${type.toUpperCase()} REPORT`, { align: 'center' })
               .moveDown();

            doc.fontSize(12)
               .font('Helvetica')
               .text('Bluebook Renewal System', { align: 'center' })
               .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' })
               .moveDown(2);

            let data = [];
            let title = '';

            switch (type) {
                case 'users':
                    data = await UserModel.find({}).select('-password -activationToken');
                    title = 'User Statistics';
                    break;
                case 'bluebooks':
                    data = await BluebookModel.find({});
                    title = 'Bluebook Statistics';
                    break;
                case 'payments':
                    data = await PaymentModel.find({});
                    title = 'Payment Statistics';
                    break;
                default:
                    throw { code: 400, message: 'Invalid report type' };
            }

            // Add statistics
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .text(title)
               .moveDown();

            doc.fontSize(12)
               .font('Helvetica')
               .text(`Total Records: ${data.length}`)
               .moveDown();

            // Add data table
            if (data.length > 0) {
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .text('Data Summary')
                   .moveDown();

                // Show first 10 records as summary
                const summaryData = data.slice(0, 10);
                summaryData.forEach((item, index) => {
                    doc.fontSize(10)
                       .font('Helvetica')
                       .text(`${index + 1}. ${this.formatReportItem(item, type)}`)
                       .moveDown(0.5);
                });

                if (data.length > 10) {
                    doc.fontSize(10)
                       .font('Helvetica')
                       .text(`... and ${data.length - 10} more records`)
                       .moveDown();
                }
            }

            // Finalize PDF
            doc.end();

        } catch (exception) {
            next(exception);
        }
    }

    // Formats a single data item for the PDF report summary, depending on the report type.
    formatReportItem = (item, type) => {
        switch (type) {
            case 'users':
                return `${item.name} (${item.email}) - ${item.role} - ${item.status}`;
            case 'bluebooks':
                return `${item.vehicleRegNo} - ${item.vehicleOwnerName} - ${item.status}`;
            case 'payments':
                return `${item.transactionId || 'N/A'} - Rs. ${item.amount || 'N/A'} - ${item.status || 'N/A'}`;
            default:
                return JSON.stringify(item);
        }
    }

    // Retrieves all payment records, populates user info, and returns a summary with meta statistics.
    getAllPayments = async (req, res, next) => {
        try {
            const payments = await PaymentModel.find({}).populate('userId', 'name email');
            
            const formattedPayments = payments.map(payment => ({
                _id: payment._id,
                transactionId: payment.transactionId || 'N/A',
                userName: payment.userId ? payment.userId.name : 'Unknown',
                amount: payment.amount || 0,
                status: payment.status || 'pending',
                createdAt: payment.createdAt
            }));

            res.json({
                result: formattedPayments,
                message: "Payments fetched successfully",
                meta: {
                    total: formattedPayments.length,
                    successful: formattedPayments.filter(p => p.status === 'successful').length,
                    pending: formattedPayments.filter(p => p.status === 'pending').length,
                    failed: formattedPayments.filter(p => p.status === 'failed').length
                }
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Gathers and returns overall system statistics: user, bluebook, and payment counts.
    getSystemStats = async (req, res, next) => {
        try {
            const totalUsers = await UserModel.countDocuments({});
            const activeUsers = await UserModel.countDocuments({ status: 'active' });
            const totalBluebooks = await BluebookModel.countDocuments({});
            const pendingBluebooks = await BluebookModel.countDocuments({ status: 'pending' });
            const verifiedBluebooks = await BluebookModel.countDocuments({ status: 'verified' });
            const totalPayments = await PaymentModel.countDocuments({});

            res.json({
                result: {
                    totalUsers,
                    activeUsers,
                    totalBluebooks,
                    pendingBluebooks,
                    verifiedBluebooks,
                    totalPayments
                },
                message: "System statistics fetched successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Fetches all users, removes sensitive fields, and returns user data with meta statistics.
    getAllUsers = async (req, res, next) => {
        try {
            const users = await UserModel.find({}).select('-password -activationToken');
            
            res.json({
                result: users,
                message: "Users fetched successfully",
                meta: {
                    total: users.length,
                    active: users.filter(u => u.status === 'active').length,
                    inactive: users.filter(u => u.status === 'inactive').length,
                    admin: users.filter(u => u.role === 'admin').length,
                    user: users.filter(u => u.role === 'user').length
                }
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Updates a user's information by ID after validating input and existence.
    // Returns the updated user data.
    updateUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updateData = req.body;
            
            // Check if user exists
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                throw { code: 404, message: 'User not found' };
            }
            
            // Validate required fields
            if (updateData.email && !updateData.email.includes('@')) {
                throw { code: 400, message: 'Invalid email format' };
            }
            
            if (updateData.role && !['admin', 'user'].includes(updateData.role)) {
                throw { code: 400, message: 'Invalid role. Must be admin or user' };
            }
            
            if (updateData.status && !['active', 'inactive'].includes(updateData.status)) {
                throw { code: 400, message: 'Invalid status. Must be active or inactive' };
            }
            
            // Update the user
            const updatedUser = await UserModel.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            ).select('-password -activationToken');
            
            res.json({
                result: updatedUser,
                message: "User updated successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Deletes a user by ID after checking existence and ensuring the user is not an admin.
    deleteUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            
            // Check if user exists
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                throw { code: 404, message: 'User not found' };
            }
            
            // Prevent deleting admin users
            if (existingUser.role === 'admin') {
                throw { code: 400, message: 'Cannot delete admin users' };
            }
            
            // Delete the user
            await UserModel.findByIdAndDelete(id);
            
            res.json({
                result: null,
                message: "User deleted successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Toggles a user's status (active/inactive) by ID and returns the updated user.
    toggleUserStatus = async (req, res, next) => {
        try {
            const id = req.params.id;
            
            // Check if user exists
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                throw { code: 404, message: 'User not found' };
            }
            
            // Toggle status
            const newStatus = existingUser.status === 'active' ? 'inactive' : 'active';
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { status: newStatus },
                { new: true, runValidators: true }
            ).select('-password -activationToken');
            
            res.json({
                result: updatedUser,
                message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }
}

const adminCtrl = new AdminController();
module.exports = adminCtrl;