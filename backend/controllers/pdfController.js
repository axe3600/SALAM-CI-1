import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Pdf from "../models/Pdf.js";

// ======================================
// AJOUTER UN PDF
// POST /api/pdfs
// ======================================

export const createPdf = async (req, res) => {

    try {

        const {
            title,
            description,
            chapter,
            order
        } = req.body;

        if (!req.file) {

            return res.status(400).json({

                message: "Veuillez sélectionner un fichier PDF."

            });

        }

        // ==========================
        // CLOUDINARY
        // ==========================

        const result =
            await cloudinary.uploader.upload(

                req.file.path,

                {
                    folder: "salam-ci/pdfs",
                    resource_type: "raw"
                }

            );

        // ==========================
        // SUPPRESSION TEMPORAIRE
        // ==========================

        if (fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        // ==========================
        // CREATION
        // ==========================

        const pdf = await Pdf.create({

            title,

            description,

            chapter,

            order,

            file: result.secure_url

        });

        res.status(201).json({

            message: "Document ajouté avec succès.",

            pdf

        });

    }

    catch (error) {

        if (req.file?.path && fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        console.error(
            "ERREUR AJOUT PDF :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================
// PDF D'UN CHAPITRE
// ======================================

export const getChapterPdfs = async (req, res) => {

    try {

        const pdfs = await Pdf.find({

            chapter: req.params.chapterId

        }).sort({

            order: 1

        });

        res.status(200).json(pdfs);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================
// MODIFIER UN PDF
// ======================================

export const updatePdf = async (req, res) => {

    try {

        const pdf = await Pdf.findById(req.params.id);

        if (!pdf) {

            return res.status(404).json({

                message: "Document introuvable."

            });

        }

        pdf.title =
            req.body.title;

        pdf.description =
            req.body.description;

        if (req.body.order !== undefined) {

            pdf.order =
                req.body.order;

        }

        // ==========================
        // NOUVEAU PDF
        // ==========================

        if (req.file) {

            const result =
                await cloudinary.uploader.upload(

                    req.file.path,

                    {
                        folder: "salam-ci/pdfs",
                        resource_type: "raw"
                    }

                );

            if (fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);

            }

            pdf.file =
                result.secure_url;

        }

        await pdf.save();

        res.status(200).json({

            message: "Document modifié avec succès.",

            pdf

        });

    }

    catch (error) {

        if (req.file?.path && fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        console.error(
            "ERREUR MODIFICATION PDF :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================
// SUPPRIMER UN PDF
// ======================================

export const deletePdf = async (req, res) => {

    try {

        const pdf = await Pdf.findById(req.params.id);

        if (!pdf) {

            return res.status(404).json({

                message: "Document introuvable."

            });

        }

        // Pour l'instant on supprime seulement
        // le document MongoDB.
        //
        // La suppression Cloudinary pourra être
        // ajoutée ensuite proprement.

        await pdf.deleteOne();

        res.status(200).json({

            message: "Document supprimé."

        });

    }

    catch (error) {

        console.error(
            "ERREUR SUPPRESSION PDF :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};