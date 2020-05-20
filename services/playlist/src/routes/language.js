import Language from "../models/Language";
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
import setFindQuery from "../config/setFindQuery"
import Album from "../models/Album"
import {
  saveAsserts,
  deleteAssert
} from "../core/digitalOceanSpaces";

const router = Router();

//Language Creation
router.post("/create", isAdmin, async (req, res) => {
  try {
    let {
      name,
      thumbnail
    } = req.body;
    const language = new Language({
      name,
      thumbnail,
      createdBy: req.user.id
    });
    await language.save();
    saveAsserts("languages", language._id, thumbnail, Language, "thumbnail");
    return res.send({
      status: true,
      data: language,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.send({
        status: false,
        data: "Language already exist.."
      });
    }
    return res.send({
      status: false,
      data: error.message,
    });
  }
});

//language Update
router.put("/:id", isAdmin, async (req, res) => {
  try {
    let {
      name,
      thumbnail
    } = req.body;
    const language = await Language.findById(req.params.id);
    if ([2, 3].includes(req.user.admin.accessLevel) || language.createdBy.toString() === req.user.id) {
      if (!language) {
        throw new Error("No language exist with that Id.");
      };
      language.name = name;
      language.thumbnail = thumbnail;
      language.updatedBy = req.user.id;
      await language.save();
      saveAsserts("languages", language._id, thumbnail, Language, "thumbnail");
      return res.send({
        status: true,
        data: language,
      });
    }
    throw new Error("You do not have permission to perform this action.");
  } catch (error) {
    console.error(error.message);
    return res.send({
      status: false,
      data: error.message,
    });
  }
});

//Get all language (page and limit query param is required)
router.get("/all", paginationMiddleware(Language), async (req, res) => {
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
      const language = await Language.findById(tagId).lean();
      if (!language) throw new Error("Language not found.");
      return res.send({
        status: true,
        data: language,
      });
    }
    if (startsWith) {
      const languages = await Language.find({
        name: {
          $regex: `${startsWith}`,
          $options: "i",
        },
      }).limit(5).lean();
      return res.send({
        status: true,
        data: languages,
      });
    }

    if (query) {
      const language = await Language.find({
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
        data: language,
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
router.get("/:languageId/albums", setFindQuery("languageArr", "languageId", "$in"), paginationMiddleware(Album, {}, {
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

//language Delete
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    if ([2, 3].includes(req.user.admin.accessLevel)) {
      const language = await Language.findById(req.params.id).lean();
      deleteAssert(language.thumbnail);
      await Language.deleteOne({
        _id: language._id
      });
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