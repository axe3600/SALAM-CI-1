import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Video from "../models/Video.js";

// ============================================================
// AJOUTER UNE VIDEO
// POST /api/videos
// ============================================================

export const createVideo = async (req, res) => {

    try {

        const {
            title,
            description,
            duration,
            order,
            chapter
        } = req.body;

        if (!req.file) {

            return res.status(400).json({
                message: "Veuillez sélectionner une vidéo."
            });

        }

        // ==========================
        // UPLOAD CLOUDINARY
        // ==========================

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "salam-ci/videos",
                resource_type: "video"
            }
        );

        // ==========================
        // SUPPRIMER LE FICHIER TEMPORAIRE
        // ==========================

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // ==========================
        // CREATION
        // ==========================

        const newVideo = await Video.create({

            title,
            description,
            duration,
            order,
            chapter,

            video: result.secure_url

        });

        res.status(201).json({

            message: "Vidéo ajoutée avec succès.",

            video: newVideo

        });

    }

    catch (error) {

        // Nettoyage en cas d'erreur
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error(
            "ERREUR AJOUT VIDEO :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ============================================================
// VIDEOS D'UN CHAPITRE
// ============================================================

export const getVideosByChapter = async (req, res) => {

    try {

        const videos = await Video.find({

            chapter: req.params.chapterId

        }).sort({

            order: 1

        });

        res.json(videos);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ============================================================
// MODIFIER UNE VIDEO
// PUT /api/videos/:id
// ============================================================

export const updateVideo = async (req, res) => {

    try {

        const video = await Video.findById(req.params.id);

        if (!video) {

            return res.status(404).json({

                message: "Vidéo introuvable."

            });

        }

        video.title = req.body.title;
        video.description = req.body.description;
        video.duration = req.body.duration;
        video.order = req.body.order;

        // ==========================
        // NOUVELLE VIDEO
        // ==========================

        if (req.file) {

            const result = await cloudinary.uploader.upload(

                req.file.path,

                {
                    folder: "salam-ci/videos",
                    resource_type: "video"
                }

            );

            // Supprimer fichier temporaire
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            // ==========================
            // SUPPRIMER ANCIENNE VIDEO
            // ==========================

            if (
                video.video &&
                video.video.includes("res.cloudinary.com")
            ) {

                try {

                    const uploadMarker = "/upload/";

                    const uploadIndex =
                        video.video.indexOf(uploadMarker);

                    if (uploadIndex !== -1) {

                        let publicId =
                            video.video.substring(
                                uploadIndex + uploadMarker.length
                            );

                        // Supprimer version Cloudinary
                        if (publicId.startsWith("v")) {

                            const versionEnd =
                                publicId.indexOf("/");

                            if (versionEnd !== -1) {

                                publicId =
                                    publicId.substring(
                                        versionEnd + 1
                                    );

                            }

                        }

                        // Supprimer extension
                        publicId =
                            publicId.replace(
                                /\.[^/.]+$/,
                                ""
                            );

                        await cloudinary.uploader.destroy(
                            publicId,
                            {
                                resource_type: "video"
                            }
                        );

                    }

                }

                catch (deleteError) {

                    console.error(
                        "Erreur suppression ancienne vidéo :",
                        deleteError.message
                    );

                }

            }

            video.video = result.secure_url;

        }

        await video.save();

        res.status(200).json({

            message: "Vidéo modifiée avec succès.",

            video

        });

    }

    catch (error) {

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error(
            "ERREUR MODIFICATION VIDEO :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ============================================================
// SUPPRIMER UNE VIDEO
// DELETE /api/videos/:id
// ============================================================

export const deleteVideo = async (req, res) => {

    try {

        const video = await Video.findById(req.params.id);

        if (!video) {

            return res.status(404).json({

                message: "Vidéo introuvable."

            });

        }

        // ==========================
        // SUPPRESSION CLOUDINARY
        // ==========================

        if (
            video.video &&
            video.video.includes("res.cloudinary.com")
        ) {

            try {

                const uploadMarker = "/upload/";

                const uploadIndex =
                    video.video.indexOf(uploadMarker);

                if (uploadIndex !== -1) {

                    let publicId =
                        video.video.substring(
                            uploadIndex + uploadMarker.length
                        );

                    if (publicId.startsWith("v")) {

                        const versionEnd =
                            publicId.indexOf("/");

                        if (versionEnd !== -1) {

                            publicId =
                                publicId.substring(
                                    versionEnd + 1
                                );

                        }

                    }

                    publicId =
                        publicId.replace(
                            /\.[^/.]+$/,
                            ""
                        );

                    await cloudinary.uploader.destroy(
                        publicId,
                        {
                            resource_type: "video"
                        }
                    );

                }

            }

            catch (deleteError) {

                console.error(
                    "Erreur suppression Cloudinary :",
                    deleteError.message
                );

            }

        }
        else if (
            video.video &&
            fs.existsSync(video.video)
        ) {

            fs.unlinkSync(video.video);

        }

        await video.deleteOne();

        res.status(200).json({

            message: "Vidéo supprimée."

        });

    }

    catch (error) {

        console.error(
            "ERREUR SUPPRESSION VIDEO :",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};