import type { Exam } from "../types/exam"

export type ExamActions =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: Exam[] }
    | { type: "FETCH_ONE_SUCCESS"; payload: Exam }
    | { type: "FETCH_ERROR"; payload: string }
    | { type: "CLEAR_ERROR" };

export type ExamState = {
    exams: Exam[];
    exam: Exam | null;
    loading: boolean;
    error: string | null;
};

export const initialState: ExamState = {
    exams: [],
    exam: null,
    loading: false,
    error: null,
};

export const examReducer = (
    state: ExamState,
    action: ExamActions
): ExamState => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null,
            };

        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                exams: action.payload,
            };

        case "FETCH_ONE_SUCCESS":
            return {
                ...state,
                loading: false,
                exam: action.payload,
            };

        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case "CLEAR_ERROR":
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};