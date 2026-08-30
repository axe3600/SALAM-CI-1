import API from "./api";

// =====================================================
// SERVICE DES COURS
// =====================================================

class CourseService {

    // =====================================================
    // COURS DE L'ENSEIGNANT CONNECTÉ
    // =====================================================
    async getTeacherCourses() {

        const response = await API.get(
            "/courses/teacher"
        );

        return response.data;

    }


    // =====================================================
    // DÉFINIR LE PRIX D'UN COURS
    // PATCH /api/courses/:id/price
    // =====================================================
    async updateCoursePrice(courseId, price) {

        const response = await API.patch(

            `/courses/${courseId}/price`,

            {
                price
            }

        );

        return response.data;

    }

}

export default new CourseService();