import Exercise from "../models/Exercise.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// ======================================================
// CREER
// ======================================================

export const createExercise = async (req, res) => {

    try {

        const {
            title,
            description,
            instructions,
            points,
            dueDate,
            chapter
        } = req.body;

        let attachment = "";

        // ==========================
        // PIECE JOINTE
        // ==========================

        if (req.file) {

            const result =
                await cloudinary.uploader.upload(

                    req.file.path,

                    {
                        folder: "salam-ci/exercises",
                        resource_type: "auto"
                    }

                );

            attachment =
                result.secure_url;

            if (fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);

            }

        }

        // ==========================
        // CREATION
        // ==========================

        const exercise = await Exercise.create({

            title,
            description,
            instructions,
            points,
            dueDate,
            attachment,
            chapter

        });

        res.status(201).json(exercise);

    }

    catch (error) {

        if (req.file?.path && fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        console.error(
            "ERREUR CREATION EXERCICE :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================================
// TOUS LES EXERCICES D'UN CHAPITRE
// ======================================================

export const getExercisesByChapter = async (req, res) => {

    try {

        const exercises = await Exercise.find({

            chapter: req.params.chapterId

        }).sort({

            createdAt: -1

        });

        res.json(exercises);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================================
// MODIFIER
// ======================================================

export const updateExercise = async (req, res) => {

    try {

        const exercise =
            await Exercise.findById(req.params.id);

        if (!exercise) {

            return res.status(404).json({

                message: "Exercice introuvable."

            });

        }

        exercise.title =
            req.body.title;

        exercise.description =
            req.body.description;

        exercise.instructions =
            req.body.instructions;

        exercise.points =
            req.body.points;

        exercise.dueDate =
            req.body.dueDate;

        // ==========================
        // NOUVELLE PIECE JOINTE
        // ==========================

        if (req.file) {

            const result =
                await cloudinary.uploader.upload(

                    req.file.path,

                    {
                        folder: "salam-ci/exercises",
                        resource_type: "auto"
                    }

                );

            if (fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);

            }

            exercise.attachment =
                result.secure_url;

        }

        await exercise.save();

        res.json({

            message: "Exercice modifié.",

            exercise

        });

    }

    catch (error) {

        if (req.file?.path && fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        console.error(
            "ERREUR MODIFICATION EXERCICE :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================================
// SUPPRIMER
// ======================================================

export const deleteExercise = async (req, res) => {

    try {

        const exercise =
            await Exercise.findById(req.params.id);

        if (!exercise) {

            return res.status(404).json({

                message: "Exercice introuvable."

            });

        }

        await exercise.deleteOne();

        res.json({

            message: "Exercice supprimé."

        });

    }

    catch (error) {

        console.error(
            "ERREUR SUPPRESSION EXERCICE :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};