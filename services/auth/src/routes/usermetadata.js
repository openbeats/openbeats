import {
    Router
} from "express";
import User from "../models/User";
import auth from "../config/auth"


const router = Router();


router.post("/recentlyplayed", async (req, res) => {
    const userId = req.body.userId;
    const videoId = req.body.videoId;
    const info = req.body.info;
    try {
        let song = JSON.parse(Buffer.from(info, 'base64').toString());
        console.log(song);


        // const user = await User.findById(userId);
        // let flag = false;
        // if (!user) {
        //     return res.send({
        //         status: false,
        //         msg: "User not found."
        //     });
        // }
        // while (!(user.recentlyPlayedSongs.length <= 30)) {
        //     user.recentlyPlayedSongs.pop();
        // }
        // for (let i = 0; i < user.recentlyPlayedSongs.length; i++) {
        //     if (user.recentlyPlayedSongs[i].videoId === videoId) {
        //         flag = true;
        //         ++user.recentlyPlayedSongs[i].count;
        //         break;
        //     }
        // }
        // if (!flag) {
        //     user.recentlyPlayedSongs.unshift({
        //         ...song,
        //         count: 1
        //     });
        // }
        // await user.save();
        res.send({
            status: true,
            msg: "Song added to recently played."
        });

    } catch (error) {
        res.send({
            status: false,
            msg: "Internal server error."
        });
        console.log(error.message);
    }
});

router.get("/recentlyplayed", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const data = user.recentlyPlayedSongs;
        res.send({
            status: true,
            data
        });
    } catch (error) {
        res.send({
            status: false,
            msg: "Internal server error."
        });
        console.error(error.message);
    }
});

export default router;