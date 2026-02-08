import { TamboComponent } from "@tambo-ai/react";
import { MultipleChoice } from "@/components/questions/MultipleChoice";
import { FillBlanks } from "@/components/questions/FillBlanks";
import { MatchFollowing } from "@/components/questions/MatchFollowing";
import { AssessmentResult } from "@/components/AssessmentResult";
import { StartAssessment } from "@/components/StartAssessment";
import {
    MultipleChoiceSchema,
    FillBlanksSchema,
    MatchFollowingSchema,
    StartAssessmentSchema,
    AssessmentResultSchema
} from "./schemas";

export const components: TamboComponent[] = [
    {
        name: "multiple_choice",
        component: MultipleChoice,
        propsSchema: MultipleChoiceSchema,
        description: "CRITICAL: You MUST use this component for ANY multiple choice question with options A/B/C/D. NEVER output questions as plain text. Always provide: question (the question text), options (array of 4 answer choices), correctAnswer (the correct option text), and explanation (why it's correct)."
    },
    {
        name: "fill_blanks",
        component: FillBlanks,
        propsSchema: FillBlanksSchema,
        description: "REQUIRED: Use this component for fill-in-the-blank questions. Never write blanks as plain text. Provide: sentence (with ___ for blanks) and blanks (array of correct answers)."
    },
    {
        name: "match_following",
        component: MatchFollowing,
        propsSchema: MatchFollowingSchema,
        description: "REQUIRED: Use this component for matching questions. Never list pairs as plain text. Provide pairs as an array of {left, right} objects. IMPORTANT: When user submits an answer, do NOT provide analysis or corrections - the component displays instant feedback automatically. Just ask if they want another question or move to the next topic."
    },
    {
        name: 'start_assessment',
        component: StartAssessment,
        propsSchema: StartAssessmentSchema,
        description: 'ALWAYS use this component FIRST when starting an assessment. After the user clicks Start Assessment, you MUST use multiple_choice, fill_blanks, or match_following components for each question - never plain text.'
    },
    {
        name: 'assessment_result',
        component: AssessmentResult,
        propsSchema: AssessmentResultSchema,
        description: 'Use this to display the final score after all questions are answered. Provide score, total, and summary.'
    }
];
