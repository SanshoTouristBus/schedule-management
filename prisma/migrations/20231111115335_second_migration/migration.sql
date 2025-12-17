/*
  Warnings:

  - You are about to drop the column `userCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_customerId_fkey";

-- DropIndex
DROP INDEX "User_userCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userCode",
ADD COLUMN     "app" TEXT,
ADD COLUMN     "code" INTEGER,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "damageNameMasterId" INTEGER,
ADD COLUMN     "kana" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "membershipName" TEXT,
ADD COLUMN     "rentaStoreId" INTEGER,
ADD COLUMN     "schoolId" INTEGER,
ADD COLUMN     "shopId" INTEGER,
ADD COLUMN     "storeId" INTEGER,
ADD COLUMN     "tell" TEXT,
ADD COLUMN     "tempResetCode" TEXT,
ADD COLUMN     "tempResetCodeExpired" TIMESTAMP(3),
ADD COLUMN     "type" TEXT,
ADD COLUMN     "type2" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "Ucar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "processLastUpdatedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sateiId" TEXT,
    "number98" TEXT,
    "maker" TEXT,
    "name" TEXT,
    "color" TEXT,
    "plate" TEXT,
    "katashiki" TEXT,
    "bodyNumber" TEXT,
    "nenshiki" TEXT,
    "grade" TEXT,
    "classification" TEXT,
    "paperAcceptedAt" TEXT,
    "customerName" TEXT,
    "registerdAs" TEXT,
    "registeredAt" TEXT,
    "garageProvedAt" TIMESTAMP(3),
    "nameTransferedAt" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "Ucar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UcarProcessNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT,
    "onEnginerProcess" BOOLEAN DEFAULT false,
    "repetitionLimit" INTEGER,

    CONSTRAINT "UcarProcessNameMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UcarProcess" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "time" DOUBLE PRECISION,
    "note" TEXT,
    "ucarId" INTEGER,
    "ucarProcessNameMasterId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "UcarProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UcarPaperWorkNotes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "content" TEXT,
    "userId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "ucarId" INTEGER NOT NULL,

    CONSTRAINT "UcarPaperWorkNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "processLastUpdatedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bpNumber" TEXT NOT NULL,
    "orderNumber" TEXT,
    "orderedAt" TIMESTAMP(3),
    "orderCategory" INTEGER,
    "estimate" INTEGER,
    "orderStatusCategory" INTEGER,
    "customerName" TEXT,
    "carName" TEXT,
    "plate" TEXT,
    "frame" TEXT,
    "katashiki" TEXT,
    "prePermission" BOOLEAN,
    "preStart" BOOLEAN,
    "representativeCarBpNumber" TEXT,
    "managementCode" TEXT,
    "initDate" INTEGER,
    "currentEstimate" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "crScheduledAt" TIMESTAMP(3),
    "insuranceType" TEXT,
    "insuranceCompany" TEXT,
    "agreedPrice" INTEGER,
    "userId" INTEGER,
    "crUserId" INTEGER,
    "storeId" INTEGER,
    "damageNameMasterId" INTEGER,
    "favoredByUserIds" INTEGER[],

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProcessConfirmation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserProcessConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "settled" BOOLEAN DEFAULT false,
    "carId" INTEGER NOT NULL,
    "noteNameMasterId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "DamageNameMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "NoteNameMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BpSummary" (
    "id" SERIAL NOT NULL,
    "code" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "storeId" INTEGER,

    CONSTRAINT "BpSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "areaId" INTEGER,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT,
    "onEnginerProcess" BOOLEAN DEFAULT false,
    "repetitionLimit" INTEGER,

    CONSTRAINT "ProcessNameMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "time" DOUBLE PRECISION,
    "note" TEXT,
    "type" TEXT NOT NULL DEFAULT '通常',
    "processNameMasterId" INTEGER,
    "carId" INTEGER,
    "userId" INTEGER,
    "storeId" INTEGER,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "SubjectNameMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "email" TEXT,
    "password" TEXT,
    "type" TEXT,
    "role" TEXT NOT NULL DEFAULT '',
    "tempResetCode" TEXT,
    "tempResetCodeExpired" TIMESTAMP(3),
    "schoolId" INTEGER,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "attendanceNumber" INTEGER,
    "schoolId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnfitFellow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UnfitFellow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" TEXT NOT NULL DEFAULT '学年',
    "class" TEXT NOT NULL DEFAULT '組',
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherClass" (
    "id" SERIAL NOT NULL,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teacherId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,

    CONSTRAINT "TeacherClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schoolId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomStudent" (
    "id" SERIAL NOT NULL,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roomId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "RoomStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "task" TEXT,
    "nthTime" INTEGER,
    "secretKey" TEXT NOT NULL,
    "absentStudentIds" INTEGER[],
    "activeQuestionPromptId" INTEGER,
    "schoolId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "subjectNameMasterId" INTEGER,
    "activeGroupId" INTEGER,
    "status" TEXT NOT NULL DEFAULT '進行中',
    "randomTargetStudentIds" INTEGER[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "isSaved" BOOLEAN NOT NULL,
    "gameId" INTEGER NOT NULL,
    "questionPromptId" INTEGER,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionPrompt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gameId" INTEGER NOT NULL,
    "asSummary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuestionPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "curiocity1" INTEGER,
    "curiocity2" INTEGER,
    "curiocity3" INTEGER,
    "curiocity4" INTEGER,
    "curiocity5" INTEGER,
    "efficacy1" INTEGER,
    "efficacy2" INTEGER,
    "efficacy3" INTEGER,
    "efficacy4" INTEGER,
    "efficacy5" INTEGER,
    "impression" TEXT,
    "asSummary" BOOLEAN NOT NULL DEFAULT false,
    "lessonSatisfaction" INTEGER,
    "lessonImpression" TEXT,
    "gameId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "questionPromptId" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BigCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "BigCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiddleCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "bigCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MiddleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "middleCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "payedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "type" TEXT,
    "lessonLogId" INTEGER,
    "userId" INTEGER,
    "traineeId" INTEGER,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lessonLogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLogAuthorizedUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "lessonLogId" INTEGER NOT NULL,

    CONSTRAINT "LessonLogAuthorizedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "authorizerId" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "LessonLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoFromUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lessonLogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "VideoFromUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonImage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "url" TEXT,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "LessonImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "message" TEXT,
    "url" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lessonLogId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemChatRoom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SystemChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemChat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "message" TEXT,
    "url" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "systemChatRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SystemChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentaStore" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "RentaStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentaDeal" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detalType" TEXT,
    "orderedAt" TIMESTAMP(3),
    "contractNum" INTEGER,
    "previousContractId" INTEGER,
    "contractHasChanged" BOOLEAN NOT NULL DEFAULT false,
    "maintanance" TEXT,
    "toyota" TEXT,
    "carType" TEXT,
    "mat" TEXT,
    "invitationFee" INTEGER,
    "moneyCollectionScheduledAt" TIMESTAMP(3),
    "moneyCollectedAt" TIMESTAMP(3),
    "willRegisterdAt" TIMESTAMP(3),
    "tentativeRegisteredAt" TIMESTAMP(3),
    "dlOrder" TEXT,
    "orderPaperSubmittedAt" TIMESTAMP(3),
    "contractPaperSubmittedAt" TIMESTAMP(3),
    "registerPaperSubmittedAt" TIMESTAMP(3),
    "storeNote" TEXT,
    "error" TEXT,
    "orderPaperReturnedAt" TIMESTAMP(3),
    "contractPaperReturnedAt" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3),
    "scannedAt" TIMESTAMP(3),
    "storeNote2" TEXT,
    "contractPrice" INTEGER,
    "ProfitPrice" INTEGER,
    "userId" INTEGER NOT NULL,
    "rentaCustomerId" INTEGER,

    CONSTRAINT "RentaDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentaDailyReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Memo" TEXT,
    "date" TIMESTAMP(3),
    "time" TEXT,
    "visitType" TEXT,
    "introductionAchieved" BOOLEAN,
    "increasedNegotiationsCount" INTEGER,
    "remarks" TEXT,
    "userId" INTEGER NOT NULL,
    "rentaCustomerId" INTEGER,
    "rentaStoreId" INTEGER NOT NULL,

    CONSTRAINT "RentaDailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentaCustomer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "corporateClassificationName" TEXT,
    "industryCode" TEXT,
    "industryCodeName" TEXT,
    "name" TEXT,
    "kana" TEXT,
    "nameTop" TEXT,
    "nameBottom" TEXT,
    "postalCode" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "repPos" TEXT,
    "repName" TEXT,
    "repKana" TEXT,
    "type" TEXT NOT NULL DEFAULT '管理',
    "PIC" TEXT,
    "carCount" INTEGER,
    "leaseCompanyNAme" TEXT,
    "trader" TEXT,
    "userId" INTEGER NOT NULL,
    "rentaStoreId" INTEGER,

    CONSTRAINT "RentaCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purpose" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rentaDailyReportId" INTEGER,
    "purposeMasterId" INTEGER NOT NULL,

    CONSTRAINT "Purpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurposeMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "PurposeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rentaDailyReportId" INTEGER,
    "outcomeMasterId" INTEGER NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "OutcomeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternateInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carName" TEXT,
    "dueDate" TIMESTAMP(3),
    "type" TEXT,
    "rentaDailyReportId" INTEGER,
    "rentaCustomerId" INTEGER,

    CONSTRAINT "AlternateInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "insuranceCompany" TEXT,
    "dueDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "rentaDailyReportId" INTEGER,
    "rentaCustomerId" INTEGER,

    CONSTRAINT "InsuranceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3),
    "remarks" TEXT,
    "imageUrl" TEXT,
    "rentaDailyReportId" INTEGER,
    "rentaCustomerId" INTEGER NOT NULL,

    CONSTRAINT "ExtraInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "bigCategory" TEXT,
    "aggCategory" TEXT,
    "supplier" TEXT,
    "maker" TEXT,
    "name" TEXT,
    "supplyUnit" TEXT,
    "unit" TEXT,
    "standard" INTEGER DEFAULT 0,
    "price" INTEGER DEFAULT 0,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPrice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemCode" TEXT NOT NULL,

    CONSTRAINT "ItemPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildRecipeTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "ChildRecipeTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "soldBy" TEXT,
    "basePrice" INTEGER,
    "totalWeight" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "callNumber" TEXT NOT NULL,
    "recipeCategoryCode" TEXT,
    "name" TEXT,
    "imageUrl" TEXT,
    "categoryMasterId" INTEGER,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInChildTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recipeId" INTEGER NOT NULL,
    "childRecipeTableId" INTEGER,
    "totalWeight" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,

    CONSTRAINT "RecipeInChildTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "recipeId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "RecipeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopRecipe" (
    "id" SERIAL NOT NULL,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recipeId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "ShopRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeProcedure" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "imageUrl" TEXT,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "CategoryMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LightMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "LightMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SizeMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "SizeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallMethodMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "InstallMethodMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "UsageMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "FunctionMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorTemperatureMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "ColorTemperatureMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LampMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "LampMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "FacilityMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "LocationMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investigation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "constructionNumber" TEXT,
    "buildingName" TEXT,
    "floor" TEXT,
    "installationArea" TEXT,
    "installationLocation" TEXT,
    "lightMasterId" TEXT,
    "sizeMasterId" TEXT,
    "installMethodMasterId" TEXT,
    "usageMasterId" TEXT,
    "functionMaster1Id" TEXT,
    "functionMaster2Id" TEXT,
    "colorTemperatuteMasterId" TEXT,
    "colorTemperature" TEXT,
    "fixtureNotes" TEXT,
    "lampMasterMasterId" TEXT,
    "lampPowerConsumption" TEXT,
    "numberOfLampsInFixture" TEXT,
    "numberOfFixtures" TEXT,
    "totalLamps" TEXT,
    "thinnedOutLampCount" TEXT,
    "turnedOffLampCount" TEXT,
    "constructionNotes" TEXT,
    "locationMasterId" INTEGER,

    CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewCar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "orderNumber" TEXT,
    "stuffCode" INTEGER,
    "katashiki" TEXT,
    "frame" TEXT,
    "buyerName" TEXT,
    "ownerName" TEXT,
    "bodyNumber" TEXT,
    "deliverScheduledAt" TEXT,
    "orderedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3),
    "soldAt" TIMESTAMP(3),
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "NewCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliverSchedule" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3),
    "carIds" INTEGER[],

    CONSTRAINT "DeliverSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingVehicle" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliverScheduleId" INTEGER,
    "slot" INTEGER,
    "pickedCarIds" TEXT[],
    "areaId" INTEGER,

    CONSTRAINT "LoadingVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carId" INTEGER,
    "newCarId" INTEGER,
    "loadingVehicleId" INTEGER NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" SERIAL NOT NULL,
    "code" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL DEFAULT '',
    "kana" TEXT NOT NULL DEFAULT '',
    "color" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "familyMemberId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "sharedMemberIds" INTEGER[],

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thanks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "familyMemberId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "sharedMemberIds" INTEGER[],

    CONSTRAINT "Thanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "familyMemberId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "solvedMemberIds" INTEGER[],
    "sharedMemberIds" INTEGER[],

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "price" INTEGER,
    "imageUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainee" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL DEFAULT '',
    "kana" TEXT NOT NULL DEFAULT '',
    "tell" TEXT,
    "email" TEXT,
    "color" TEXT,
    "password" TEXT NOT NULL,
    "startedAt" TEXT,
    "address" TEXT,
    "shoeSize" TEXT,
    "purpose" TEXT,
    "paymentPlan" TEXT,
    "paymentMethod" TEXT,
    "useRentalWear" TEXT,
    "useShower" TEXT,
    "type" TEXT,
    "type2" TEXT,

    CONSTRAINT "Trainee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3),
    "result" TEXT,
    "description" TEXT,
    "traineeId" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentToUnfitFellow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SquadToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ucar_sateiId_key" ON "Ucar"("sateiId");

-- CreateIndex
CREATE UNIQUE INDEX "UcarProcessNameMaster_name_key" ON "UcarProcessNameMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Car_bpNumber_key" ON "Car"("bpNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserProcessConfirmation_userId_date_key" ON "UserProcessConfirmation"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DamageNameMaster_name_key" ON "DamageNameMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NoteNameMaster_name_key" ON "NoteNameMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BpSummary_code_key" ON "BpSummary"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BpSummary_date_key_storeId_key" ON "BpSummary"("date", "key", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_code_key" ON "Store"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessNameMaster_name_key" ON "ProcessNameMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolId_classroomId_attendanceNumber_key" ON "Student"("schoolId", "classroomId", "attendanceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_schoolId_grade_class_key" ON "Classroom"("schoolId", "grade", "class");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherClass_teacherId_classroomId_key" ON "TeacherClass"("teacherId", "classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStudent_roomId_studentId_key" ON "RoomStudent"("roomId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_secretKey_key" ON "Game"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_gameId_studentId_questionPromptId_key" ON "Answer"("gameId", "studentId", "questionPromptId");

-- CreateIndex
CREATE UNIQUE INDEX "BigCategory_name_key" ON "BigCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MiddleCategory_bigCategoryId_name_key" ON "MiddleCategory"("bigCategoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_middleCategoryId_name_key" ON "Lesson"("middleCategoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LessonLogAuthorizedUser_userId_lessonLogId_key" ON "LessonLogAuthorizedUser"("userId", "lessonLogId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonLog_userId_lessonId_key" ON "LessonLog"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemChatRoom_userId_key" ON "SystemChatRoom"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RentaStore_code_key" ON "RentaStore"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RentaStore_name_key" ON "RentaStore"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RentaDeal_contractNum_key" ON "RentaDeal"("contractNum");

-- CreateIndex
CREATE UNIQUE INDEX "RentaCustomer_code_key" ON "RentaCustomer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PurposeMaster_name_key" ON "PurposeMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OutcomeMaster_name_key" ON "OutcomeMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPrice_itemCode_date_key" ON "ItemPrice"("itemCode", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ChildRecipeTable_recipeId_key" ON "ChildRecipeTable"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_callNumber_key" ON "Recipe"("callNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_code_key" ON "Shop"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "Shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_email_key" ON "Shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShopRecipe_recipeId_shopId_key" ON "ShopRecipe"("recipeId", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryMaster_name_key" ON "CategoryMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LightMaster_name_key" ON "LightMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SizeMaster_name_key" ON "SizeMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InstallMethodMaster_name_key" ON "InstallMethodMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UsageMaster_name_key" ON "UsageMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FunctionMaster_name_key" ON "FunctionMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ColorTemperatureMaster_name_key" ON "ColorTemperatureMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LampMaster_name_key" ON "LampMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityMaster_name_key" ON "FacilityMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMaster_name_key" ON "LocationMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NewCar_orderNumber_key" ON "NewCar"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeliverSchedule_date_key" ON "DeliverSchedule"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_code_key" ON "FamilyMember"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_email_key" ON "FamilyMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainee_email_key" ON "Trainee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToUnfitFellow_AB_unique" ON "_StudentToUnfitFellow"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToUnfitFellow_B_index" ON "_StudentToUnfitFellow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SquadToStudent_AB_unique" ON "_SquadToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_SquadToStudent_B_index" ON "_SquadToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- AddForeignKey
ALTER TABLE "Ucar" ADD CONSTRAINT "Ucar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarProcess" ADD CONSTRAINT "UcarProcess_ucarId_fkey" FOREIGN KEY ("ucarId") REFERENCES "Ucar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarProcess" ADD CONSTRAINT "UcarProcess_ucarProcessNameMasterId_fkey" FOREIGN KEY ("ucarProcessNameMasterId") REFERENCES "UcarProcessNameMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarProcess" ADD CONSTRAINT "UcarProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarPaperWorkNotes" ADD CONSTRAINT "UcarPaperWorkNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarPaperWorkNotes" ADD CONSTRAINT "UcarPaperWorkNotes_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UcarPaperWorkNotes" ADD CONSTRAINT "UcarPaperWorkNotes_ucarId_fkey" FOREIGN KEY ("ucarId") REFERENCES "Ucar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_damageNameMasterId_fkey" FOREIGN KEY ("damageNameMasterId") REFERENCES "DamageNameMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rentaStoreId_fkey" FOREIGN KEY ("rentaStoreId") REFERENCES "RentaStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_crUserId_fkey" FOREIGN KEY ("crUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_damageNameMasterId_fkey" FOREIGN KEY ("damageNameMasterId") REFERENCES "DamageNameMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProcessConfirmation" ADD CONSTRAINT "UserProcessConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_noteNameMasterId_fkey" FOREIGN KEY ("noteNameMasterId") REFERENCES "NoteNameMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BpSummary" ADD CONSTRAINT "BpSummary_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_processNameMasterId_fkey" FOREIGN KEY ("processNameMasterId") REFERENCES "ProcessNameMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectNameMaster" ADD CONSTRAINT "SubjectNameMaster_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomStudent" ADD CONSTRAINT "RoomStudent_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomStudent" ADD CONSTRAINT "RoomStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_subjectNameMasterId_fkey" FOREIGN KEY ("subjectNameMasterId") REFERENCES "SubjectNameMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_questionPromptId_fkey" FOREIGN KEY ("questionPromptId") REFERENCES "QuestionPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPrompt" ADD CONSTRAINT "QuestionPrompt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionPromptId_fkey" FOREIGN KEY ("questionPromptId") REFERENCES "QuestionPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiddleCategory" ADD CONSTRAINT "MiddleCategory_bigCategoryId_fkey" FOREIGN KEY ("bigCategoryId") REFERENCES "BigCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_middleCategoryId_fkey" FOREIGN KEY ("middleCategoryId") REFERENCES "MiddleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLogAuthorizedUser" ADD CONSTRAINT "LessonLogAuthorizedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLogAuthorizedUser" ADD CONSTRAINT "LessonLogAuthorizedUser_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoFromUser" ADD CONSTRAINT "VideoFromUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoFromUser" ADD CONSTRAINT "VideoFromUser_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonImage" ADD CONSTRAINT "LessonImage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemChatRoom" ADD CONSTRAINT "SystemChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemChat" ADD CONSTRAINT "SystemChat_systemChatRoomId_fkey" FOREIGN KEY ("systemChatRoomId") REFERENCES "SystemChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemChat" ADD CONSTRAINT "SystemChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaDeal" ADD CONSTRAINT "RentaDeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaDeal" ADD CONSTRAINT "RentaDeal_rentaCustomerId_fkey" FOREIGN KEY ("rentaCustomerId") REFERENCES "RentaCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaDailyReport" ADD CONSTRAINT "RentaDailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaDailyReport" ADD CONSTRAINT "RentaDailyReport_rentaCustomerId_fkey" FOREIGN KEY ("rentaCustomerId") REFERENCES "RentaCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaDailyReport" ADD CONSTRAINT "RentaDailyReport_rentaStoreId_fkey" FOREIGN KEY ("rentaStoreId") REFERENCES "RentaStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaCustomer" ADD CONSTRAINT "RentaCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentaCustomer" ADD CONSTRAINT "RentaCustomer_rentaStoreId_fkey" FOREIGN KEY ("rentaStoreId") REFERENCES "RentaStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purpose" ADD CONSTRAINT "Purpose_rentaDailyReportId_fkey" FOREIGN KEY ("rentaDailyReportId") REFERENCES "RentaDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purpose" ADD CONSTRAINT "Purpose_purposeMasterId_fkey" FOREIGN KEY ("purposeMasterId") REFERENCES "PurposeMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_rentaDailyReportId_fkey" FOREIGN KEY ("rentaDailyReportId") REFERENCES "RentaDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_outcomeMasterId_fkey" FOREIGN KEY ("outcomeMasterId") REFERENCES "OutcomeMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternateInfo" ADD CONSTRAINT "AlternateInfo_rentaDailyReportId_fkey" FOREIGN KEY ("rentaDailyReportId") REFERENCES "RentaDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternateInfo" ADD CONSTRAINT "AlternateInfo_rentaCustomerId_fkey" FOREIGN KEY ("rentaCustomerId") REFERENCES "RentaCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceInfo" ADD CONSTRAINT "InsuranceInfo_rentaDailyReportId_fkey" FOREIGN KEY ("rentaDailyReportId") REFERENCES "RentaDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceInfo" ADD CONSTRAINT "InsuranceInfo_rentaCustomerId_fkey" FOREIGN KEY ("rentaCustomerId") REFERENCES "RentaCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraInfo" ADD CONSTRAINT "ExtraInfo_rentaDailyReportId_fkey" FOREIGN KEY ("rentaDailyReportId") REFERENCES "RentaDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraInfo" ADD CONSTRAINT "ExtraInfo_rentaCustomerId_fkey" FOREIGN KEY ("rentaCustomerId") REFERENCES "RentaCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPrice" ADD CONSTRAINT "ItemPrice_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRecipeTable" ADD CONSTRAINT "ChildRecipeTable_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_categoryMasterId_fkey" FOREIGN KEY ("categoryMasterId") REFERENCES "CategoryMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInChildTable" ADD CONSTRAINT "RecipeInChildTable_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInChildTable" ADD CONSTRAINT "RecipeInChildTable_childRecipeTableId_fkey" FOREIGN KEY ("childRecipeTableId") REFERENCES "ChildRecipeTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopRecipe" ADD CONSTRAINT "ShopRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopRecipe" ADD CONSTRAINT "ShopRecipe_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeProcedure" ADD CONSTRAINT "RecipeProcedure_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investigation" ADD CONSTRAINT "Investigation_locationMasterId_fkey" FOREIGN KEY ("locationMasterId") REFERENCES "LocationMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewCar" ADD CONSTRAINT "NewCar_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingVehicle" ADD CONSTRAINT "LoadingVehicle_deliverScheduleId_fkey" FOREIGN KEY ("deliverScheduleId") REFERENCES "DeliverSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingVehicle" ADD CONSTRAINT "LoadingVehicle_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_newCarId_fkey" FOREIGN KEY ("newCarId") REFERENCES "NewCar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_loadingVehicleId_fkey" FOREIGN KEY ("loadingVehicleId") REFERENCES "LoadingVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thanks" ADD CONSTRAINT "Thanks_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToUnfitFellow" ADD CONSTRAINT "_StudentToUnfitFellow_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToUnfitFellow" ADD CONSTRAINT "_StudentToUnfitFellow_B_fkey" FOREIGN KEY ("B") REFERENCES "UnfitFellow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SquadToStudent" ADD CONSTRAINT "_SquadToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SquadToStudent" ADD CONSTRAINT "_SquadToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
