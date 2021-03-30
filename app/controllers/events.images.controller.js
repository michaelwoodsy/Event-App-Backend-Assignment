const eventsImages = require('../models/events.images.model');

exports.read = async function(req, res){
    try {
        const id = req.params.id
        const imageCheck = await eventsImages.getEvent(id);
        if (imageCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            const image = imageCheck[0].image_filename;
            if (image == null) {
                res.statusMessage = "Not Found";
                res.status(404).send();
            } else {
                if (image.endsWith("png")) {
                    res.header("Content-Type").set('image/png')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                } else if (image.endsWith("jpg")) {
                    res.header("Content-Type").set('image/jpeg')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                } else if (image.endsWith("gif")) {
                    res.header("Content-Type").set('image/gif')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.set = async function(req, res){
    return null;
};