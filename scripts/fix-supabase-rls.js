const { Pool } = require('pg')

async function fixSupabaseRLS() {
  console.log('🔧 Corrigindo configurações de RLS no Supabase...')
  
  const pool = new Pool({
    connectionString: 'postgresql://postgres:Matheus10032006@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ Conectado ao Supabase!')
    
    // Habilitar RLS nas tabelas
    console.log('🔒 Habilitando RLS na tabela users...')
    await client.query('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY')
    
    console.log('🔒 Habilitando RLS na tabela raffles...')
    await client.query('ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY')
    
    // Criar políticas para a tabela users
    console.log('📋 Criando políticas para users...')
    await client.query(`
      CREATE POLICY "Users can view own data" ON public.users
      FOR SELECT USING (true)
    `)
    
    await client.query(`
      CREATE POLICY "Users can insert own data" ON public.users
      FOR INSERT WITH CHECK (true)
    `)
    
    await client.query(`
      CREATE POLICY "Users can update own data" ON public.users
      FOR UPDATE USING (true)
    `)
    
    // Criar políticas para a tabela raffles
    console.log('📋 Criando políticas para raffles...')
    await client.query(`
      CREATE POLICY "Users can view all raffles" ON public.raffles
      FOR SELECT USING (true)
    `)
    
    await client.query(`
      CREATE POLICY "Users can insert raffles" ON public.raffles
      FOR INSERT WITH CHECK (true)
    `)
    
    await client.query(`
      CREATE POLICY "Users can update own raffles" ON public.raffles
      FOR UPDATE USING (true)
    `)
    
    await client.query(`
      CREATE POLICY "Users can delete own raffles" ON public.raffles
      FOR DELETE USING (true)
    `)
    
    // Verificar se RLS está habilitado
    const rlsCheck = await client.query(`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'raffles')
    `)
    
    console.log('📊 Status do RLS:')
    rlsCheck.rows.forEach(row => {
      console.log(`   - ${row.tablename}: ${row.rowsecurity ? '✅ Habilitado' : '❌ Desabilitado'}`)
    })
    
    client.release()
    console.log('🎉 RLS configurado com sucesso!')
    console.log('')
    console.log('📝 Próximos passos:')
    console.log('   1. Verifique no painel do Supabase se os erros sumiram')
    console.log('   2. Teste a criação de conta novamente')
    console.log('   3. Se ainda houver problemas, verifique as variáveis de ambiente no Netlify')
    
  } catch (error) {
    console.error('❌ Erro ao configurar RLS:', error.message)
    console.log('')
    console.log('🔧 Possíveis soluções:')
    console.log('   1. Verifique se o projeto Supabase está ativo')
    console.log('   2. Confirme se a connection string está correta')
    console.log('   3. Tente executar: npm run test-supabase')
  } finally {
    await pool.end()
  }
}

fixSupabaseRLS()
