import dbConnect from "../../lib/mongodb";
import user from "../../models/user";

export default async function handler(req, res) {
    const {query: { id }, method,} = req;
    await dbConnect();

    switch (method) {
        case 'PUT': 
            try {
                const user = await user.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                })
                if (!item) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: item });
            } catch (error) {
                res.status(400).json({ success: flase });
            }
            break;
        case 'DELETE':
            try {
                const deletedUser = await user.deleteOne({ _id: id });
                if (!deletedUser) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}