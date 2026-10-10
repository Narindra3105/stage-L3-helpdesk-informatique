exports.register=(req, res) =>{
    res.status(200).json({message : 'Validation OK', data :req.body});
};

exports.login=(req, res) =>{
    res.status(201).json({message : 'Validation OK', data :req.body});
};