/* eslint-disable no-undef */
// node scripts/update-subscription-to-contract.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateSubscriptionToContract() {
 try {
  console.log('🔄 定期購読 → 定期契約への一括更新を開始します...')

  // 1. 現在の[定期購読]レコード数を確認
  const beforeSaleCount = await prisma.aqSaleRecord.count({
   where: {
    remarks: {
     contains: '[定期購読]'
    }
   }
  })

  const beforeSubscriptionCount = await prisma.aqCustomerSubscription.count({
   where: {
    remarks: {
     contains: '[定期購読]'
    }
   }
  })

  console.log(`📊 更新対象:`)
  console.log(`  - AqSaleRecord: ${beforeSaleCount}件`)
  console.log(`  - AqCustomerSubscription: ${beforeSubscriptionCount}件`)

  // 2. AqSaleRecord テーブルの一括更新
  const saleRecordResult = await prisma.$executeRaw`
      UPDATE "AqSaleRecord"
      SET "remarks" = REPLACE("remarks", '[定期購読]', '[定期契約]')
      WHERE "remarks" LIKE '%[定期購読]%'
    `

  console.log(`✅ AqSaleRecord: ${saleRecordResult}件のレコードを更新しました`)

  // 3. AqCustomerSubscription テーブルの一括更新
  const subscriptionResult = await prisma.$executeRaw`
      UPDATE "AqCustomerSubscription"
      SET "remarks" = REPLACE("remarks", '[定期購読]', '[定期契約]')
      WHERE "remarks" LIKE '%[定期購読]%'
    `

  console.log(`✅ AqCustomerSubscription: ${subscriptionResult}件のレコードを更新しました`)

  // 4. 更新結果の確認
  const updatedSaleRecords = await prisma.aqSaleRecord.findMany({
   where: {
    remarks: {
     contains: '[定期契約]'
    }
   },
   select: {
    id: true,
    remarks: true,
    date: true
   },
   take: 5 // 最初の5件を表示
  })

  console.log('📋 更新されたSaleRecordの例:')
  updatedSaleRecords.forEach(record => {
   console.log(`  ID: ${record.id}, 日付: ${record.date.toISOString().split('T')[0]}, 備考: ${record.remarks}`)
  })

  // 5. 残っている[定期購読]があるかチェック
  const remainingSaleCount = await prisma.aqSaleRecord.count({
   where: {
    remarks: {
     contains: '[定期購読]'
    }
   }
  })

  const remainingSubscriptionCount = await prisma.aqCustomerSubscription.count({
   where: {
    remarks: {
     contains: '[定期購読]'
    }
   }
  })

  console.log('\n📊 更新後の状況:')
  if (remainingSaleCount > 0 || remainingSubscriptionCount > 0) {
   console.log(`⚠️  まだ[定期購読]が残っています:`)
   console.log(`  - AqSaleRecord: ${remainingSaleCount}件`)
   console.log(`  - AqCustomerSubscription: ${remainingSubscriptionCount}件`)
  } else {
   console.log('✅ すべての[定期購読]が[定期契約]に更新されました')
  }

  // 6. [定期契約]の総数を表示
  const contractSaleCount = await prisma.aqSaleRecord.count({
   where: {
    remarks: {
     contains: '[定期契約]'
    }
   }
  })

  const contractSubscriptionCount = await prisma.aqCustomerSubscription.count({
   where: {
    remarks: {
     contains: '[定期契約]'
    }
   }
  })

  console.log(`📈 [定期契約]の総数:`)
  console.log(`  - AqSaleRecord: ${contractSaleCount}件`)
  console.log(`  - AqCustomerSubscription: ${contractSubscriptionCount}件`)

 } catch (error) {
  console.error('❌ エラーが発生しました:', error)
  throw error
 } finally {
  await prisma.$disconnect()
 }
}

// スクリプト実行
if (require.main === module) {
 updateSubscriptionToContract()
  .then(() => {
   console.log('\n🎉 更新処理が完了しました')
   process.exit(0)
  })
  .catch((error) => {
   console.error('\n💥 処理中にエラーが発生しました:', error)
   process.exit(1)
  })
}

module.exports = { updateSubscriptionToContract }
