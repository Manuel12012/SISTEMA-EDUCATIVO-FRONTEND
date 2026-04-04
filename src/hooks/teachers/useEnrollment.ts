import { useState } from "react"
import { enroll } from "../../services/Enrollments.service";

export const useEnrollments = () =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const enrollStudent =async(userId: number,
        courseId: number
    )=>{
        try {
            setLoading(true);
            setError(null);

            const data = await enroll(userId, courseId);

            return data;
        } catch (error) {
            setError("Error al enrollar al estudiante");
            throw error;
        } finally{
            setLoading(false);
        }
    }

    return{
        enrollStudent,
        loading,
        error
    }
}


