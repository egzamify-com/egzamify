CREATE TABLE "ai_learning_platform_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"isCorrect" boolean NOT NULL,
	"label" char NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_learning_platform_qualifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "ai_learning_platform_qualifications_name_unique" UNIQUE("name"),
	CONSTRAINT "ai_learning_platform_qualifications_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "ai_learning_platform_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qualification_id" uuid NOT NULL,
	"content" text NOT NULL,
	"year" integer NOT NULL,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "ai_learning_platform_answers" ADD CONSTRAINT "ai_learning_platform_answers_question_id_ai_learning_platform_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."ai_learning_platform_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_learning_platform_questions" ADD CONSTRAINT "ai_learning_platform_questions_qualification_id_ai_learning_platform_qualifications_id_fk" FOREIGN KEY ("qualification_id") REFERENCES "public"."ai_learning_platform_qualifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answer_id_idx" ON "ai_learning_platform_answers" USING btree ("id");--> statement-breakpoint
CREATE INDEX "answer_question_id_idx" ON "ai_learning_platform_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "qualification_id_idx" ON "ai_learning_platform_qualifications" USING btree ("id");--> statement-breakpoint
CREATE INDEX "qualification_label_idx" ON "ai_learning_platform_qualifications" USING btree ("label");--> statement-breakpoint
CREATE INDEX "question_id_idx" ON "ai_learning_platform_questions" USING btree ("id");--> statement-breakpoint
CREATE INDEX "qualification_question_id_idx" ON "ai_learning_platform_questions" USING btree ("qualification_id");