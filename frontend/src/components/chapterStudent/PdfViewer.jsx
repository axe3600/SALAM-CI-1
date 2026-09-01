import {
    FaFilePdf,
    FaExternalLinkAlt
} from "react-icons/fa";

function PdfViewer({ pdf, getFileUrl }) {

    if (!pdf) {
        return null;
    }

    const pdfUrl = getFileUrl(pdf.file);

    return (
        <div className="
            bg-red-50
            border
            border-red-100
            rounded-2xl
            p-6
        ">

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div className="flex items-start gap-4">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-red-100
                        text-red-600
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                    ">

                        <FaFilePdf className="text-xl" />

                    </div>

                    <div>

                        <h4 className="
                            font-bold
                            text-gray-800
                            text-lg
                        ">
                            {pdf.title}
                        </h4>

                        {pdf.description && (
                            <p className="
                                text-gray-600
                                text-sm
                                mt-2
                                leading-6
                            ">
                                {pdf.description}
                            </p>
                        )}

                    </div>

                </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    Ouvrir le PDF
                    <FaExternalLinkAlt />
                </a>

                <a
                    href={pdfUrl}
                    download
                    className="
                        inline-flex
                        items-center
                        gap-2
                        bg-white
                        hover:bg-gray-100
                        text-red-700
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        border
                        border-red-200
                        transition
                    "
                >
                    Télécharger
                </a>

            </div>

        </div>
    );
}

export default PdfViewer;