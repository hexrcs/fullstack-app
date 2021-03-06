# Migration `20200719151728-model-data`

This migration has been generated by Xiaoru Li at 7/19/2020, 3:17:28 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" SERIAL,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Post" (
"authorId" integer  NOT NULL ,"content" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" SERIAL,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Comment" (
"authorId" integer  NOT NULL ,"content" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" SERIAL,"parentCommentId" integer   ,"postId" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."_UserFriendsUser" (
"A" integer  NOT NULL ,"B" integer  NOT NULL )

CREATE TABLE "public"."_UserLikesPost" (
"A" integer  NOT NULL ,"B" integer  NOT NULL )

CREATE TABLE "public"."_UserLikesComment" (
"A" integer  NOT NULL ,"B" integer  NOT NULL )

ALTER TABLE "public"."Profile" ADD COLUMN "userId" integer  NOT NULL ;

CREATE UNIQUE INDEX "_UserFriendsUser_AB_unique" ON "public"."_UserFriendsUser"("A","B")

CREATE  INDEX "_UserFriendsUser_B_index" ON "public"."_UserFriendsUser"("B")

CREATE UNIQUE INDEX "_UserLikesPost_AB_unique" ON "public"."_UserLikesPost"("A","B")

CREATE  INDEX "_UserLikesPost_B_index" ON "public"."_UserLikesPost"("B")

CREATE UNIQUE INDEX "_UserLikesComment_AB_unique" ON "public"."_UserLikesComment"("A","B")

CREATE  INDEX "_UserLikesComment_B_index" ON "public"."_UserLikesComment"("B")

CREATE UNIQUE INDEX "Profile_userId" ON "public"."Profile"("userId")

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Comment" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Comment" ADD FOREIGN KEY ("parentCommentId")REFERENCES "public"."Comment"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Comment" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserFriendsUser" ADD FOREIGN KEY ("A")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserFriendsUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserLikesPost" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserLikesPost" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserLikesComment" ADD FOREIGN KEY ("A")REFERENCES "public"."Comment"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_UserLikesComment" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Profile" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200517134513-init..20200719151728-model-data
--- datamodel.dml
+++ datamodel.dml
@@ -1,13 +1,63 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
 }
 model Profile {
-  id   Int    @default(autoincrement()) @id
-  name String
-}
+  id     Int    @default(autoincrement()) @id
+  name   String
+  user   User   @relation("UserHasProfile", fields: [userId], references: [id])
+  userId Int
+}
+
+model User {
+  id      Int      @default(autoincrement()) @id
+  profile Profile? @relation("UserHasProfile")
+
+  // Friends
+  friends  User[] @relation("UserFriendsUser", references: [id])
+  friendOf User[] @relation("UserFriendsUser", references: [id])
+
+  // Posts
+  posts      Post[] @relation("UserAuthorsPost")
+  likedPosts Post[] @relation("UserLikesPost")
+
+  // Comments
+  comments      Comment[] @relation("UserAuthorsComment")
+  likedComments Comment[] @relation("UserLikesComment")
+}
+
+model Post {
+  id        Int      @default(autoincrement()) @id
+  content   String
+  createdAt DateTime @default(now())
+
+  author   User @relation("UserAuthorsPost", fields: [authorId], references: [id])
+  authorId Int
+
+  likedBy User[] @relation("UserLikesPost", references: [id])
+
+  comments Comment[] @relation("PostHasComment")
+}
+
+model Comment {
+  id        Int      @default(autoincrement()) @id
+  content   String
+  createdAt DateTime @default(now())
+
+  post   Post @relation("PostHasComment", fields: [postId], references: [id])
+  postId Int
+
+  parentComment   Comment?  @relation("CommentParentsComment", fields: [parentCommentId])
+  parentCommentId Int?
+  childComments   Comment[] @relation("CommentParentsComment")
+
+  author   User @relation("UserAuthorsComment", fields: [authorId], references: [id])
+  authorId Int
+
+  likedBy User[] @relation("UserLikesComment", references: [id])
+}
```


