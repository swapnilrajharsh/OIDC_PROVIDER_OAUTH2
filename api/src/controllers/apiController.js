exports.apiController = async(req, res) => {
    res.status(200)
        .json({
            success : true,
            message : 'Change is inevitable'
        })
}