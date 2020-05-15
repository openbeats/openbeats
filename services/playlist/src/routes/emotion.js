import Emotion from "../models/Emotion";
import {
  Router
} from "express";
import {
  check,
  oneOf,
  validationResult
} from "express-validator";
import isAdmin from "../permissions/admin"
import paginationMiddleware from "../config/paginationMiddleware";
import setFindQuery from "../config/setFindQuery";
import Album from "../models/Album"

const router = Router();

//emotion Creation
router.post("/create", isAdmin, async (req, res) => {
  try {
    let {
      name,
      thumbnail
    } = req.body;
    const emotion = new Emotion({
      name,
      thumbnail,
      createdBy: req.user.id
    });
    await emotion.save();
    return res.send({
      status: true,
      data: emotion,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.send({
        status: false,
        data: "Emotion already exist.."
      });
    }
    return res.send({
      status: false,
      data: error.message,
    });
  }
});

//emotion Update
router.put("/:id", isAdmin, async (req, res) => {
  try {
    let {
      name,
      thumbnail
    } = req.body;
    if ([2, 3].includes(req.user.admin.accessLevel)) {
      const emotion = await Emotion.findById(req.params.id);
      if (!emotion) throw new Error("No emotion exist with that Id.");
      emotion.name = name;
      emotion.thumbnail = thumbnail;
      emotion.updatedBy = req.user.id;
      await emotion.save();
      return res.send({
        status: true,
        data: emotion,
      });
    }
    throw new Error("You do not have permission to perform this action.")
  } catch (error) {
    console.error(error.message);
    return res.send({
      status: false,
      data: error.message,
    });
  }
});

//Get all emotions (page and limit query param is required)
router.get("/all", paginationMiddleware(Emotion), async (req, res) => {
  try {
    if (res.pagnationError) throw new Error(res.pagnationError);
    res.send({
      status: true,
      data: res.paginatedResults,
    });
  } catch (error) {
    console.error(error.message);
    res.send({
      status: false,
      data: error.message,
    });
  }
});

router.get("/fetch", oneOf([check("tagId").exists(), check("startsWith").exists(), check("query").exists()]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        data: "Please provide either tagId, startsWith or query as queryparams.",
      });
    }
    const {
      tagId,
      startsWith,
      query,
    } = req.query;
    if (tagId) {
      const emotion = await Emotion.findById(tagId).lean();
      if (!emotion) throw new Error("Emotion not found.");
      return res.send({
        status: true,
        data: emotion,
      });
    }
    if (startsWith) {
      const emotions = await Emotion.find({
        name: {
          $regex: `${startsWith}`,
          $options: "i",
        },
      }).limit(5).lean();
      return res.send({
        status: true,
        data: emotions,
      });
    }
    if (query) {
      const emotion = await Emotion.find({
        $text: {
          $search: `${query}`,
          $caseSensitive: false,
        },
      }, {
        score: {
          $meta: "textScore",
        },
      }).sort({
        score: {
          $meta: "textScore"
        }
      }).lean();
      return res.send({
        status: true,
        data: emotion,
      });
    }
    return res.send({
      status: false,
      data: [],
    });
  } catch (error) {
    console.error(error.message);
    res.send({
      status: false,
      data: error.message,
    });
  }
});

// fetch albums related to specific emotion..
router.get("/:emotionId/albums", setFindQuery("emotion", "emotionId", "$in"), paginationMiddleware(Album, {}, {
  _id: true,
  name: 1,
  thumbnail: 2,
  createdAt: 4,
  totalSongs: 3,
}), async (req, res) => {
  try {
    if (res.pagnationError) throw new Error(res.pagnationError);
    return res.send({
      status: true,
      data: res.paginatedResults,
    });
  } catch (error) {
    console.error(error.message);
    return res.send({
      status: false,
      data: error.message,
    });
  }
});

//emotion Delete
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    if ([2, 3].includes(req.user.admin.accessLevel)) {
      await Emotion.findByIdAndDelete(req.params.id);
      return res.send({
        status: true,
        data: "Deleted Successfully..",
      });
    }
    throw new Error("You do not have permission to perform this action.")
  } catch (error) {
    console.error(error.message);
    return res.send({
      status: false,
      data: error.message,
    });
  }
});


export default router;