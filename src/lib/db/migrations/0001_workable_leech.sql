CREATE TABLE "chargers" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"lat" real NOT NULL,
	"long" real NOT NULL,
	"status" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chargers" ADD CONSTRAINT "chargers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;