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
        description: "Use this to present a multiple choice question to the user. Validates the user's selection against a correct answer."
    },
    {
        name: "fill_blanks",
        component: FillBlanks,
        propsSchema: FillBlanksSchema,
        description: "Use this for 'fill in the blank' style questions. The user must complete the sentence."
    },
    {
        name: "match_following",
        component: MatchFollowing,
        propsSchema: MatchFollowingSchema,
        description: "Use this to create a matching question where users connect items from two columns."
    },
    {
        name: 'start_assessment',
        component: StartAssessment,
        propsSchema: StartAssessmentSchema,
        description: 'ALWAYS use this component to begin a new assessment session when the user provides a topic. It initializes the flow.'
    },
    {
        name: 'assessment_result',
        component: AssessmentResult,
        propsSchema: AssessmentResultSchema,
        description: 'Use this to display the final score and summary after the assessment is complete.'
    }
];
