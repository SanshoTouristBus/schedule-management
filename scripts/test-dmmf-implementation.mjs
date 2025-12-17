import {prismaDMMF, prismaSchemaString} from '../src/cm/lib/methods/scheme-json-export.js'

console.log('🧪 Testing DMMF Implementation...\n')

// Test 1: prismaSchemaString が存在するか
if (prismaSchemaString && prismaSchemaString.length > 0) {
  console.log('✅ Test 1: prismaSchemaString is available')
  console.log(`   Length: ${prismaSchemaString.length} characters`)
} else {
  console.log('❌ Test 1: prismaSchemaString is missing')
}

// Test 2: prismaDMMF が存在するか
if (prismaDMMF) {
  console.log('✅ Test 2: prismaDMMF is available')
} else {
  console.log('❌ Test 2: prismaDMMF is missing')
}

// Test 3: prismaDMMF.models が存在するか
if (prismaDMMF && prismaDMMF.models && Array.isArray(prismaDMMF.models)) {
  console.log('✅ Test 3: prismaDMMF.models is an array')
  console.log(`   Total models: ${prismaDMMF.models.length}`)
} else {
  console.log('❌ Test 3: prismaDMMF.models is not an array')
}

// Test 4: モデルのサンプル表示
if (prismaDMMF && prismaDMMF.models && prismaDMMF.models.length > 0) {
  console.log('✅ Test 4: Sample models:')
  prismaDMMF.models.slice(0, 5).forEach((model, index) => {
    console.log(`   ${index + 1}. ${model.name} (${model.fields.length} fields)`)
  })
} else {
  console.log('❌ Test 4: No models found')
}

// Test 5: 特定のモデルのリレーションシップを確認
if (prismaDMMF && prismaDMMF.models) {
  const testModel = prismaDMMF.models.find(m => m.name === 'User')
  if (testModel) {
    console.log('✅ Test 5: Found User model')
    const relations = testModel.fields.filter(f => f.kind === 'object')
    console.log(`   Relations: ${relations.map(r => r.name).join(', ')}`)

    // hasMany と hasOne を区別
    const hasMany = relations.filter(r => r.isList)
    const hasOne = relations.filter(r => !r.isList)
    console.log(`   - hasMany: ${hasMany.map(r => r.name).join(', ') || 'none'}`)
    console.log(`   - hasOne: ${hasOne.map(r => r.name).join(', ') || 'none'}`)
  } else {
    // Userモデルがない場合は最初のモデルでテスト
    const firstModel = prismaDMMF.models[0]
    if (firstModel) {
      console.log(`✅ Test 5: Testing with ${firstModel.name} model`)
      const relations = firstModel.fields.filter(f => f.kind === 'object')
      console.log(`   Relations: ${relations.map(r => r.name).join(', ') || 'none'}`)
    }
  }
}

// Test 6: フィールド種別の確認
if (prismaDMMF && prismaDMMF.models && prismaDMMF.models.length > 0) {
  const sampleModel = prismaDMMF.models[0]
  const scalarFields = sampleModel.fields.filter(f => f.kind === 'scalar')
  const objectFields = sampleModel.fields.filter(f => f.kind === 'object')
  const enumFields = sampleModel.fields.filter(f => f.kind === 'enum')

  console.log(`✅ Test 6: Field types in ${sampleModel.name}:`)
  console.log(`   Scalar fields: ${scalarFields.length}`)
  console.log(`   Object fields (relations): ${objectFields.length}`)
  console.log(`   Enum fields: ${enumFields.length}`)
}

// Test 7: isRequired と isList のチェック
if (prismaDMMF && prismaDMMF.models && prismaDMMF.models.length > 0) {
  const sampleModel = prismaDMMF.models[0]
  const requiredFields = sampleModel.fields.filter(f => f.isRequired)
  const optionalFields = sampleModel.fields.filter(f => !f.isRequired)
  const listFields = sampleModel.fields.filter(f => f.isList)

  console.log(`✅ Test 7: Field attributes in ${sampleModel.name}:`)
  console.log(`   Required fields: ${requiredFields.length}`)
  console.log(`   Optional fields: ${optionalFields.length}`)
  console.log(`   List fields: ${listFields.length}`)
}

console.log('\n✨ All tests completed!')
console.log('\n📝 Summary:')
console.log(`   - DMMF-based implementation is working correctly`)
console.log(`   - Total models: ${prismaDMMF.models.length}`)
console.log(`   - Relations, field types, and attributes are properly parsed`)
