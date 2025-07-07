const BluebookModel = require('./bluebook.model')

class BluebookService {
    transformCreateData = (req) => {
        try {
            const payload = req.body
            
            payload.status = 'pending';
            return payload
        } catch (exception) {
            throw exception
        }
    }
    createBluebook = async (data) => {
        try {
            const bluebook = new BluebookModel(data)
            return await bluebook.save()
        } catch (exception) {
            throw exception
        }
    }
    findOneBluebook = async (filter) => {
        try {
            const bluebookObj = await BluebookModel.findOne(filter);
            return bluebookObj;
        } catch (exception) {
            throw exception
        }
    }
    verifydata = async (data, bluebookId) => {
        try {
            const result = await BluebookModel.findByIdAndUpdate(bluebookId, {
                $set: data
            })
            return result
        } catch (exception) {
            throw exception
        }
    }
    findManyBluebooks = async (filter) => {
        try {
            const bluebooks = await BluebookModel.find(filter);
            return bluebooks;
        } catch (error) {
            throw error;
        }
    };

    updateBluebook = async (data, bluebookId) => {
        try {
            const result = await BluebookModel.findByIdAndUpdate(bluebookId, {
                $set: data
            }, { new: true });
            return result;
        } catch (exception) {
            throw exception;
        }
    }
}

const bluebookSvc = new BluebookService();
module.exports = bluebookSvc;