-- CreateEnum
CREATE TYPE "RecurringPattern" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY', 'BIWEEKLY', 'QUARTERLY', 'CUSTOM', 'DAILY', 'WEEKDAYS', 'WEEKENDS');

-- CreateTable
CREATE TABLE "BigCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "BigCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiddleCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "payedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "type" TEXT,
    "lessonLogId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "lessonLogId" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "LessonLogAuthorizedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "authorizerId" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LessonLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoFromUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "message" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lessonLogId" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemChatRoom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SystemChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemChat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE "KaizenClient" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "organization" TEXT,
    "iconUrl" TEXT,
    "bannerUrl" TEXT,
    "website" TEXT,
    "note" TEXT,
    "public" BOOLEAN DEFAULT false,
    "introductionRequestedAt" TIMESTAMP(3),

    CONSTRAINT "KaizenClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenReview" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "username" TEXT,
    "review" TEXT,
    "platform" TEXT,
    "kaizenClientId" INTEGER,

    CONSTRAINT "KaizenReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenWork" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uuid" TEXT,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "subtitle" TEXT,
    "status" TEXT,
    "description" TEXT,
    "points" TEXT,
    "clientName" TEXT,
    "organization" TEXT,
    "dealPoint" DOUBLE PRECISION,
    "toolPoint" DOUBLE PRECISION,
    "impression" TEXT,
    "reply" TEXT,
    "jobCategory" TEXT,
    "systemCategory" TEXT,
    "collaborationTool" TEXT,
    "showName" BOOLEAN DEFAULT false,
    "kaizenClientId" INTEGER,
    "allowShowClient" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT false,
    "correctionRequest" TEXT,

    CONSTRAINT "KaizenWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenWorkImage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "kaizenWorkId" INTEGER,

    CONSTRAINT "KaizenWorkImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenCMS" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contactPageMsg" TEXT,
    "principlePageMsg" TEXT,

    CONSTRAINT "KaizenCMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqSaleCart" (
    "id" SERIAL NOT NULL,
    "baseOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "userId" INTEGER,
    "aqCustomerId" INTEGER NOT NULL,

    CONSTRAINT "AqSaleCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqSaleRecord" (
    "baseSaleRecordId" TEXT,
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION,
    "taxedPrice" DOUBLE PRECISION,
    "remarks" TEXT,
    "userId" INTEGER,
    "aqCustomerId" INTEGER NOT NULL,
    "aqProductId" INTEGER NOT NULL,
    "aqPriceOptionId" INTEGER,
    "aqSaleCartId" INTEGER NOT NULL,
    "aqCustomerSubscriptionId" INTEGER,
    "subscriptionYearMonth" TIMESTAMP(3),

    CONSTRAINT "AqSaleRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqProduct" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "productCode" TEXT,
    "name" TEXT NOT NULL,
    "aqProductCategoryMasterId" INTEGER,
    "fromBase" BOOLEAN DEFAULT false,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "inInventoryManagement" BOOLEAN NOT NULL DEFAULT true,
    "aqDefaultShiireAqCustomerId" INTEGER,

    CONSTRAINT "AqProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqPriceOption" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "aqProductId" INTEGER,

    CONSTRAINT "AqPriceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "email" TEXT,
    "customerNumber" TEXT,
    "fromBase" BOOLEAN DEFAULT false,
    "companyName" TEXT,
    "jobTitle" TEXT,
    "name" TEXT,
    "defaultPaymentMethod" TEXT,
    "furikomisakiCD" TEXT,
    "tel" TEXT,
    "tel2" TEXT,
    "fax" TEXT,
    "invoiceNumber" TEXT,
    "status" TEXT DEFAULT '継続',
    "domestic" BOOLEAN NOT NULL DEFAULT true,
    "postal" TEXT,
    "state" TEXT,
    "city" TEXT,
    "street" TEXT,
    "building" TEXT,
    "remarks" TEXT,
    "firstVisitDate" TIMESTAMP(3),
    "lastVisitDate" TIMESTAMP(3),
    "maintananceYear" INTEGER,
    "maintananceMonth" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "AqCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerSubscription" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "maintananceYear" INTEGER NOT NULL,
    "maintananceMonth" INTEGER NOT NULL,
    "aqCustomerId" INTEGER NOT NULL,
    "aqDeviceMasterId" INTEGER NOT NULL,
    "aqProductId" INTEGER NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "AqCustomerSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerPriceOption" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aqCustomerId" INTEGER NOT NULL,
    "aqProductId" INTEGER NOT NULL,
    "aqPriceOptionId" INTEGER NOT NULL,

    CONSTRAINT "AqCustomerPriceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3),
    "status" TEXT,
    "type" TEXT,
    "content" TEXT,
    "remarks" TEXT,
    "aqCustomerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AqCustomerRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerRecordAttachment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "title" TEXT,
    "url" TEXT,
    "aqCustomerRecordId" INTEGER,

    CONSTRAINT "AqCustomerRecordAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqSupportGroupMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "AqSupportGroupMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqProductCategoryMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "AqProductCategoryMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqServiecTypeMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "AqServiecTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqDealerMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "AqDealerMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aqDeviceMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "aqDeviceMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerDealerMidTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aqCustomerId" INTEGER NOT NULL,
    "aqDealerMasterId" INTEGER NOT NULL,

    CONSTRAINT "AqCustomerDealerMidTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerServiceTypeMidTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aqCustomerId" INTEGER NOT NULL,
    "aqServiecTypeMasterId" INTEGER,

    CONSTRAINT "AqCustomerServiceTypeMidTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerDeviceMidTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aqCustomerId" INTEGER NOT NULL,
    "aqDeviceMasterId" INTEGER NOT NULL,

    CONSTRAINT "AqCustomerDeviceMidTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqCustomerSupportGroupMidTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3),
    "aqSupportGroupMasterId" INTEGER,
    "aqCustomerId" INTEGER NOT NULL,

    CONSTRAINT "AqCustomerSupportGroupMidTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqInventoryRegister" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aqProductId" INTEGER NOT NULL,
    "aqCustomerId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "AqInventoryRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqInventoryByMonth" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "yearMonth" TIMESTAMP(3) NOT NULL,
    "aqProductId" INTEGER NOT NULL,

    CONSTRAINT "AqInventoryByMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqInquiry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT,
    "person" TEXT,
    "tel" TEXT,
    "email" TEXT,
    "type" TEXT,
    "content" TEXT,
    "mailBody" TEXT,
    "importance" TEXT,
    "followRequired" BOOLEAN NOT NULL DEFAULT false,
    "purchaseIntended" BOOLEAN NOT NULL DEFAULT false,
    "aqCustomerId" INTEGER,

    CONSTRAINT "AqInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideBlock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blockType" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "alignment" TEXT,
    "verticalAlign" TEXT,
    "textColor" TEXT,
    "backgroundColor" TEXT,
    "fontWeight" TEXT,
    "textDecoration" TEXT,
    "isCorrectAnswer" BOOLEAN NOT NULL DEFAULT false,
    "slideId" INTEGER NOT NULL,

    CONSTRAINT "SlideBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideResponse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responseType" TEXT NOT NULL,
    "choiceAnswer" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN,
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
    "slideId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "SlideResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningRoleMasterOnGame" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "maxCount" INTEGER,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "LearningRoleMasterOnGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectNameMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "schoolId" INTEGER,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT,
    "tempResetCode" TEXT,
    "tempResetCodeExpired" TIMESTAMP(3),
    "type" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "gender" TEXT,
    "attendanceNumber" INTEGER,
    "schoolId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnfitFellow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UnfitFellow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" TEXT,
    "class" TEXT,
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
CREATE TABLE "GameStudent" (
    "id" SERIAL NOT NULL,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "gameId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "GameStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "secretKey" TEXT NOT NULL,
    "absentStudentIds" INTEGER[],
    "schoolId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "subjectNameMasterId" INTEGER,
    "status" TEXT,
    "activeGroupId" INTEGER,
    "activeQuestionPromptId" INTEGER,
    "nthTime" INTEGER,
    "randomTargetStudentIds" INTEGER[],
    "learningContent" TEXT,
    "task" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupCreateConfig" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "groupCreationMode" TEXT,
    "count" INTEGER,
    "criteria" TEXT,
    "genderConfig" TEXT,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "GroupCreateConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentRole" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "studentId" INTEGER NOT NULL,
    "learningRoleMasterOnGameId" INTEGER NOT NULL,
    "squadId" INTEGER NOT NULL,

    CONSTRAINT "StudentRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionPrompt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
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
    "gameId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "questionPromptId" INTEGER,
    "asSummary" BOOLEAN NOT NULL DEFAULT false,
    "lessonImpression" TEXT,
    "lessonSatisfaction" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "requireUnit" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "recordTime" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bloodSugarValue" INTEGER,
    "medicineId" INTEGER,
    "medicineUnit" DOUBLE PRECISION,
    "walkingShortDistance" DOUBLE PRECISION DEFAULT 0,
    "walkingMediumDistance" DOUBLE PRECISION DEFAULT 0,
    "walkingLongDistance" DOUBLE PRECISION DEFAULT 0,
    "walkingExercise" DOUBLE PRECISION DEFAULT 0,
    "memo" TEXT,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthJournal" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "journalDate" TIMESTAMP(3) NOT NULL,
    "goalAndReflection" TEXT,
    "templateApplied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HealthJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthJournalEntry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "healthJournalId" INTEGER NOT NULL,
    "hourSlot" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "HealthJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthJournalImage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "healthJournalEntryId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "description" TEXT,

    CONSTRAINT "HealthJournalImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "RecurringPattern" "RecurringPattern",
    "recurringEndDate" TIMESTAMP(3),
    "recurringWeekdays" INTEGER[],
    "recurringDayOfMonth" INTEGER,
    "recurringMonths" INTEGER[],
    "userId" INTEGER,
    "recurringTaskId" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAttachment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "TaskAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringTask" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pattern" "RecurringPattern" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "weekdays" INTEGER[],
    "dayOfMonth" INTEGER,
    "months" INTEGER[],
    "interval" INTEGER NOT NULL DEFAULT 1,
    "nextGenerationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER,

    CONSTRAINT "RecurringTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeihiExpense" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "location" TEXT,
    "counterpartyName" TEXT,
    "counterpartyIndustry" TEXT,
    "conversationPurpose" TEXT[],
    "keywords" TEXT[],
    "conversationSummary" TEXT,
    "summary" TEXT,
    "learningDepth" INTEGER,
    "counterpartyContact" TEXT,
    "followUpPlan" TEXT,
    "businessOpportunity" TEXT,
    "competitorInfo" TEXT,
    "insight" TEXT,
    "autoTags" TEXT[],
    "mfSubject" TEXT,
    "mfSubAccount" TEXT,
    "mfTaxCategory" TEXT,
    "mfDepartment" TEXT,
    "mfMemo" TEXT,
    "userId" TEXT,

    CONSTRAINT "KeihiExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeihiAttachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "keihiExpenseId" TEXT,

    CONSTRAINT "KeihiAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeihiAccountMaster" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "balanceSheet" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "subAccount" TEXT,
    "taxCategory" TEXT NOT NULL,
    "searchKey" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER,

    CONSTRAINT "KeihiAccountMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeihiOptionMaster" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,

    CONSTRAINT "KeihiOptionMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "familyId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityScore" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "achievementImgUrl" TEXT,
    "animationLevel" TEXT NOT NULL DEFAULT 'light',
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "ActivityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvaluationRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "comment" TEXT,
    "openedByChild" BOOLEAN NOT NULL DEFAULT false,
    "requestedById" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "activityScoreId" INTEGER NOT NULL,
    "approvedById" INTEGER,

    CONSTRAINT "ActivityEvaluationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlySetting" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "MonthlySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmCustomer" (
    "id" SERIAL NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "contactName" VARCHAR(100),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "postalCode" VARCHAR(10),
    "prefecture" VARCHAR(50),
    "city" VARCHAR(100),
    "street" VARCHAR(200),
    "building" VARCHAR(100),
    "email" VARCHAR(255),
    "availablePoints" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmProduct" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "currentPrice" INTEGER NOT NULL,
    "currentCost" INTEGER NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmProductPriceHistory" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sbmProductId" INTEGER NOT NULL,

    CONSTRAINT "SbmProductPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sbm_delivery_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "totalReservations" INTEGER NOT NULL DEFAULT 0,
    "completedReservations" INTEGER NOT NULL DEFAULT 0,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "routeUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sbm_delivery_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sbm_delivery_route_stops" (
    "id" TEXT NOT NULL,
    "sbmDeliveryGroupId" INTEGER NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "estimatedArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "deliveryOrder" INTEGER NOT NULL,
    "deliveryCompleted" BOOLEAN NOT NULL DEFAULT false,
    "recoveryCompleted" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDuration" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sbm_delivery_route_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sbm_delivery_group_reservations" (
    "id" SERIAL NOT NULL,
    "sbmDeliveryGroupId" INTEGER NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "deliveryOrder" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sbm_delivery_group_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmReservation" (
    "id" SERIAL NOT NULL,
    "sbmCustomerId" INTEGER NOT NULL,
    "customerName" VARCHAR(200) NOT NULL,
    "contactName" VARCHAR(100),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "postalCode" VARCHAR(10),
    "prefecture" VARCHAR(50),
    "city" VARCHAR(100),
    "street" VARCHAR(200),
    "building" VARCHAR(100),
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "pickupLocation" VARCHAR(50) NOT NULL,
    "purpose" VARCHAR(100) NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "orderChannel" VARCHAR(50) NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "pointsUsed" INTEGER NOT NULL DEFAULT 0,
    "finalAmount" INTEGER NOT NULL,
    "orderStaff" VARCHAR(100) NOT NULL,
    "userId" INTEGER,
    "notes" TEXT,
    "deliveryCompleted" BOOLEAN NOT NULL DEFAULT false,
    "recoveryCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmReservationItem" (
    "id" TEXT NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "sbmProductId" INTEGER NOT NULL,
    "productName" VARCHAR(200) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SbmReservationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmReservationTask" (
    "id" SERIAL NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "taskType" VARCHAR(50) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmReservationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmReservationChangeHistory" (
    "id" TEXT NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "changedBy" VARCHAR(100) NOT NULL,
    "changeType" VARCHAR(50) NOT NULL,
    "changedFields" JSONB,
    "oldValues" JSONB,
    "newValues" JSONB,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SbmReservationChangeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmDeliveryTeam" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "driverName" VARCHAR(100) NOT NULL,
    "vehicleInfo" VARCHAR(200),
    "capacity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmDeliveryTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmDeliveryAssignment" (
    "id" SERIAL NOT NULL,
    "sbmDeliveryTeamId" INTEGER NOT NULL,
    "sbmReservationId" INTEGER NOT NULL,
    "assignedBy" VARCHAR(100) NOT NULL,
    "userId" INTEGER,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "route" JSONB,
    "status" VARCHAR(50) NOT NULL DEFAULT 'assigned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SbmDeliveryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SbmRfmAnalysis" (
    "id" SERIAL NOT NULL,
    "sbmCustomerId" INTEGER NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recency" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,
    "monetary" INTEGER NOT NULL,
    "rScore" INTEGER NOT NULL,
    "fScore" INTEGER NOT NULL,
    "mScore" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "rank" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SbmRfmAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "hiredAt" TIMESTAMP(3),
    "yukyuCategory" TEXT DEFAULT 'A',
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "email" TEXT,
    "password" TEXT,
    "type" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "tempResetCode" TEXT,
    "tempResetCodeExpired" TIMESTAMP(3),
    "storeId" INTEGER,
    "schoolId" INTEGER,
    "rentaStoreId" INTEGER,
    "type2" TEXT,
    "shopId" INTEGER,
    "membershipName" TEXT,
    "damageNameMasterId" INTEGER,
    "color" TEXT,
    "app" TEXT,
    "apps" TEXT[],
    "employeeCode" TEXT,
    "phone" TEXT,
    "familyId" INTEGER,
    "avatar" TEXT,
    "bcc" TEXT,
    "tbmBaseId" INTEGER,
    "departmentId" INTEGER,
    "tbmVehicleId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseNotes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rootPath" TEXT NOT NULL,
    "title" TEXT,
    "msg" TEXT NOT NULL,
    "imgUrl" TEXT,
    "confirmedUserIds" INTEGER[],

    CONSTRAINT "ReleaseNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleAccessToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "scope" TEXT,
    "token_type" TEXT,
    "id_token" TEXT,
    "expiry_date" TIMESTAMP(3),
    "tokenJSON" TEXT,

    CONSTRAINT "GoogleAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "apps" TEXT[],

    CONSTRAINT "RoleMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "roleMasterId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainMethodLock" (
    "id" SERIAL NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChainMethodLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "holidayType" TEXT NOT NULL DEFAULT '出勤',

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT,
    "shiireSakiId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiireSaki" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "ShiireSaki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchaseType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "result" TEXT,
    "approverComment" TEXT,
    "trashed" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "leaveType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "comment" TEXT,
    "purchaseRequestId" INTEGER,
    "leaveRequestId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrefCity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pref" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "PrefCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayRemarksUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kyuka" BOOLEAN DEFAULT false,
    "kyukaTodoke" BOOLEAN DEFAULT false,
    "dayRemarksId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DayRemarksUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genba" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "defaultStartTime" TEXT,
    "construction" TEXT,
    "houseHoldsCount1" INTEGER,
    "houseHoldsCount2" INTEGER,
    "houseHoldsCount3" INTEGER,
    "houseHoldsCount4" INTEGER,
    "houseHoldsCount5" INTEGER,
    "houseHoldsCount6" INTEGER,
    "houseHoldsCount7" INTEGER,
    "warningString" TEXT,
    "zip" TEXT,
    "state" TEXT,
    "city" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "prefCityId" INTEGER,
    "archived" BOOLEAN DEFAULT false,

    CONSTRAINT "Genba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SohkenCar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "plate" TEXT,
    "role" TEXT,
    "userId" INTEGER,

    CONSTRAINT "SohkenCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaDay" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "subTask" TEXT,
    "remarks" TEXT,
    "ninku" DOUBLE PRECISION,
    "finished" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "overStuffCount" INTEGER DEFAULT 0,
    "status" TEXT,
    "ninkuFullfilled" BOOLEAN DEFAULT false,
    "isLastFullfilledDay" BOOLEAN DEFAULT false,
    "allAssignedNinkuTillThisDay" INTEGER,
    "allRequiredNinku" INTEGER,
    "genbaId" INTEGER NOT NULL,

    CONSTRAINT "GenbaDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaTask" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT,
    "color" TEXT,
    "from" TIMESTAMP(3),
    "to" TIMESTAMP(3),
    "requiredNinku" DOUBLE PRECISION,
    "subTask" TEXT,
    "remarks" TEXT,
    "genbaId" INTEGER NOT NULL,

    CONSTRAINT "GenbaTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaDayTaskMidTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "genbaDayId" INTEGER NOT NULL,
    "genbaTaskId" INTEGER NOT NULL,

    CONSTRAINT "GenbaDayTaskMidTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaDaySoukenCar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "genbaDayId" INTEGER NOT NULL,
    "sohkenCarId" INTEGER NOT NULL,
    "genbaId" INTEGER NOT NULL,

    CONSTRAINT "GenbaDaySoukenCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaDayShift" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3),
    "from" TEXT,
    "to" TEXT,
    "important" BOOLEAN DEFAULT false,
    "shokucho" BOOLEAN DEFAULT false,
    "directGo" BOOLEAN DEFAULT false,
    "directReturn" BOOLEAN DEFAULT false,
    "userId" INTEGER NOT NULL,
    "genbaDayId" INTEGER NOT NULL,
    "genbaId" INTEGER NOT NULL,

    CONSTRAINT "GenbaDayShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenbaTaskMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "GenbaTaskMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayRemarks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "bikou" TEXT,
    "shinseiGyomu" TEXT,
    "ninkuCount" DOUBLE PRECISION,
    "nippoDocsUrl" TEXT,

    CONSTRAINT "DayRemarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayRemarksFile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dayRemarksId" INTEGER,

    CONSTRAINT "DayRemarksFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SohkenGoogleCalendar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calendarId" TEXT NOT NULL,
    "eventId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "summary" TEXT,

    CONSTRAINT "SohkenGoogleCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForcedWorkDay" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForcedWorkDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockConfig" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StockConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "favorite" INTEGER DEFAULT 0,
    "heldCount" INTEGER DEFAULT 0,
    "averageBuyPrice" DOUBLE PRECISION DEFAULT 0,
    "profit" DOUBLE PRECISION,
    "Code" TEXT NOT NULL,
    "Date" TIMESTAMP(3),
    "CompanyName" TEXT,
    "CompanyNameEnglish" TEXT,
    "Sector17Code" TEXT,
    "Sector17CodeName" TEXT,
    "Sector33Code" TEXT,
    "Sector33CodeName" TEXT,
    "ScaleCategory" TEXT,
    "MarketCode" TEXT,
    "MarketCodeName" TEXT,
    "last_Date" TIMESTAMP(3),
    "last_Open" INTEGER,
    "last_High" INTEGER,
    "last_Low" INTEGER,
    "last_Close" INTEGER,
    "last_UpperLimit" TEXT,
    "last_LowerLimit" TEXT,
    "last_Volume" INTEGER,
    "last_TurnoverValue" TEXT,
    "last_AdjustmentFactor" INTEGER,
    "last_AdjustmentOpen" INTEGER,
    "last_AdjustmentHigh" INTEGER,
    "last_AdjustmentLow" INTEGER,
    "last_AdjustmentClose" INTEGER,
    "last_AdjustmentVolume" INTEGER,
    "last_updatedAt" TIMESTAMP(3),
    "last_riseRate" INTEGER,
    "last_josho" BOOLEAN,
    "last_dekidakaJosho" BOOLEAN,
    "last_renzokuJosho" BOOLEAN,
    "last_takaneBreakout" BOOLEAN,
    "last_idoHeikinKairiJosho" BOOLEAN,
    "last_spike" BOOLEAN,
    "last_spikeFall" BOOLEAN,
    "last_spikeRise" BOOLEAN,
    "last_recentCrash" BOOLEAN,
    "last_goldenCross" BOOLEAN,
    "last_rsiOversold" BOOLEAN,
    "last_crashAndRebound" BOOLEAN,
    "last_consecutivePositiveCloses" BOOLEAN,
    "last_macdBullish" BOOLEAN,
    "last_volumeBreakout" BOOLEAN,
    "last_priceVolumeBreakout" BOOLEAN,
    "last_deathCross" BOOLEAN,
    "last_rsiOverbought" BOOLEAN,
    "last_macdBearish" BOOLEAN,
    "last_lowVolatility" BOOLEAN,
    "last_supportBounce" BOOLEAN,
    "last_resistanceBreak" BOOLEAN,
    "last_macdLine" DOUBLE PRECISION,
    "last_macdSignal" DOUBLE PRECISION,
    "last_macdHistogram" DOUBLE PRECISION,
    "last_ma5" DOUBLE PRECISION,
    "last_ma20" DOUBLE PRECISION,
    "last_ma60" DOUBLE PRECISION,
    "last_rsi" DOUBLE PRECISION,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "Date" TIMESTAMP(3),
    "Code" TEXT,
    "Open" INTEGER,
    "High" INTEGER,
    "Low" INTEGER,
    "Close" INTEGER,
    "UpperLimit" TEXT,
    "LowerLimit" TEXT,
    "Volume" INTEGER,
    "TurnoverValue" TEXT,
    "AdjustmentFactor" INTEGER,
    "AdjustmentOpen" INTEGER,
    "AdjustmentHigh" INTEGER,
    "AdjustmentLow" INTEGER,
    "AdjustmentClose" INTEGER,
    "AdjustmentVolume" INTEGER,
    "riseRate" INTEGER,
    "josho" BOOLEAN,
    "dekidakaJosho" BOOLEAN,
    "renzokuJosho" BOOLEAN,
    "takaneBreakout" BOOLEAN,
    "idoHeikinKairiJosho" BOOLEAN,
    "spike" BOOLEAN,
    "spikeFall" BOOLEAN,
    "spikeRise" BOOLEAN,
    "recentCrash" BOOLEAN,
    "goldenCross" BOOLEAN,
    "rsiOversold" BOOLEAN,
    "crashAndRebound" BOOLEAN,
    "consecutivePositiveCloses" BOOLEAN,
    "macdBullish" BOOLEAN,
    "volumeBreakout" BOOLEAN,
    "priceVolumeBreakout" BOOLEAN,
    "deathCross" BOOLEAN,
    "rsiOverbought" BOOLEAN,
    "macdBearish" BOOLEAN,
    "lowVolatility" BOOLEAN,
    "supportBounce" BOOLEAN,
    "resistanceBreak" BOOLEAN,
    "macdLine" DOUBLE PRECISION,
    "macdSignal" DOUBLE PRECISION,
    "macdHistogram" DOUBLE PRECISION,
    "ma5" DOUBLE PRECISION,
    "ma20" DOUBLE PRECISION,
    "ma60" DOUBLE PRECISION,
    "rsi" DOUBLE PRECISION,
    "stockId" INTEGER NOT NULL,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmBase" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "TbmBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmRouteGroupCalendar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "holidayType" TEXT DEFAULT '',
    "remark" TEXT,
    "tbmRouteGroupId" INTEGER NOT NULL,

    CONSTRAINT "TbmRouteGroupCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmKeihi" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "item" TEXT,
    "amount" DOUBLE PRECISION,
    "date" TIMESTAMP(3),
    "remark" TEXT,
    "tbmBaseId" INTEGER NOT NULL,

    CONSTRAINT "TbmKeihi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmDriveScheduleImage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL,
    "tbmDriveScheduleId" INTEGER,

    CONSTRAINT "TbmDriveScheduleImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmBase_MonthConfig" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "yearMonth" TIMESTAMP(3) NOT NULL,
    "keiyuPerLiter" DOUBLE PRECISION,
    "gasolinePerLiter" DOUBLE PRECISION,
    "tbmBaseId" INTEGER NOT NULL,

    CONSTRAINT "TbmBase_MonthConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmVehicle" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT,
    "frameNo" TEXT,
    "vehicleNumber" TEXT NOT NULL,
    "type" TEXT,
    "shape" TEXT,
    "airSuspension" TEXT,
    "oilTireParts" TEXT,
    "maintenance" TEXT,
    "insurance" TEXT,
    "shodoTorokubi" TIMESTAMP(3),
    "sakenManryobi" TIMESTAMP(3),
    "hokenManryobi" TIMESTAMP(3),
    "sankagetsuTenkenbi" TIMESTAMP(3),
    "sokoKyori" DOUBLE PRECISION,
    "jibaisekiHokenCompany" TEXT,
    "jibaisekiManryobi" TIMESTAMP(3),
    "jidoshaHokenCompany" TEXT,
    "jidoshaManryobi" TIMESTAMP(3),
    "kamotsuHokenCompany" TEXT,
    "kamotsuManryobi" TIMESTAMP(3),
    "sharyoHokenCompany" TEXT,
    "sharyoManryobi" TIMESTAMP(3),
    "etcCardNumber" TEXT,
    "etcCardExpiration" TIMESTAMP(3),
    "tbmBaseId" INTEGER NOT NULL,

    CONSTRAINT "TbmVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmFuelCard" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tbmVehicleId" INTEGER,

    CONSTRAINT "TbmFuelCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmVehicleMaintenanceRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "contractor" TEXT,
    "remark" TEXT,
    "type" TEXT,
    "tbmVehicleId" INTEGER,

    CONSTRAINT "TbmVehicleMaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmRouteGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "routeName" TEXT,
    "pickupTime" TEXT,
    "vehicleType" TEXT,
    "productName" TEXT,
    "seikyuKbn" TEXT DEFAULT '01',
    "tbmBaseId" INTEGER NOT NULL,

    CONSTRAINT "TbmRouteGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmRouteGroupFee" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "driverFee" INTEGER,
    "futaiFee" INTEGER,
    "tbmRouteGroupId" INTEGER NOT NULL,

    CONSTRAINT "TbmRouteGroupFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmMonthlyConfigForRouteGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yearMonth" TIMESTAMP(3) NOT NULL,
    "generalFee" INTEGER,
    "tsukoryoSeikyuGaku" INTEGER,
    "seikyuKaisu" INTEGER,
    "numberOfTrips" INTEGER,
    "tbmRouteGroupId" INTEGER NOT NULL,

    CONSTRAINT "TbmMonthlyConfigForRouteGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mid_TbmRouteGroup_TbmCustomer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tbmRouteGroupId" INTEGER NOT NULL,
    "tbmCustomerId" INTEGER NOT NULL,

    CONSTRAINT "Mid_TbmRouteGroup_TbmCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmBillingAddress" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "TbmBillingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmInvoiceDetail" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "numberOfTrips" INTEGER NOT NULL,
    "fare" DOUBLE PRECISION NOT NULL,
    "toll" DOUBLE PRECISION NOT NULL,
    "specialAddition" DOUBLE PRECISION,

    CONSTRAINT "TbmInvoiceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmCustomer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phoneNumber" TEXT,
    "faxNumber" TEXT,
    "bankInformation" TEXT,
    "tbmBaseId" INTEGER,

    CONSTRAINT "TbmCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmRefuelHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "odometer" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "tbmVehicleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TbmRefuelHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmCarWashHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tbmVehicleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TbmCarWashHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmDriveSchedule" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "O_postalHighwayFee" INTEGER,
    "Q_generalHighwayFee" INTEGER,
    "userId" INTEGER,
    "tbmVehicleId" INTEGER,
    "tbmRouteGroupId" INTEGER NOT NULL,
    "finished" BOOLEAN DEFAULT false,
    "confirmed" BOOLEAN DEFAULT false,
    "approved" BOOLEAN DEFAULT false,
    "tbmBaseId" INTEGER NOT NULL,

    CONSTRAINT "TbmDriveSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TbmEtcMeisai" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "groupIndex" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "info" JSONB[],
    "sum" DOUBLE PRECISION NOT NULL,
    "tbmVehicleId" INTEGER,
    "tbmDriveScheduleId" INTEGER,

    CONSTRAINT "TbmEtcMeisai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OdometerInput" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "odometerStart" DOUBLE PRECISION NOT NULL,
    "odometerEnd" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tbmVehicleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OdometerInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkStatus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "workStatus" TEXT,
    "remark" TEXT,
    "vehicleNumber" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "kyukeiMins" TEXT,
    "shinyaKyukeiMins" TEXT,
    "kyusokuMins" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserWorkStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KyuyoTableRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "other1" DOUBLE PRECISION,
    "other2" DOUBLE PRECISION,
    "shokuhi" DOUBLE PRECISION,
    "maebaraikin" DOUBLE PRECISION,
    "rate" DOUBLE PRECISION DEFAULT 0.5,
    "yearMonth" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "KyuyoTableRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentToUnfitFellow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentToUnfitFellow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SquadToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SquadToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BigCategory_name_key" ON "BigCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LessonLogAuthorizedUser_userId_lessonLogId_key" ON "LessonLogAuthorizedUser"("userId", "lessonLogId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonLog_userId_lessonId_key" ON "LessonLog"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonImage_lessonId_name_key" ON "LessonImage"("lessonId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemChatRoom_userId_key" ON "SystemChatRoom"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KaizenClient_name_organization_key" ON "KaizenClient"("name", "organization");

-- CreateIndex
CREATE UNIQUE INDEX "KaizenWork_uuid_key" ON "KaizenWork"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "KaizenWork_title_subtitle_key" ON "KaizenWork"("title", "subtitle");

-- CreateIndex
CREATE UNIQUE INDEX "KaizenWorkImage_url_key" ON "KaizenWorkImage"("url");

-- CreateIndex
CREATE UNIQUE INDEX "AqSaleCart_baseOrderId_key" ON "AqSaleCart"("baseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "AqSaleRecord_baseSaleRecordId_key" ON "AqSaleRecord"("baseSaleRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "AqSaleRecord_aqCustomerId_aqProductId_subscriptionYearMonth_key" ON "AqSaleRecord"("aqCustomerId", "aqProductId", "subscriptionYearMonth", "aqCustomerSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "AqProduct_name_key" ON "AqProduct"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomer_email_key" ON "AqCustomer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomer_customerNumber_key" ON "AqCustomer"("customerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomer_name_key" ON "AqCustomer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomerPriceOption_aqCustomerId_aqProductId_key" ON "AqCustomerPriceOption"("aqCustomerId", "aqProductId");

-- CreateIndex
CREATE UNIQUE INDEX "AqSupportGroupMaster_name_key" ON "AqSupportGroupMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqProductCategoryMaster_name_key" ON "AqProductCategoryMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqServiecTypeMaster_name_key" ON "AqServiecTypeMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqDealerMaster_name_key" ON "AqDealerMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "aqDeviceMaster_name_key" ON "aqDeviceMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomerDealerMidTable_aqCustomerId_aqDealerMasterId_key" ON "AqCustomerDealerMidTable"("aqCustomerId", "aqDealerMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomerServiceTypeMidTable_aqCustomerId_aqServiecTypeMas_key" ON "AqCustomerServiceTypeMidTable"("aqCustomerId", "aqServiecTypeMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomerDeviceMidTable_aqCustomerId_aqDeviceMasterId_key" ON "AqCustomerDeviceMidTable"("aqCustomerId", "aqDeviceMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "AqCustomerSupportGroupMidTable_aqCustomerId_aqSupportGroupM_key" ON "AqCustomerSupportGroupMidTable"("aqCustomerId", "aqSupportGroupMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "AqInventoryByMonth_aqProductId_yearMonth_key" ON "AqInventoryByMonth"("aqProductId", "yearMonth");

-- CreateIndex
CREATE UNIQUE INDEX "SlideResponse_slideId_studentId_gameId_key" ON "SlideResponse"("slideId", "studentId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolId_classroomId_attendanceNumber_key" ON "Student"("schoolId", "classroomId", "attendanceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_schoolId_grade_class_key" ON "Classroom"("schoolId", "grade", "class");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherClass_teacherId_classroomId_key" ON "TeacherClass"("teacherId", "classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStudent_gameId_studentId_key" ON "GameStudent"("gameId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_secretKey_key" ON "Game"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "GroupCreateConfig_gameId_key" ON "GroupCreateConfig"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_gameId_studentId_questionPromptId_key" ON "Answer"("gameId", "studentId", "questionPromptId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_name_key" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "HealthRecord_userId_recordDate_idx" ON "HealthRecord"("userId", "recordDate");

-- CreateIndex
CREATE INDEX "HealthRecord_userId_category_idx" ON "HealthRecord"("userId", "category");

-- CreateIndex
CREATE INDEX "HealthJournal_userId_journalDate_idx" ON "HealthJournal"("userId", "journalDate");

-- CreateIndex
CREATE UNIQUE INDEX "HealthJournal_userId_journalDate_key" ON "HealthJournal"("userId", "journalDate");

-- CreateIndex
CREATE INDEX "HealthJournalEntry_healthJournalId_hourSlot_idx" ON "HealthJournalEntry"("healthJournalId", "hourSlot");

-- CreateIndex
CREATE UNIQUE INDEX "HealthJournalEntry_healthJournalId_hourSlot_key" ON "HealthJournalEntry"("healthJournalId", "hourSlot");

-- CreateIndex
CREATE INDEX "HealthJournalImage_healthJournalEntryId_idx" ON "HealthJournalImage"("healthJournalEntryId");

-- CreateIndex
CREATE INDEX "Task_userId_dueDate_idx" ON "Task"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "Task_completed_dueDate_idx" ON "Task"("completed", "dueDate");

-- CreateIndex
CREATE INDEX "Task_recurringTaskId_idx" ON "Task"("recurringTaskId");

-- CreateIndex
CREATE INDEX "RecurringTask_userId_isActive_idx" ON "RecurringTask"("userId", "isActive");

-- CreateIndex
CREATE INDEX "RecurringTask_nextGenerationDate_isActive_idx" ON "RecurringTask"("nextGenerationDate", "isActive");

-- CreateIndex
CREATE INDEX "KeihiOptionMaster_category_isActive_sortOrder_idx" ON "KeihiOptionMaster"("category", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "KeihiOptionMaster_category_value_key" ON "KeihiOptionMaster"("category", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityEvaluationRequest_requestedById_activityId_date_key" ON "ActivityEvaluationRequest"("requestedById", "activityId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlySetting_year_month_key_key" ON "MonthlySetting"("year", "month", "key");

-- CreateIndex
CREATE UNIQUE INDEX "SbmCustomer_phoneNumber_key" ON "SbmCustomer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sbm_delivery_group_reservations_sbmDeliveryGroupId_sbmReser_key" ON "sbm_delivery_group_reservations"("sbmDeliveryGroupId", "sbmReservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeCode_key" ON "User"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_name_key" ON "Tokens"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccessToken_email_key" ON "GoogleAccessToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoleMaster_name_key" ON "RoleMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleMasterId_key" ON "UserRole"("userId", "roleMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_date_key" ON "Calendar"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ShiireSaki_code_key" ON "ShiireSaki"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_purchaseRequestId_index_userId_key" ON "Approval"("purchaseRequestId", "index", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_leaveRequestId_index_userId_key" ON "Approval"("leaveRequestId", "index", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrefCity_pref_city_key" ON "PrefCity"("pref", "city");

-- CreateIndex
CREATE UNIQUE INDEX "DayRemarksUser_dayRemarksId_userId_key" ON "DayRemarksUser"("dayRemarksId", "userId");

-- CreateIndex
CREATE INDEX "GenbaDay_date_idx" ON "GenbaDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GenbaDay_date_genbaId_key" ON "GenbaDay"("date", "genbaId");

-- CreateIndex
CREATE INDEX "GenbaTask_from_idx" ON "GenbaTask"("from");

-- CreateIndex
CREATE INDEX "GenbaTask_to_idx" ON "GenbaTask"("to");

-- CreateIndex
CREATE UNIQUE INDEX "GenbaTask_name_genbaId_key" ON "GenbaTask"("name", "genbaId");

-- CreateIndex
CREATE UNIQUE INDEX "GenbaDayTaskMidTable_genbaDayId_genbaTaskId_key" ON "GenbaDayTaskMidTable"("genbaDayId", "genbaTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "GenbaDaySoukenCar_genbaDayId_sohkenCarId_key" ON "GenbaDaySoukenCar"("genbaDayId", "sohkenCarId");

-- CreateIndex
CREATE UNIQUE INDEX "GenbaDayShift_userId_genbaDayId_key" ON "GenbaDayShift"("userId", "genbaDayId");

-- CreateIndex
CREATE UNIQUE INDEX "DayRemarks_date_key" ON "DayRemarks"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SohkenGoogleCalendar_eventId_key" ON "SohkenGoogleCalendar"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "StockConfig_type_name_key" ON "StockConfig"("type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Code_key" ON "Stock"("Code");

-- CreateIndex
CREATE INDEX "StockHistory_Date_idx" ON "StockHistory"("Date");

-- CreateIndex
CREATE UNIQUE INDEX "StockHistory_stockId_Date_key" ON "StockHistory"("stockId", "Date");

-- CreateIndex
CREATE UNIQUE INDEX "TbmBase_code_key" ON "TbmBase"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TbmBase_name_key" ON "TbmBase"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TbmRouteGroupCalendar_tbmRouteGroupId_date_key" ON "TbmRouteGroupCalendar"("tbmRouteGroupId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TbmBase_MonthConfig_tbmBaseId_yearMonth_key" ON "TbmBase_MonthConfig"("tbmBaseId", "yearMonth");

-- CreateIndex
CREATE UNIQUE INDEX "TbmVehicle_code_key" ON "TbmVehicle"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TbmVehicle_frameNo_key" ON "TbmVehicle"("frameNo");

-- CreateIndex
CREATE UNIQUE INDEX "TbmVehicle_vehicleNumber_key" ON "TbmVehicle"("vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TbmVehicle_tbmBaseId_vehicleNumber_key" ON "TbmVehicle"("tbmBaseId", "vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TbmRouteGroup_code_key" ON "TbmRouteGroup"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TbmRouteGroup_tbmBaseId_code_key" ON "TbmRouteGroup"("tbmBaseId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "TbmMonthlyConfigForRouteGroup_yearMonth_tbmRouteGroupId_key" ON "TbmMonthlyConfigForRouteGroup"("yearMonth", "tbmRouteGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Mid_TbmRouteGroup_TbmCustomer_tbmRouteGroupId_key" ON "Mid_TbmRouteGroup_TbmCustomer"("tbmRouteGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Mid_TbmRouteGroup_TbmCustomer_tbmRouteGroupId_tbmCustomerId_key" ON "Mid_TbmRouteGroup_TbmCustomer"("tbmRouteGroupId", "tbmCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "TbmCustomer_code_key" ON "TbmCustomer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TbmCustomer_name_key" ON "TbmCustomer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TbmCustomer_tbmBaseId_name_key" ON "TbmCustomer"("tbmBaseId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TbmEtcMeisai_tbmDriveScheduleId_key" ON "TbmEtcMeisai"("tbmDriveScheduleId");

-- CreateIndex
CREATE INDEX "TbmEtcMeisai_tbmVehicleId_idx" ON "TbmEtcMeisai"("tbmVehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "TbmEtcMeisai_tbmVehicleId_groupIndex_month_key" ON "TbmEtcMeisai"("tbmVehicleId", "groupIndex", "month");

-- CreateIndex
CREATE UNIQUE INDEX "OdometerInput_tbmVehicleId_date_key" ON "OdometerInput"("tbmVehicleId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkStatus_userId_date_key" ON "UserWorkStatus"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "KyuyoTableRecord_userId_yearMonth_key" ON "KyuyoTableRecord"("userId", "yearMonth");

-- CreateIndex
CREATE INDEX "_StudentToUnfitFellow_B_index" ON "_StudentToUnfitFellow"("B");

-- CreateIndex
CREATE INDEX "_SquadToStudent_B_index" ON "_SquadToStudent"("B");

-- AddForeignKey
ALTER TABLE "MiddleCategory" ADD CONSTRAINT "MiddleCategory_bigCategoryId_fkey" FOREIGN KEY ("bigCategoryId") REFERENCES "BigCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_middleCategoryId_fkey" FOREIGN KEY ("middleCategoryId") REFERENCES "MiddleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLogAuthorizedUser" ADD CONSTRAINT "LessonLogAuthorizedUser_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLogAuthorizedUser" ADD CONSTRAINT "LessonLogAuthorizedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoFromUser" ADD CONSTRAINT "VideoFromUser_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoFromUser" ADD CONSTRAINT "VideoFromUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "KaizenReview" ADD CONSTRAINT "KaizenReview_kaizenClientId_fkey" FOREIGN KEY ("kaizenClientId") REFERENCES "KaizenClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KaizenWork" ADD CONSTRAINT "KaizenWork_kaizenClientId_fkey" FOREIGN KEY ("kaizenClientId") REFERENCES "KaizenClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KaizenWorkImage" ADD CONSTRAINT "KaizenWorkImage_kaizenWorkId_fkey" FOREIGN KEY ("kaizenWorkId") REFERENCES "KaizenWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleCart" ADD CONSTRAINT "AqSaleCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleCart" ADD CONSTRAINT "AqSaleCart_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_aqPriceOptionId_fkey" FOREIGN KEY ("aqPriceOptionId") REFERENCES "AqPriceOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_aqSaleCartId_fkey" FOREIGN KEY ("aqSaleCartId") REFERENCES "AqSaleCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqSaleRecord" ADD CONSTRAINT "AqSaleRecord_aqCustomerSubscriptionId_fkey" FOREIGN KEY ("aqCustomerSubscriptionId") REFERENCES "AqCustomerSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqProduct" ADD CONSTRAINT "AqProduct_aqProductCategoryMasterId_fkey" FOREIGN KEY ("aqProductCategoryMasterId") REFERENCES "AqProductCategoryMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqProduct" ADD CONSTRAINT "AqProduct_aqDefaultShiireAqCustomerId_fkey" FOREIGN KEY ("aqDefaultShiireAqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqPriceOption" ADD CONSTRAINT "AqPriceOption_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomer" ADD CONSTRAINT "AqCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerSubscription" ADD CONSTRAINT "AqCustomerSubscription_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerSubscription" ADD CONSTRAINT "AqCustomerSubscription_aqDeviceMasterId_fkey" FOREIGN KEY ("aqDeviceMasterId") REFERENCES "aqDeviceMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerSubscription" ADD CONSTRAINT "AqCustomerSubscription_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerPriceOption" ADD CONSTRAINT "AqCustomerPriceOption_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerPriceOption" ADD CONSTRAINT "AqCustomerPriceOption_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerPriceOption" ADD CONSTRAINT "AqCustomerPriceOption_aqPriceOptionId_fkey" FOREIGN KEY ("aqPriceOptionId") REFERENCES "AqPriceOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerRecord" ADD CONSTRAINT "AqCustomerRecord_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerRecord" ADD CONSTRAINT "AqCustomerRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerRecordAttachment" ADD CONSTRAINT "AqCustomerRecordAttachment_aqCustomerRecordId_fkey" FOREIGN KEY ("aqCustomerRecordId") REFERENCES "AqCustomerRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerDealerMidTable" ADD CONSTRAINT "AqCustomerDealerMidTable_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerDealerMidTable" ADD CONSTRAINT "AqCustomerDealerMidTable_aqDealerMasterId_fkey" FOREIGN KEY ("aqDealerMasterId") REFERENCES "AqDealerMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerServiceTypeMidTable" ADD CONSTRAINT "AqCustomerServiceTypeMidTable_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerServiceTypeMidTable" ADD CONSTRAINT "AqCustomerServiceTypeMidTable_aqServiecTypeMasterId_fkey" FOREIGN KEY ("aqServiecTypeMasterId") REFERENCES "AqServiecTypeMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerDeviceMidTable" ADD CONSTRAINT "AqCustomerDeviceMidTable_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerDeviceMidTable" ADD CONSTRAINT "AqCustomerDeviceMidTable_aqDeviceMasterId_fkey" FOREIGN KEY ("aqDeviceMasterId") REFERENCES "aqDeviceMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerSupportGroupMidTable" ADD CONSTRAINT "AqCustomerSupportGroupMidTable_aqSupportGroupMasterId_fkey" FOREIGN KEY ("aqSupportGroupMasterId") REFERENCES "AqSupportGroupMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqCustomerSupportGroupMidTable" ADD CONSTRAINT "AqCustomerSupportGroupMidTable_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqInventoryRegister" ADD CONSTRAINT "AqInventoryRegister_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqInventoryRegister" ADD CONSTRAINT "AqInventoryRegister_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqInventoryByMonth" ADD CONSTRAINT "AqInventoryByMonth_aqProductId_fkey" FOREIGN KEY ("aqProductId") REFERENCES "AqProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AqInquiry" ADD CONSTRAINT "AqInquiry_aqCustomerId_fkey" FOREIGN KEY ("aqCustomerId") REFERENCES "AqCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideBlock" ADD CONSTRAINT "SlideBlock_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideResponse" ADD CONSTRAINT "SlideResponse_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideResponse" ADD CONSTRAINT "SlideResponse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideResponse" ADD CONSTRAINT "SlideResponse_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningRoleMasterOnGame" ADD CONSTRAINT "LearningRoleMasterOnGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectNameMaster" ADD CONSTRAINT "SubjectNameMaster_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStudent" ADD CONSTRAINT "GameStudent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStudent" ADD CONSTRAINT "GameStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_subjectNameMasterId_fkey" FOREIGN KEY ("subjectNameMasterId") REFERENCES "SubjectNameMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCreateConfig" ADD CONSTRAINT "GroupCreateConfig_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_questionPromptId_fkey" FOREIGN KEY ("questionPromptId") REFERENCES "QuestionPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRole" ADD CONSTRAINT "StudentRole_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRole" ADD CONSTRAINT "StudentRole_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRole" ADD CONSTRAINT "StudentRole_learningRoleMasterOnGameId_fkey" FOREIGN KEY ("learningRoleMasterOnGameId") REFERENCES "LearningRoleMasterOnGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPrompt" ADD CONSTRAINT "QuestionPrompt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionPromptId_fkey" FOREIGN KEY ("questionPromptId") REFERENCES "QuestionPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthJournal" ADD CONSTRAINT "HealthJournal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthJournalEntry" ADD CONSTRAINT "HealthJournalEntry_healthJournalId_fkey" FOREIGN KEY ("healthJournalId") REFERENCES "HealthJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthJournalImage" ADD CONSTRAINT "HealthJournalImage_healthJournalEntryId_fkey" FOREIGN KEY ("healthJournalEntryId") REFERENCES "HealthJournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurringTaskId_fkey" FOREIGN KEY ("recurringTaskId") REFERENCES "RecurringTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeihiAttachment" ADD CONSTRAINT "KeihiAttachment_keihiExpenseId_fkey" FOREIGN KEY ("keihiExpenseId") REFERENCES "KeihiExpense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityScore" ADD CONSTRAINT "ActivityScore_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluationRequest" ADD CONSTRAINT "ActivityEvaluationRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluationRequest" ADD CONSTRAINT "ActivityEvaluationRequest_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluationRequest" ADD CONSTRAINT "ActivityEvaluationRequest_activityScoreId_fkey" FOREIGN KEY ("activityScoreId") REFERENCES "ActivityScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluationRequest" ADD CONSTRAINT "ActivityEvaluationRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmProductPriceHistory" ADD CONSTRAINT "SbmProductPriceHistory_sbmProductId_fkey" FOREIGN KEY ("sbmProductId") REFERENCES "SbmProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sbm_delivery_route_stops" ADD CONSTRAINT "sbm_delivery_route_stops_sbmDeliveryGroupId_fkey" FOREIGN KEY ("sbmDeliveryGroupId") REFERENCES "sbm_delivery_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sbm_delivery_route_stops" ADD CONSTRAINT "sbm_delivery_route_stops_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sbm_delivery_group_reservations" ADD CONSTRAINT "sbm_delivery_group_reservations_sbmDeliveryGroupId_fkey" FOREIGN KEY ("sbmDeliveryGroupId") REFERENCES "sbm_delivery_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sbm_delivery_group_reservations" ADD CONSTRAINT "sbm_delivery_group_reservations_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservation" ADD CONSTRAINT "SbmReservation_sbmCustomerId_fkey" FOREIGN KEY ("sbmCustomerId") REFERENCES "SbmCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservation" ADD CONSTRAINT "SbmReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservationItem" ADD CONSTRAINT "SbmReservationItem_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservationItem" ADD CONSTRAINT "SbmReservationItem_sbmProductId_fkey" FOREIGN KEY ("sbmProductId") REFERENCES "SbmProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservationTask" ADD CONSTRAINT "SbmReservationTask_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmReservationChangeHistory" ADD CONSTRAINT "SbmReservationChangeHistory_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmDeliveryAssignment" ADD CONSTRAINT "SbmDeliveryAssignment_sbmDeliveryTeamId_fkey" FOREIGN KEY ("sbmDeliveryTeamId") REFERENCES "SbmDeliveryTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmDeliveryAssignment" ADD CONSTRAINT "SbmDeliveryAssignment_sbmReservationId_fkey" FOREIGN KEY ("sbmReservationId") REFERENCES "SbmReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmDeliveryAssignment" ADD CONSTRAINT "SbmDeliveryAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SbmRfmAnalysis" ADD CONSTRAINT "SbmRfmAnalysis_sbmCustomerId_fkey" FOREIGN KEY ("sbmCustomerId") REFERENCES "SbmCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleMasterId_fkey" FOREIGN KEY ("roleMasterId") REFERENCES "RoleMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shiireSakiId_fkey" FOREIGN KEY ("shiireSakiId") REFERENCES "ShiireSaki"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayRemarksUser" ADD CONSTRAINT "DayRemarksUser_dayRemarksId_fkey" FOREIGN KEY ("dayRemarksId") REFERENCES "DayRemarks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayRemarksUser" ADD CONSTRAINT "DayRemarksUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genba" ADD CONSTRAINT "Genba_prefCityId_fkey" FOREIGN KEY ("prefCityId") REFERENCES "PrefCity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SohkenCar" ADD CONSTRAINT "SohkenCar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDay" ADD CONSTRAINT "GenbaDay_genbaId_fkey" FOREIGN KEY ("genbaId") REFERENCES "Genba"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaTask" ADD CONSTRAINT "GenbaTask_genbaId_fkey" FOREIGN KEY ("genbaId") REFERENCES "Genba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDayTaskMidTable" ADD CONSTRAINT "GenbaDayTaskMidTable_genbaDayId_fkey" FOREIGN KEY ("genbaDayId") REFERENCES "GenbaDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDayTaskMidTable" ADD CONSTRAINT "GenbaDayTaskMidTable_genbaTaskId_fkey" FOREIGN KEY ("genbaTaskId") REFERENCES "GenbaTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDaySoukenCar" ADD CONSTRAINT "GenbaDaySoukenCar_genbaDayId_fkey" FOREIGN KEY ("genbaDayId") REFERENCES "GenbaDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDaySoukenCar" ADD CONSTRAINT "GenbaDaySoukenCar_sohkenCarId_fkey" FOREIGN KEY ("sohkenCarId") REFERENCES "SohkenCar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDaySoukenCar" ADD CONSTRAINT "GenbaDaySoukenCar_genbaId_fkey" FOREIGN KEY ("genbaId") REFERENCES "Genba"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDayShift" ADD CONSTRAINT "GenbaDayShift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDayShift" ADD CONSTRAINT "GenbaDayShift_genbaDayId_fkey" FOREIGN KEY ("genbaDayId") REFERENCES "GenbaDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenbaDayShift" ADD CONSTRAINT "GenbaDayShift_genbaId_fkey" FOREIGN KEY ("genbaId") REFERENCES "Genba"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayRemarksFile" ADD CONSTRAINT "DayRemarksFile_dayRemarksId_fkey" FOREIGN KEY ("dayRemarksId") REFERENCES "DayRemarks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmRouteGroupCalendar" ADD CONSTRAINT "TbmRouteGroupCalendar_tbmRouteGroupId_fkey" FOREIGN KEY ("tbmRouteGroupId") REFERENCES "TbmRouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmKeihi" ADD CONSTRAINT "TbmKeihi_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmDriveScheduleImage" ADD CONSTRAINT "TbmDriveScheduleImage_tbmDriveScheduleId_fkey" FOREIGN KEY ("tbmDriveScheduleId") REFERENCES "TbmDriveSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmBase_MonthConfig" ADD CONSTRAINT "TbmBase_MonthConfig_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmVehicle" ADD CONSTRAINT "TbmVehicle_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmFuelCard" ADD CONSTRAINT "TbmFuelCard_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmVehicleMaintenanceRecord" ADD CONSTRAINT "TbmVehicleMaintenanceRecord_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmRouteGroup" ADD CONSTRAINT "TbmRouteGroup_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmRouteGroupFee" ADD CONSTRAINT "TbmRouteGroupFee_tbmRouteGroupId_fkey" FOREIGN KEY ("tbmRouteGroupId") REFERENCES "TbmRouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmMonthlyConfigForRouteGroup" ADD CONSTRAINT "TbmMonthlyConfigForRouteGroup_tbmRouteGroupId_fkey" FOREIGN KEY ("tbmRouteGroupId") REFERENCES "TbmRouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mid_TbmRouteGroup_TbmCustomer" ADD CONSTRAINT "Mid_TbmRouteGroup_TbmCustomer_tbmRouteGroupId_fkey" FOREIGN KEY ("tbmRouteGroupId") REFERENCES "TbmRouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mid_TbmRouteGroup_TbmCustomer" ADD CONSTRAINT "Mid_TbmRouteGroup_TbmCustomer_tbmCustomerId_fkey" FOREIGN KEY ("tbmCustomerId") REFERENCES "TbmCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmCustomer" ADD CONSTRAINT "TbmCustomer_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmRefuelHistory" ADD CONSTRAINT "TbmRefuelHistory_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmRefuelHistory" ADD CONSTRAINT "TbmRefuelHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmCarWashHistory" ADD CONSTRAINT "TbmCarWashHistory_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmCarWashHistory" ADD CONSTRAINT "TbmCarWashHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmDriveSchedule" ADD CONSTRAINT "TbmDriveSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmDriveSchedule" ADD CONSTRAINT "TbmDriveSchedule_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmDriveSchedule" ADD CONSTRAINT "TbmDriveSchedule_tbmRouteGroupId_fkey" FOREIGN KEY ("tbmRouteGroupId") REFERENCES "TbmRouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmDriveSchedule" ADD CONSTRAINT "TbmDriveSchedule_tbmBaseId_fkey" FOREIGN KEY ("tbmBaseId") REFERENCES "TbmBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmEtcMeisai" ADD CONSTRAINT "TbmEtcMeisai_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TbmEtcMeisai" ADD CONSTRAINT "TbmEtcMeisai_tbmDriveScheduleId_fkey" FOREIGN KEY ("tbmDriveScheduleId") REFERENCES "TbmDriveSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdometerInput" ADD CONSTRAINT "OdometerInput_tbmVehicleId_fkey" FOREIGN KEY ("tbmVehicleId") REFERENCES "TbmVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdometerInput" ADD CONSTRAINT "OdometerInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkStatus" ADD CONSTRAINT "UserWorkStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KyuyoTableRecord" ADD CONSTRAINT "KyuyoTableRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToUnfitFellow" ADD CONSTRAINT "_StudentToUnfitFellow_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToUnfitFellow" ADD CONSTRAINT "_StudentToUnfitFellow_B_fkey" FOREIGN KEY ("B") REFERENCES "UnfitFellow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SquadToStudent" ADD CONSTRAINT "_SquadToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SquadToStudent" ADD CONSTRAINT "_SquadToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
